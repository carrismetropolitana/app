package pt.carrismetropolitana.mobile.services.cmapi

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.SerializationException

class CMAPI {
    companion object {
        val shared = CMAPI()
    }

    suspend fun getAlerts(): GtfsRt? {
        return try {
            CMAPINetworkService.apiService.getAlerts()
        } catch (e: Exception) {
            handleException("alerts", e)
            null
        }
    }

    suspend fun getStops(): List<Stop> {
        return try {
            CMAPINetworkService.apiService.getStops()
        } catch (e: Exception) {
            handleException("stops", e)
            emptyList()
        }
    }

    suspend fun getLines(): List<Line> {
        return try {
            CMAPINetworkService.apiService.getLines()
        } catch (e: Exception) {
            handleException("lines", e)
            emptyList()
        }
    }

    suspend fun getRoute(routeId: String): Route? {
        return try {
            CMAPINetworkService.apiService.getRoute(routeId)
        } catch (e: Exception) {
            handleException("route $routeId", e)
            null
        }
    }

    suspend fun getPattern(patternId: String): Pattern? {
        return try {
            CMAPINetworkService.apiService.getPattern(patternId)
        } catch (e: Exception) {
            handleException("pattern $patternId", e)
            null
        }
    }

    suspend fun getPatternVersions(patternId: String): List<Pattern> {
        return try {
            CMAPINetworkService.apiService.getPatternVersions(patternId)
        } catch (e: Exception) {
            handleException("pattern versions for $patternId", e)
            emptyList()
        }
    }

    suspend fun getStopETAs(stopId: String): List<RealtimeETA> {
        return try {
            CMAPINetworkService.apiService.getETAs(stopId)
        } catch (e: Exception) {
            handleException("ETAs for stop $stopId", e)
            emptyList()
        }
    }

    suspend fun getPatternETAs(patternId: String): List<PatternRealtimeETA> {
        return try {
            CMAPINetworkService.apiService.getPatternETAs(patternId)
        } catch (e: Exception) {
            handleException("ETAs for pattern $patternId", e)
            emptyList()
        }
    }

    suspend fun getVehicles(): List<Vehicle> {
        return try {
            CMAPINetworkService.apiService.getVehicles()
        } catch (e: Exception) {
            handleException("vehicles", e)
            emptyList()
        }
    }

    suspend fun getENCM(): List<ENCM> {
        return try {
            CMAPINetworkService.apiService.getENCM()
        } catch (e: Exception) {
            handleException("ENCMs", e)
            emptyList()
        }
    }

    suspend fun getShape(shapeId: String): Shape? {
        return try {
            CMAPINetworkService.apiService.getShape(shapeId)
        } catch (e: Exception) {
            handleException("shape $shapeId", e)
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