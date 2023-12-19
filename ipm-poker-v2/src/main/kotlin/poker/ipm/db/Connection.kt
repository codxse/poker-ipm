package poker.ipm.db

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.config.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction

object Connection {
    fun init(config: ApplicationConfig) {
        println(config)
        val driverClassName = config.property("ktor.db.driverClassName").getString()
        val jdbcURL = config.property("ktor.db.jdbcURL").getString()
        val user = config.property("ktor.db.user").getString()
        val password = config.property("ktor.db.password").getString()
        val dataSource = createHikariDataSource(url = jdbcURL, driver = driverClassName, user = user, passwd = password)

        Database.connect(dataSource)
        migrate(dataSource)
    }

    suspend fun <T>dbQuery(block: () -> T): T =
        withContext(Dispatchers.IO) {
            transaction { block() }
        }

    private fun migrate(ds: HikariDataSource) {
        Flyway.configure().dataSource(ds).load().migrate()
    }

    private fun createHikariDataSource(url: String, driver: String, user: String, passwd: String): HikariDataSource {
        return HikariDataSource(HikariConfig().apply {
            driverClassName = driver
            jdbcUrl = url
            username = user
            password = passwd
            maximumPoolSize = 3
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            validate()
        })
    }
}