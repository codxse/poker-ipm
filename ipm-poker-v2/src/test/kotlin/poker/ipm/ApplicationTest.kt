package poker.ipm

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlin.test.*
import poker.ipm.models.User

import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import poker.ipm.models.userStorage

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        client.get("/").apply {
            assertEquals(HttpStatusCode.OK, status)
            assertEquals("Hello World!", bodyAsText())
        }
    }

    @Test
    fun testGetUsers() = testApplication {
        client.get("/api/users").apply {
            assertEquals(HttpStatusCode.OK, this.status)
            assertEquals(ContentType.parse("application/json; charset=UTF-8"), this.contentType())
            assertEquals("""[{"id":"abc","firstName":"Nadiar","lastName":"Syaripul","email":"nadiar429@gmail.com"}]""", this.bodyAsText())
        }
    }

    @Test
    fun `get user by id when found`() = testApplication {
        client.get("/api/users/abc").apply {
            assertEquals(HttpStatusCode.OK, this.status)
            assertEquals(ContentType.parse("application/json; charset=UTF-8"), this.contentType())
            assertEquals("""{"id":"abc","firstName":"Nadiar","lastName":"Syaripul","email":"nadiar429@gmail.com"}""", this.bodyAsText())
        }
    }

    @Test
    fun `when param is not provided`() = testApplication {
        client.get("/api/users/ ").apply {
            assertEquals(HttpStatusCode.BadRequest, this.status)
            assertEquals(ContentType.parse("application/json; charset=UTF-8"), this.contentType())
            assertEquals("""{"error":"BadRequest","message":"Missing id"}""", this.bodyAsText())
        }
    }

    @Test
    fun `get user by id when not found`() = testApplication {
        client.get("/api/users/abc1").apply {
            assertEquals(HttpStatusCode.NotFound, this.status)
            assertEquals(ContentType.parse("application/json; charset=UTF-8"), this.contentType())
            assertEquals("""{"error":"NotFound","message":"No user with id abc1"}""", this.bodyAsText())
        }
    }

    @Test
    fun `create user`() = testApplication {
        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }
        client.post("/api/users") {
            contentType(ContentType.Application.Json)
            setBody(User(id = "jdoe", firstName = "Jhon", lastName = "Doe", email = "jdoe@email.com"))
        }.apply {
            assertEquals(HttpStatusCode.Created, this.status)
            assertEquals(ContentType.parse("application/json; charset=UTF-8"), this.contentType())
            assertEquals("""{"id":"jdoe","firstName":"Jhon","lastName":"Doe","email":"jdoe@email.com"}""", this.bodyAsText())
        }
    }

    @Test
    fun `bad request if delete not have param id`() = testApplication {
        client.delete("/api/users/ ").apply {
            assertEquals(HttpStatusCode.BadRequest, this.status)
            assertEquals(ContentType.parse("application/json; charset=UTF-8"), this.contentType())
            assertEquals("""{"error":"BadRequest","message":"Missing id"}""", this.bodyAsText())
        }
    }

    @Test
    @Ignore
    fun `delete user if user found`() = testApplication {
        assertEquals(1, userStorage.count())

        client.delete("/api/users/abc").apply {
            assertEquals(HttpStatusCode.Accepted, this.status)
            assertEquals(ContentType.parse("application/json; charset=UTF-8"), this.contentType())
            assertEquals("""{"message":"User successfully deleted"}""", this.bodyAsText())
        }
        assertEquals(0, userStorage.count())
    }

    @Test
    @Ignore
    fun `ignore delete if user not found`() = testApplication {
        val userStorage = mutableListOf<User>(User("abc", firstName = "Nadiar", lastName = "Syaripul", email = "nadiar429@gmail.com"))
        assertEquals(1, userStorage.count())

        client.delete("/api/users/abc1").apply {
            assertEquals(HttpStatusCode.NotFound, this.status)
            assertEquals(ContentType.parse("application/json; charset=UTF-8"), this.contentType())
            assertEquals("""{"error":"NotFound","message":"No user with id abc1"}""", this.bodyAsText())
        }
        assertEquals(1, userStorage.count())
    }
}
