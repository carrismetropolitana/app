package pt.carrismetropolitana.mobile.composables

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.collectIsDraggedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.collectLatest
import java.net.URL
import coil.compose.AsyncImage
import coil.request.ImageRequest
import pt.carrismetropolitana.mobile.ui.animations.shimmerEffect

private const val SCROLL_ANIMATION_DURATION = 5_000L

data class CarouselItem(
    val id: String,
    val imageUrl: String
)

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun WrappingCarousel(
    items: List<CarouselItem>,
    modifier: Modifier = Modifier,
    onItemClick: (itemId: String) -> Unit
) {
    Column(
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (items.isEmpty()) {
            Box(
                modifier = modifier
                    .padding(horizontal = 16.dp)
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(shape = RoundedCornerShape(size = 12.dp))
                    .shimmerEffect()
            )
        } else {
            Box(
                modifier = modifier
                    .fillMaxWidth()
                    .height(200.dp)
            ) {
                val pagerState = rememberPagerState(pageCount = { items.size })
                val isDraggedState = pagerState.interactionSource.collectIsDraggedAsState()

                HorizontalPager(
                    state = pagerState,
                    modifier = Modifier
                        .fillMaxWidth()
                        .fillMaxHeight()
                ) { page ->
                    CarouselItem(
                        item = items[page],
                        onClick = { onItemClick(items[page].id) }
                    )
                }

                // Start auto-scroll effect
                LaunchedEffect(isDraggedState) {
                    snapshotFlow { isDraggedState.value }
                        .collectLatest { isDragged ->
                            if (!isDragged) {
                                while (true) {
                                    delay(SCROLL_ANIMATION_DURATION)
                                    runCatching {
                                        pagerState.animateScrollToPage(
                                            pagerState.currentPage.inc() % pagerState.pageCount
                                        )
                                    }
                                }
                            }
                        }
                }
            }
        }
    }
}

@Composable
fun CarouselItem(
    item: CarouselItem,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .padding(horizontal = 16.dp)
            .fillMaxWidth()
            .fillMaxHeight()
            .clip(shape = RoundedCornerShape(size = 12.dp))
            .background(MaterialTheme.colorScheme.surface)
            .clickable(onClick = onClick)
    ) {
        AsyncImage(
            model = ImageRequest.Builder(LocalContext.current)
                .data(item.imageUrl)
                .crossfade(true)
                .build(),
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight()
                .clip(shape = RoundedCornerShape(size = 12.dp)),
            contentDescription = null,
            contentScale = ContentScale.Crop
        )
    }
}