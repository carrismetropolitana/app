package pt.carrismetropolitana.mobile.services.imlapi

import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path

interface IMLAPIService {
    @GET("operators/{operatorId}/stop_by_ref/{stopId}")
    suspend fun getStopByOperatorId(@Path("operatorId") operatorId: Int, @Path("stopId") stopId: String): IMLStop?

    @GET("stops/{stopId}/pictures")
    suspend fun getStopPictures(@Path("stopId") stopId: Int): List<IMLPicture>
}

object IMLAPINetworkService {
    private const val BASE_URL = "https://api.intermodal.pt/v1"

    private val json = Json {
        ignoreUnknownKeys = true
    }

    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(
            json.asConverterFactory("application/json; charset=utf-8".toMediaType())
        )
        .build()

    val apiService: IMLAPIService = retrofit.create(IMLAPIService::class.java)
}