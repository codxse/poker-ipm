package poker.ipm.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class User(val id: String, val firstName: String, val lastName: String, val email: String)

val userStorage = mutableListOf<User>(User("abc", firstName = "Nadiar", lastName = "Syaripul", email = "nadiar429@gmail.com"))

object Users : Table() {
    val id = integer("id").autoIncrement()
    val firstName = varchar("firstName", 20)
    val lastName = varchar("lastName", 20)
    val email = varchar("email", 120).uniqueIndex()

    override val primaryKey = PrimaryKey(id)
}
