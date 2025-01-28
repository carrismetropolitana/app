package pt.carrismetropolitana.mobile.composables.components.transit.vehicles

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.navigation.NavController
import pt.carrismetropolitana.mobile.LocalLinesManager
import pt.carrismetropolitana.mobile.LocalStopsManager
import pt.carrismetropolitana.mobile.LocalVehiclesManager
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.composables.components.maps.PatternMapView
import pt.carrismetropolitana.mobile.composables.components.transit.pattern_path.PatternPath
import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.Pattern
import pt.carrismetropolitana.mobile.services.cmapi.Shape
import pt.carrismetropolitana.mobile.services.cmapi.Vehicle
import pt.carrismetropolitana.mobile.ui.animations.RealtimePingAnimation
import pt.carrismetropolitana.mobile.ui.theme.SmoothGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VehicleRealtimeTrackingView(
    vehicleId: String,
    navController: NavController
) {
    val vehiclesManager = LocalVehiclesManager.current
    val linesManager = LocalLinesManager.current

    val vehicle = vehiclesManager.data.collectAsState().value.firstOrNull { it.id == vehicleId }
    val line = linesManager.data.collectAsState().value.firstOrNull { it.id == vehicle?.lineId }
    var pattern by remember { mutableStateOf<Pattern?>(null) }
    var shape by remember { mutableStateOf<Shape?>(null) }

    LaunchedEffect(Unit) {
        vehiclesManager.startFetching()
        vehicle?.let {
            pattern = CMAPI.shared.getPattern(it.patternId)
            pattern?.let { pattern ->
                shape = CMAPI.shared.getShape(pattern.shapeId)
            }
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            vehiclesManager.stopFetching()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Autocarro") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (vehicle != null && line != null && pattern != null && shape != null) { // for now
            PatternPath(
                patternId = pattern!!.id,
                pathItems = pattern!!.path,
                pathColor = Color(line.color.toColorInt()),
                onSchedulesButtonClick = {},
                onStopDetailsButtonClick = {},
                modifier = Modifier.padding(paddingValues),
                hideBottomButtons = true
            ) {
                Column (
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 18.dp, horizontal = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Pill(
                        text = vehicle.lineId,
                        color = Color(line.color.toColorInt()),
                        textColor = Color(line.textColor.toColorInt()),
                        size = 60
                    )
                    Text("para")
                    Text(pattern!!.headsign, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                }

                HorizontalDivider()

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 18.dp, horizontal = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    Box(modifier = Modifier.size(18.dp)) {
                        RealtimePingAnimation(
                            color = SmoothGreen
                        )
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(13.dp))
                            .background(Color.LightGray),
                    ) {
                        Text(
                            vehicle.id, modifier = Modifier
                                .padding(horizontal = 8.dp)
                        )
                    }
                }

                HorizontalDivider()

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                ) {
                    PatternMapView(
                        shape = shape!!,
                        lineColorHex = line.color,
                        stops = pattern!!.path.map { pathItem -> pathItem.stop },
                        vehicles = listOf(vehicle)
                    )
                }
            }
        }
    }
}