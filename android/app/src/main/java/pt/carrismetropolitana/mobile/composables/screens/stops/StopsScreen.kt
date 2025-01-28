package pt.carrismetropolitana.mobile.composables.screens.stops

import android.location.Location
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SearchBar
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.graphics.toColorInt
import androidx.navigation.NavController
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.maplibre.android.MapLibre
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.maps.MapView
import pt.carrismetropolitana.mobile.LocalLinesManager
import pt.carrismetropolitana.mobile.LocalStopsManager
import pt.carrismetropolitana.mobile.LocalVehiclesManager
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.Screens
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.composables.components.maps.MapVisualStyle
import pt.carrismetropolitana.mobile.composables.components.maps.StopsMapView
import pt.carrismetropolitana.mobile.composables.components.maps.overlays.MapFloatingButton
import pt.carrismetropolitana.mobile.composables.components.transit.stops.StopsList
import pt.carrismetropolitana.mobile.helpers.checkLocationPermission
import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.RealtimeETA
import pt.carrismetropolitana.mobile.services.cmapi.Stop
import pt.carrismetropolitana.mobile.ui.animations.RealtimePingAnimation
import pt.carrismetropolitana.mobile.ui.theme.SmoothGreen
import pt.carrismetropolitana.mobile.utils.normalizedForSearch
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StopsScreen(
    parentPaddingValues: PaddingValues,
    onStopDetailsClick: (stopId: String) -> Unit,
    onVehicleRealtimeTrackingClick: (vehicleId: String) -> Unit,
    onLineDetailsClick: (lineId: String) -> Unit
) {
    val context = LocalContext.current

    val stopsManager = LocalStopsManager.current
    val vehiclesManager = LocalVehiclesManager.current

    val coroutineScope = rememberCoroutineScope()

    var text by rememberSaveable {
        mutableStateOf("")
    }

    var active by rememberSaveable {
        mutableStateOf(false)
    }

    val sheetState = rememberModalBottomSheetState()
    var showBottomSheet by rememberSaveable { mutableStateOf(false) }

    val selectedStopId = rememberSaveable { mutableStateOf<String?>(null) }

    var searchFilteredStops by rememberSaveable { mutableStateOf<List<Stop>>(listOf()) }

    var mapVisualStyle by rememberSaveable { mutableStateOf(MapVisualStyle.MAP) }

    LaunchedEffect(text) {
        if (text.isNotEmpty()) {
            val normalizedText = text.normalizedForSearch()
            searchFilteredStops = stopsManager.data.value.filter {
                it.nameNormalized.contains(normalizedText, true)
                        || it.id.contains(normalizedText, true)
                        || it.ttsNameNormalized?.contains(normalizedText, true) ?: false
            }
        } else {
            searchFilteredStops = listOf()
        }
    }

    var cameraPosition = remember { mutableStateOf(CameraPosition.Builder().target(LatLng(38.7, -9.0)).zoom(8.9).build()) }
    val userLocation = rememberSaveable { mutableStateOf(Location(null)) }

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.SpaceAround,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            StopsMapView(
                stops = stopsManager.data.collectAsState().value,
                cameraPosition = cameraPosition,
                userLocation = userLocation,
                mapVisualStyle = mapVisualStyle,
                onStopClick = { stopId ->
                    selectedStopId.value = stopId
                    showBottomSheet = true
                }
            ) // TODO: this is getting initalized everytime the StopsScreen is opened, keep state between screen changes

            SearchBar(
                query = text,
                onQueryChange = {
                    text = it
                },
                onSearch = {
                    active = false
                },
                active = active,
                onActiveChange = {
                    active = it
                },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Search, contentDescription = "Search Icon")
                },
                trailingIcon = {
                    if (active)
                        Icon(
                            modifier = Modifier.clickable {
                                if (text.isNotEmpty()) {
                                    text = ""
                                } else {
                                    active = false
                                }
                            },
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close Icon"
                        )
                },
                placeholder = {
                    Text(text = "Pesquisar paragens")
                },
                modifier = Modifier
                    .align(Alignment.TopCenter)
            ) {
                StopsList(stops = searchFilteredStops, onStopClick = { stopId ->
                    onStopDetailsClick(stopId)
                })
            }

//            Column(
//                modifier = Modifier
//                    .fillMaxSize()
//                    .padding(bottom = 150.dp),
//                verticalArrangement = Arrangement.Bottom,
//                horizontalAlignment = Alignment.CenterHorizontally
//            ) {
//                Button(onClick = { navController.navigate("stop_details") })  {
//                    Text("Ver detalhes da paragem de demonstração")
//                }
//            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(end = 12.dp)
                    .padding(bottom = parentPaddingValues.calculateBottomPadding() + 30.dp), // TODO: use paddingValues to account for bottom safe area
                verticalArrangement = Arrangement.Bottom,
                horizontalAlignment = Alignment.End
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    val navigationArrowIconResource = if (checkLocationPermission(context)) { R.drawable.phosphoricons_navigation_arrow_fill } else { R.drawable.no_location_icon }
                    MapFloatingButton(iconResourceId = navigationArrowIconResource, disabled = !checkLocationPermission(context)) {
                        if (checkLocationPermission(context)) {
                            val userLocationLatLng =
                                LatLng(userLocation.value.latitude, userLocation.value.longitude)
                            println("Setting camera position to ${userLocationLatLng.latitude}, ${userLocationLatLng.longitude}")
                            cameraPosition.value = CameraPosition.Builder().target(userLocationLatLng).zoom(8.0).build() // lil hacky way for it to detect the change
                            cameraPosition.value =
                                CameraPosition.Builder().target(userLocationLatLng).zoom(10.0)
                                    .build()
                        }
                    }
                    MapFloatingButton(iconResourceId = R.drawable.phosphoricons_map_trifold) {
                        mapVisualStyle = if (mapVisualStyle == MapVisualStyle.MAP) {
                            MapVisualStyle.SATELLITE
                        } else {
                            MapVisualStyle.MAP
                        }
                    }
                }
            }
        }
    }

    if (showBottomSheet) {
        ModalBottomSheet(
            onDismissRequest = {
                showBottomSheet = false
            },
            sheetState = sheetState,
        ) {
            stopsManager.data.collectAsState().value.firstOrNull { it.id == selectedStopId.value }?.let {
                StopDetailsSheetView(
                    stop = it,
                    onOpenStopDetails = {
                        coroutineScope.launch {
                            sheetState.hide()
                        }
                        showBottomSheet = false
                        onStopDetailsClick(it.id)
                    },
                    onArrivalClick = { arrival ->
                        showBottomSheet = false
                        if (arrival.estimatedArrivalUnix != null && arrival.vehicleId != null) {
                            val vehicle = vehiclesManager.data.value.firstOrNull { it.id == arrival.vehicleId }
                            if (vehicle != null) {
                                onVehicleRealtimeTrackingClick(arrival.vehicleId)
                                return@StopDetailsSheetView
                            }

                            // vehicle not found
                        }

                        // when not realtime or if realtime but no vehicle found, open line details
                        onLineDetailsClick(arrival.lineId)
                    }
                )
            }
        }
    }
}


fun filterAndSortStopArrivalsByCurrentAndFuture(etas: List<RealtimeETA>): List<RealtimeETA> {
    val fixedEtas = mutableListOf<RealtimeETA>()

    val currentAndFutureFiltering = etas.filter { eta ->
        val tripHasObservedArrival = eta.observedArrivalUnix != null
        val tripScheduledArrivalIsInThePast =
            (eta.scheduledArrivalUnix ?: 0) <= System.currentTimeMillis() / 1000
        val tripHasScheduledArrival = eta.scheduledArrivalUnix != null
        val tripHasEstimatedArrival = eta.estimatedArrivalUnix != null
        val tripEstimatedArrivalIsInThePast =
            (eta.estimatedArrivalUnix ?: 0) <= System.currentTimeMillis() / 1000
        val tripEstimatedArrivalIsInTheFuture = (eta.estimatedArrivalUnix ?: 0) >= System.currentTimeMillis() / 1000

        val estimatedArrivalAfterMidnight = tripHasEstimatedArrival && eta.estimatedArrival!!.substring(0, 2).toInt() > 23
        val scheduledArrivalAfterMidnight = tripHasScheduledArrival && eta.scheduledArrival!!.substring(0, 2).toInt() > 23

        if (tripScheduledArrivalIsInThePast && !tripEstimatedArrivalIsInTheFuture) {
            return@filter false
        }

        if (tripHasEstimatedArrival && tripEstimatedArrivalIsInThePast) {
            return@filter false
        }

        if (tripHasObservedArrival) {
            return@filter false
        }

        // Fix for past midnight estimatedArrivals represented as being in the day before
        if (tripHasEstimatedArrival && !estimatedArrivalAfterMidnight && scheduledArrivalAfterMidnight) {
            val fixedEta = eta.copy(estimatedArrivalUnix = eta.estimatedArrivalUnix?.plus(86400)) // estimatedArrival not fixed currently, but atm not being used for anything
            fixedEtas += fixedEta

            return@filter false
        }

        true
    }

    println("Filtered ${currentAndFutureFiltering.size} ETAs as currentAndFuture.")

    val etasToSort = currentAndFutureFiltering + fixedEtas

    val sorted = etasToSort.sortedWith { a, b ->
        val estimatedArrivalA = a.estimatedArrivalUnix
        val estimatedArrivalB = b.estimatedArrivalUnix

        when {
            estimatedArrivalA != null && estimatedArrivalB != null -> {
                estimatedArrivalA.compareTo(estimatedArrivalB)
            }
            estimatedArrivalA != null -> {
                -1
            }
            estimatedArrivalB != null -> {
                1
            }
            else -> {
                a.scheduledArrivalUnix!!.compareTo(b.scheduledArrivalUnix!!)
            }
        }
    }

    return sorted
}


@Composable
fun StopDetailsSheetView(
    stop: Stop,
    onOpenStopDetails: () -> Unit,
    onArrivalClick: (arrival: RealtimeETA) -> Unit
) {
    val linesManager = LocalLinesManager.current

    var arrivalsForStop by remember { mutableStateOf(listOf<RealtimeETA>()) }

    LaunchedEffect(Unit) {
        while (true) {
            println("Fetching arrivals for stop ${stop.id}")
            val arrivals = CMAPI.shared.getStopETAs(stop.id)
            arrivalsForStop = arrivals
            delay(5000)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 12.dp)
                .padding(bottom = 12.dp)
                .fillMaxWidth()
                .clickable {
                    onOpenStopDetails()
                },
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(text = stop.name, fontWeight = FontWeight.Bold)
                Text(text = stop.municipalityName)
            }

            Icon(
                imageVector = ImageVector.vectorResource(R.drawable.chevron_right),
                contentDescription = "Chevron Right Icon",
            )
        }

        HorizontalDivider(color = Color.LightGray)

        Text("Próximos veículos nesta paragem".uppercase(),
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color.Gray,
            modifier = Modifier
                .padding(top = 24.dp)
                .padding(horizontal = 12.dp)
        )

        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp)
                .padding(bottom = 12.dp)
        ) {
            val filteredArrivals = filterAndSortStopArrivalsByCurrentAndFuture(arrivalsForStop)
            itemsIndexed (filteredArrivals, key = { _, arrival -> "${arrival.tripId}_${arrival.stopSequence}_${arrival.scheduledArrivalUnix ?: 0}" }) { index, arrival ->
                val line = linesManager.data.collectAsState().value.firstOrNull { it.id == arrival.lineId }
//                val isLast = index == filteredArrivals.lastIndex
                if (line != null) {
                    ArrivalItem(arrival, Color(line.color.toColorInt()), Color(line.textColor.toColorInt()), onClick = {
                        onArrivalClick(arrival)
                    })
                }
//                if (!isLast) {
//                    HorizontalDivider(color = MaterialTheme.colorScheme.onSurfaceVariant)
//                }
            }
        }
    }


}

// Helper function to adjust time format for operational day hours after midnight
fun adjustTimeFormat(time: String?): String? {
    if (time == null) return null

    val components = time.split(":")
    if (components.size != 2) return time

    val hours = components[0].toIntOrNull()
    val minutes = components[1].toIntOrNull()

    if (hours == null || minutes == null) return time

    val adjustedHours = hours % 24
    val formattedTime = String.format(Locale.ENGLISH, "%02d:%02d", adjustedHours, minutes)

    return formattedTime
}

fun getRoundedMinuteDifferenceFromNow(refTimestamp: Int): Int {
    println("[getRoundedMinuteDifferenceFromNow] — Rounding ${refTimestamp} to ${(System.currentTimeMillis() / 1000).toInt()}")
    val now = (System.currentTimeMillis() / 1000).toInt()
    val differenceInSeconds = now - refTimestamp
    println("[getRoundedMinuteDifferenceFromNow] — Difference in seconds: $differenceInSeconds")
    val differenceInMinutes = differenceInSeconds / 60

    println("[getRoundedMinuteDifferenceFromNow] — Difference in minutes: $differenceInMinutes")
    return kotlin.math.abs(differenceInMinutes)
}

fun getTimeStringFromMinutes(minutes: Int): String {
    if (minutes < 2) {
        return "A chegar"
    }

    val hours = minutes / 60
    val minutes = minutes % 60

    if (hours == 0) {
        return "${minutes} min"
    }

    return "${hours}h ${minutes}m"
}

@Composable
fun ArrivalItem(arrival: RealtimeETA, color: Color, textColor: Color, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(60.dp)
            .clickable {
                onClick()
            },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {

        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Pill(text = arrival.lineId, color = color, textColor = textColor, size = 60)
            Text(text = arrival.headsign, maxLines = 1, overflow = TextOverflow.Ellipsis,
                modifier = Modifier
                    .weight(1f)
                    .padding(end = 16.dp)
            )
        }


        if (arrival.estimatedArrivalUnix != null) {
            Box(modifier = Modifier.size(18.dp)) {
                RealtimePingAnimation(
                    color = SmoothGreen
                )
            }
            Spacer(modifier = Modifier.width(4.dp))
            Text("${getRoundedMinuteDifferenceFromNow(arrival.estimatedArrivalUnix)} min", color = SmoothGreen, fontWeight = FontWeight.Bold)
        } else {
            arrival.scheduledArrival?.let {
                adjustTimeFormat(
                    it.substring(0, 5)
                )?.let { formattedTime ->
                    Text(text = formattedTime, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun MLNMapView(modifier: Modifier = Modifier) {
    AndroidView(
        factory = { context ->
            MapLibre.getInstance(context)
            val mapView = MapView(context)
            mapView.onCreate(null)
            mapView.getMapAsync { map ->
                // Set the style after mapView was loaded
                map.setStyle("https://maps.carrismetropolitana.pt/styles/default/style.json") {
                    // Hide attributions
                    map.uiSettings.isAttributionEnabled = false
                    map.uiSettings.isLogoEnabled = false
                    // Set the map view center
                    map.cameraPosition = CameraPosition.Builder()
                        .target(LatLng(38.7, -9.0))
                        .zoom(8.9)
                        .build()
                }
            }
            mapView
        },
        modifier
    )
}