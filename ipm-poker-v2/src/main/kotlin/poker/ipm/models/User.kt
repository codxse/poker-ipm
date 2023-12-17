package poker.ipm.models

import kotlinx.serialization.Serializable

@Serializable
data class User(val id: String, val firstName: String, val lastName: String, val email: String)

val userStorage = mutableListOf<User>(User("abc", firstName = "Nadiar", lastName = "Syaripul", email = "nadiar429@gmail.com"))
