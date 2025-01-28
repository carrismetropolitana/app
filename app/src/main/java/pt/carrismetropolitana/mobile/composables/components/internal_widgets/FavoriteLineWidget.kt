package pt.carrismetropolitana.mobile.composables.components.internal_widgets

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import pt.carrismetropolitana.mobile.LocalLinesManager
import pt.carrismetropolitana.mobile.LocalVehiclesManager
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.composables.components.maps.PatternMapView
import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.Pattern
import pt.carrismetropolitana.mobile.services.cmapi.Shape
import pt.carrismetropolitana.mobile.services.favorites.FavoriteItem
import pt.carrismetropolitana.mobile.ui.animations.shimmerEffect

@Composable
fun FavoriteLineWidget(
    favoriteItem: FavoriteItem,
    onLineClick: () -> Unit,
) {
    val linesManager = LocalLinesManager.current
    val vehiclesManager = LocalVehiclesManager.current

    val line = linesManager.data.collectAsState().value.firstOrNull { it.id == favoriteItem.lineId }

    var pattern by remember { mutableStateOf<Pattern?>(null) }
    var shape by remember { mutableStateOf<Shape?>(null) }

    LaunchedEffect(Unit) {
        pattern = CMAPI.shared.getPattern(favoriteItem.patternIds.first())
        if (pattern != null) {
            shape = CMAPI.shared.getShape(pattern!!.shapeId)
        }

        vehiclesManager.startFetching()
    }

    DisposableEffect(Unit) {
        onDispose { vehiclesManager.stopFetching() }
    }

    val filteredVehicles = vehiclesManager.data.collectAsState().value.filter { it.patternId == favoriteItem.patternIds.first() }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surface)
            .clickable { onLineClick() }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 18.dp, horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    if (line != null) {
                        Pill(
                            text = line.shortName,
                            color = Color(line.color.toColorInt()),
                            textColor = Color(line.textColor.toColorInt()),
                            size = 60
                        )
                    } else {
                        Box(
                            modifier = Modifier
                                .width(72.dp)
                                .height(24.dp)
                                .clip(shape = RoundedCornerShape(50))
                                .shimmerEffect()
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    if (pattern != null) {
                        Text(
                            pattern?.headsign ?: "", fontWeight = FontWeight.Bold
                        )
                    } else {
                        Spacer(modifier = Modifier.width(12.dp))
                        Box(
                            modifier = Modifier
                                .height(20.dp)
                                .clip(shape = RoundedCornerShape(50))
                                .shimmerEffect()
                        )
                    }
                }
            }

            Icon(
                imageVector = ImageVector.vectorResource(R.drawable.chevron_right),
                contentDescription = "Chevron Right Icon",
                tint = Color.Gray,
            )
        }

        HorizontalDivider()

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
        ) {
            if (line != null && pattern != null && shape != null) {
                PatternMapView(
                    shape = shape!!,
                    lineColorHex = line.color,
                    stops = pattern!!.path.map { pathItem -> pathItem.stop },
                    vehicles = filteredVehicles,
                    disabledUserInteraction = true
                )
            } else {
                Box(modifier = Modifier
                    .fillMaxSize()
                    .shimmerEffect())
            }
        }
    }
}

//@Preview
//@Composable
//fun FavoriteLineWidgetPreview() {
//    FavoriteLineWidget()
//}