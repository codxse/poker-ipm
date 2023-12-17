package poker.ipm.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import poker.ipm.models.ErrorResponse
import poker.ipm.models.MessageResponse
import poker.ipm.models.User
import poker.ipm.models.userStorage

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Hello World!")
        }
        apiRouting()
    }
}

fun Route.apiRouting() {
    route("/api/users") {
        get() {
            call.respond(userStorage)
        }
        get("{id?}") {
            val id = call.parameters["id"] ?: return@get call.respond(
                status = HttpStatusCode.BadRequest,
                message = ErrorResponse("BadRequest", "Missing id")
            )
            val user = userStorage.find { it.id == id } ?:
                return@get call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ErrorResponse("NotFound", "No user with id $id")
                )

            call.respond(user)
        }
        post {
            val user = call.receive<User>()
            userStorage.add(user)

            call.respond(status = HttpStatusCode.Created, message = user)
        }
        delete("{id?}") {
            val id = call.parameters["id"] ?: return@delete call.respond(
                message = ErrorResponse("BadRequest", "Missing id"),
                status = HttpStatusCode.BadRequest
            )
            if (userStorage.removeIf { id == it.id }) {
                call.respond(status = HttpStatusCode.Accepted, message = MessageResponse("User successfully deleted"))
            } else {
                call.respond(status = HttpStatusCode.NotFound, message = ErrorResponse("NotFound", "No user with id $id"))
            }
        }
    }
}
