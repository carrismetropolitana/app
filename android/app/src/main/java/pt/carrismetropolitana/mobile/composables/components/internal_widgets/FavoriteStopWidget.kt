package pt.carrismetropolitana.mobile.composables.components.internal_widgets

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.max
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.firstOrNull
import pt.carrismetropolitana.mobile.LocalLinesManager
import pt.carrismetropolitana.mobile.LocalStopsManager
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.composables.screens.stops.adjustTimeFormat
import pt.carrismetropolitana.mobile.composables.screens.stops.filterAndSortStopArrivalsByCurrentAndFuture
import pt.carrismetropolitana.mobile.composables.screens.stops.getRoundedMinuteDifferenceFromNow
import pt.carrismetropolitana.mobile.composables.screens.stops.getTimeStringFromMinutes
import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.Line
import pt.carrismetropolitana.mobile.services.cmapi.Pattern
import pt.carrismetropolitana.mobile.services.cmapi.PatternRealtimeETA
import pt.carrismetropolitana.mobile.services.cmapi.RealtimeETA
import pt.carrismetropolitana.mobile.services.cmapi.Stop
import pt.carrismetropolitana.mobile.services.favorites.FavoriteItem
import pt.carrismetropolitana.mobile.ui.animations.RealtimePingAnimation
import pt.carrismetropolitana.mobile.ui.animations.shimmerEffect
import pt.carrismetropolitana.mobile.ui.theme.CMSystemBorder100
import pt.carrismetropolitana.mobile.ui.theme.SmoothGreen


@Composable
fun FavoriteStopWidget(
    favoriteItem: FavoriteItem,
    onStopClick: () -> Unit,
    onLineClick: (lineId: String, patternId: String) -> Unit,
) {
    val stopsManager = LocalStopsManager.current

    var patterns by remember { mutableStateOf(listOf<Pattern>()) }
    var nextArrivalsForStop by remember { mutableStateOf(listOf<RealtimeETA>()) }

    LaunchedEffect(Unit) {
        for (patternId in favoriteItem.patternIds) {
            val pattern = CMAPI.shared.getPattern(patternId)
            pattern?.let { patterns += it }
        }


        while (true) {
            val arrivals = CMAPI.shared.getStopETAs(favoriteItem.stopId!!)
            nextArrivalsForStop = filterAndSortStopArrivalsByCurrentAndFuture(arrivals)
            delay(5000)
        }
    }

    val stop = stopsManager.data.collectAsState().value.firstOrNull { it.id == favoriteItem.stopId }

    Column(
        modifier = Modifier
            .shadow(
                elevation = 50.dp,
                shape = RoundedCornerShape(12.dp),
                ambientColor = Color.Black.copy(alpha = 0.4f),
                spotColor = Color.Black.copy(alpha = 0.4f)
            )
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surface)
            .fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .clickable { onStopClick() }
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            stop?.let {
                Box(modifier = Modifier.weight(1f)) {
                    Column {
                        Text(it.name, fontWeight = FontWeight.Bold)
                        Text(
                            text = if (it.locality == it.municipalityName) it.locality else (if (it.locality == null) it.municipalityName else "${it.locality}, ${it.municipalityName}"),
                            color = Color.Gray
                        )
                    }
                }
            }


            if (stop == null) {
                Column(
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .height(20.dp)
                            .width(200.dp)
                            .clip(RoundedCornerShape(50))
                            .shimmerEffect()
                    )
                    Box(
                        modifier = Modifier
                            .height(20.dp)
                            .width(128.dp)
                            .clip(RoundedCornerShape(50))
                            .shimmerEffect()
                    )
                }
            }

//            Icon(
//                imageVector = ImageVector.vectorResource(R.drawable.phosphoricons_star_fill),
//                contentDescription = "Favorite",
//                tint = Color("#ffcc00".toColorInt())
//            )

            Icon(
                imageVector = ImageVector.vectorResource(R.drawable.chevron_right),
                contentDescription = "Chevron Right Icon",
                tint = Color.Gray,
            )
        }

        HorizontalDivider(thickness = 2.dp)

        for (patternId in favoriteItem.patternIds) {
            val pattern = patterns.firstOrNull { it.id == patternId }
            FavoriteStopPatternItem(favoriteItem, pattern, nextArrivalsForStop, onClick = {
                if (pattern != null) {
                    onLineClick(pattern.lineId, patternId)
                }
            })
            if (patternId != favoriteItem.patternIds.last()) {
                HorizontalDivider()
            }
        }
    }
}

@Composable
fun FavoriteStopPatternItem(
    favoriteItem: FavoriteItem,
    pattern: Pattern?,
    nextArrivalsForStop: List<RealtimeETA>,
    onClick: () -> Unit
) {
    val nextArrival = nextArrivalsForStop.firstOrNull { it.patternId == pattern?.id }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(12.dp)
            .clickable { onClick() },
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.weight(1f)
        ) {
            if (pattern != null) {
                Pill(
                    text = pattern.lineId,
                    color = Color(pattern.color.toColorInt()),
                    textColor = Color(pattern.textColor.toColorInt()),
                    size = 60
                )
            } else {
                Box(modifier = Modifier
                    .width(72.dp)
                    .height(24.dp)
                    .clip(shape = RoundedCornerShape(50))
                    .shimmerEffect())
            }
            Icon(imageVector = Icons.Default.ArrowForward, contentDescription = "Arrow", Modifier.size(15.dp))

            if (pattern != null) {
                Box(modifier = Modifier.weight(1f)) {
                    Text(
                        text = pattern?.headsign ?: "",
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            } else {
                Box(modifier = Modifier
                    .weight(1f)
                    .height(20.dp)
                    .clip(shape = RoundedCornerShape(50))
                    .shimmerEffect())
            }
        }

        if (nextArrival != null) {
            if (nextArrival.estimatedArrivalUnix != null) {
                Box(modifier = Modifier.size(18.dp)) {
                    RealtimePingAnimation(
                        color = SmoothGreen
                    )
                }
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    "${getTimeStringFromMinutes(getRoundedMinuteDifferenceFromNow(nextArrival.estimatedArrivalUnix))}",
                    color = SmoothGreen,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.width(70.dp)
                )
            } else {
                nextArrival.scheduledArrival?.let {
                    adjustTimeFormat(
                        it.substring(0, 5)
                    )?.let { formattedTime ->
                        Text(
                            text = formattedTime,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.width(60.dp)
                        )
                    }
                }
            }
        }
    }
}

//@Preview
//@Composable
//fun FavoriteStopWidgetPreview() {
//    Column(
//    ) {
//        FavoriteStopWidget(onStopClick = { /*TODO*/ }, onLineClick = { lineId, patternId ->  /*TODO*/ })
//    }
//}