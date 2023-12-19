package poker.ipm

import io.ktor.server.application.*
import poker.ipm.db.Connection
import poker.ipm.plugins.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    Connection.init(environment.config)
    configureSerialization()
    configureRouting()
}
