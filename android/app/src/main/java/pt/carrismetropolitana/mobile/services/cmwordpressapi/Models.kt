package pt.carrismetropolitana.mobile.services.cmwordpressapi

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

@Serializable
data class News(
    val id: Int,
    val date: String,
    @SerialName("date_gmt") val dateGmt: String,
    val modified: String,
    @SerialName("modified_gmt") val modifiedGmt: String,
    val slug: String,
    val status: String,
    val type: String,
    val link: String,
    val title: HasRenderedValue,
    @SerialName("featured_media") val featuredMedia: Int,
)

@Serializable
data class Media(
    val id: Int,
    val guid: HasRenderedValue,
    @SerialName("source_url") val sourceUrl: String,
)

@Serializable
data class HasRenderedValue(
    val rendered: String
)