package pt.carrismetropolitana.mobile.services.cmwebapi

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.SerializationException

class CMWebAPI {
    companion object {
        val shared = CMWebAPI()
    }

    suspend fun getStartupMessages(): List<StartupMessage> {
        return try {
            CMWebAPINetworkService.apiService.getStartupMessages()
        } catch (e: Exception) {
            handleException("startup messages", e)
            listOf()
        }
    }

    private fun handleException(context: String, e: Exception) {
        when (e) {
            is SerializationException -> println("Failed to deserialize $context: ${e.message}")
            else -> println("Failed to fetch $context: ${e.message}")
        }
    }
}