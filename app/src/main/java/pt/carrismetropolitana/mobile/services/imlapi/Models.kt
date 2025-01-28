package pt.carrismetropolitana.mobile.services.imlapi

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

@Serializable
data class IMLStop(
    val id: Int,
    val name: String,
    @SerialName("short_name") val shortName: String?,
    val lat: Double,
    val lon: Double
)

@Serializable
data class IMLPicture(
    val id: Int,
    @SerialName("capture_date") val captureDate: String,
    @SerialName("url_full") val urlFull: String,
    @SerialName("url_medium") val urlMedium: String,
    @SerialName("url_thumb") val urlThumb: String
)