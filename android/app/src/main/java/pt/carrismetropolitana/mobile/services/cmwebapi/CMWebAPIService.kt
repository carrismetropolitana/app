package pt.carrismetropolitana.mobile.services.cmwebapi

import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Url

interface CMWebAPIService {
    @GET("v1/startup/message")
    suspend fun getStartupMessages(): List<StartupMessage>
}

object CMWebAPINetworkService {
    private const val BASE_URL = "https://www.cmet.pt/api/app-android/"

    private val json = Json {
        ignoreUnknownKeys = true
    }

    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(
            json.asConverterFactory("application/json; charset=utf-8".toMediaType())
        )
        .build()

    val apiService: CMWebAPIService = retrofit.create(CMWebAPIService::class.java)
}