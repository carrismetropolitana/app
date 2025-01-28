package pt.carrismetropolitana.mobile.composables.components.news

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import pt.carrismetropolitana.mobile.composables.CarouselItem
import pt.carrismetropolitana.mobile.composables.WrappingCarousel
import pt.carrismetropolitana.mobile.services.cmwordpressapi.CMWPAPI
import pt.carrismetropolitana.mobile.services.cmwordpressapi.News

@Composable
fun NewsCarousel(
    news: List<News>,
    onNewsClick: (news: News) -> Unit
) {
    var carouselItems by remember { mutableStateOf(emptyList<CarouselItem>()) }

    LaunchedEffect(news) {
        carouselItems = generateCarouselItems(news)
    }

    WrappingCarousel(
        items = carouselItems,
        onItemClick = { itemId ->
            onNewsClick(news.first { it.id == itemId.toInt() })
        }
    )
}

suspend fun generateCarouselItems(news: List<News>): List<CarouselItem> {
    return news.map {
        CarouselItem(
            id = it.id.toString(),
            imageUrl = it.featuredMedia.let { mediaId ->
                val media = CMWPAPI.shared.getMedia(mediaId)
                media?.sourceUrl ?: ""
            }
        )
    }
}