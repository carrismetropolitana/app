package pt.carrismetropolitana.mobile.services.cmapi

import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Url

interface CMAPIService {
    @GET("alerts")
    suspend fun getAlerts(): GtfsRt

    @GET("stops")
    suspend fun getStops(): List<Stop>

    @GET("lines")
    suspend fun getLines(): List<Line>

    @GET("routes/{routeId}")
    suspend fun getRoute(@Path("routeId") routeId: String): Route

    @GET("patterns/{patternId}")
    suspend fun getPattern(@Path("patternId") patternId: String): Pattern

    @GET("v2/patterns/{patternId}")
    suspend fun getPatternVersions(@Path("patternId") patternId: String): List<Pattern>

    @GET("stops/{stopId}/realtime")
    suspend fun getETAs(@Path("stopId") stopId: String): List<RealtimeETA>

    @GET("patterns/{patternId}/realtime")
    suspend fun getPatternETAs(@Path("patternId") patternId: String): List<PatternRealtimeETA>

    @GET("vehicles")
    suspend fun getVehicles(): List<Vehicle>

    @GET("datasets/facilities/encm")
    suspend fun getENCM(): List<ENCM>

    @GET("shapes/{shapeId}")
    suspend fun getShape(@Path("shapeId") shapeId: String): Shape
}

object CMAPINetworkService {
    private const val BASE_URL = "https://api.carrismetropolitana.pt/"

    private val json = Json {
        ignoreUnknownKeys = true
    }

    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(
            json.asConverterFactory("application/json; charset=utf-8".toMediaType())
        )
        .build()

    val apiService: CMAPIService = retrofit.create(CMAPIService::class.java)
}