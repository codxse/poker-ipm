package poker.ipm.models

import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponse(val error: String, val message: String)
