package pt.carrismetropolitana.mobile.services.cmwebapi

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
enum class PresentationType {
    @SerialName("breaking") Breaking,
    @SerialName("changelog") Changelog
}

@Serializable
data class StartupMessage(
    @SerialName("message_id") val messageId: String,
    @SerialName("build_max") val buildMax: Int?,
    @SerialName("build_min") val buildMin: Int?,
    @SerialName("presentation_type") val presentationType: PresentationType,
    @SerialName("url_host") val urlHost: String,
    @SerialName("url_path") val urlPath: String,
)