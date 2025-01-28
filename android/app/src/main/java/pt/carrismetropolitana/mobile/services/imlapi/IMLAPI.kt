package pt.carrismetropolitana.mobile.services.imlapi

import kotlinx.serialization.SerializationException

class IMLAPI {
    companion object {
        val shared = IMLAPI()
    }

    suspend fun getStopByOperatorId(operatorId: Int = 1, stopId: String): IMLStop? {
        return try {
            IMLAPINetworkService.apiService.getStopByOperatorId(operatorId, stopId)
        } catch (e: Exception) {
            handleException("stop by operator id $operatorId and stop id $stopId", e)
            null
        }
    }

    suspend fun getStopPictures(stopId: Int): List<IMLPicture> {
        return try {
            IMLAPINetworkService.apiService.getStopPictures(stopId)
        } catch (e: Exception) {
            handleException("stop pictures for $stopId", e)
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