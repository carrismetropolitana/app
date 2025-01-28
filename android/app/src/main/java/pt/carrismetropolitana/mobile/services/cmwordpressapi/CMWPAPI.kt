package pt.carrismetropolitana.mobile.services.cmwordpressapi

import kotlinx.serialization.SerializationException

class CMWPAPI {
    companion object {
        val shared = CMWPAPI()
    }

    suspend fun getNews(): List<News> {
        return try {
            CMWPAPINetworkService.apiService.getNews(10)
        } catch (e: Exception) {
            handleException("news", e)
            emptyList()
        }
    }

    suspend fun getMedia(mediaId: Int): Media? {
        return try {
            CMWPAPINetworkService.apiService.getMedia(mediaId)
        } catch (e: Exception) {
            handleException("media $mediaId", e)
            null
        }
    }

    private fun handleException(context: String, e: Exception) {
        when (e) {
            is SerializationException -> println("Failed to deserialize $context: ${e.message}")
            else -> println("Failed to fetch $context: ${e.message}")
        }
    }
}
