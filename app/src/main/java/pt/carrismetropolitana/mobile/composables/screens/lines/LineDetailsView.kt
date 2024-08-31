package pt.carrismetropolitana.mobile.composables.screens.lines

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.flow.firstOrNull
import pt.carrismetropolitana.mobile.LocalAlertsManager
import pt.carrismetropolitana.mobile.LocalLinesManager
import pt.carrismetropolitana.mobile.LocalVehiclesManager
import pt.carrismetropolitana.mobile.MLNMapView
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.Screens
import pt.carrismetropolitana.mobile.composables.ScheduleItem
import pt.carrismetropolitana.mobile.composables.StopScheduleView
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.composables.components.common.DynamicSelectTextField
import pt.carrismetropolitana.mobile.composables.components.common.DynamicSelectTextFieldOption
import pt.carrismetropolitana.mobile.composables.components.common.date_picker.DatePickerField
import pt.carrismetropolitana.mobile.composables.components.transit.pattern_path.PatternPath
import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.Pattern
import pt.carrismetropolitana.mobile.services.cmapi.Route
import pt.carrismetropolitana.mobile.services.cmapi.ScheduleEntry
import pt.carrismetropolitana.mobile.services.cmapi.Shape
import pt.carrismetropolitana.mobile.services.cmapi.Trip
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LineDetailsView(
    lineId: String,
    overrideDisplayedPatternId: String? = null,
    navController: NavController,
    parentPadding: PaddingValues
) {
    val context = LocalContext.current

    val alertsManager = LocalAlertsManager.current
    val vehiclesManager = LocalVehiclesManager.current
    val linesManager = LocalLinesManager.current

    val sheetState = rememberModalBottomSheetState()
    val scope = rememberCoroutineScope()
    var showBottomSheet by remember { mutableStateOf(false) }


    val line = linesManager.data.collectAsState().value.firstOrNull { it.id == lineId }
    var routes by remember { mutableStateOf(listOf<Route>()) }
    var patterns by remember { mutableStateOf(listOf<Pattern>()) }
    var shape by remember { mutableStateOf<Shape?>(null) }

    var selectedPattern by remember { mutableStateOf<Pattern?>(null) }
    var selectedStopIdForSchedule by remember { mutableStateOf<String?>(null) }

    var selectedDate by remember { mutableStateOf<LocalDate>(LocalDate.now()) }

    LaunchedEffect(Unit) {
        if (line == null) return@LaunchedEffect

        for (routeId in line.routes) {
            val route = CMAPI.shared.getRoute(routeId)
            if (route == null) continue
            routes += route


            for (patternId in route.patterns) {
                val pattern = CMAPI.shared.getPattern(patternId) ?: continue
                patterns += pattern
            }
        }

        selectedPattern = if (overrideDisplayedPatternId != null) {
            patterns.firstOrNull { it.id == overrideDisplayedPatternId }
        } else {
            patterns.firstOrNull()
        }

        if (selectedPattern != null) {
            shape = CMAPI.shared.getShape(selectedPattern!!.shapeId)
        }

        vehiclesManager.startFetching()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("Linha")
                },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = {
//                        val sendIntent: Intent = Intent(Intent.ACTION_SEND, Uri.parse("https://beta.carrismetropolitana.pt/lines/1523"))
//                        context.startActivity(sendIntent)
                    }) {
                        Icon(imageVector = Icons.Default.Share, contentDescription = "Share")
                    }
                }
            )
        },
        modifier = Modifier
            .background(Color.White)
    ) { paddingValues ->
        if (line == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
            ) {
                Text("Loading...")
            }
        } else {
            PatternPath(
                patternId = selectedPattern?.id,
                pathItems = selectedPattern?.path ?: listOf(),
                pathColor = Color(line.color.toColorInt()),
                onSchedulesButtonClick = {
                    selectedStopIdForSchedule = it
                    showBottomSheet = true
                },
                onStopDetailsButtonClick = {
                    navController.navigate(
                        Screens.StopDetails.route.replace(
                            "{stopId}",
                            it
                        )
                    )
                },
                modifier = Modifier.padding(
                    top = paddingValues.calculateTopPadding(),
                    bottom = parentPadding.calculateBottomPadding()
                ),
            ) {
                Column(
                    verticalArrangement = Arrangement.spacedBy(20.dp)

                ) {
                    Column(
                        modifier = Modifier
                            .padding(horizontal = 12.dp)
                            .padding(top = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Pill(
                            text = line.shortName,
                            color = Color(line.color.toColorInt()),
                            textColor = Color(line.textColor.toColorInt()),
                            size = 16
                        )
                        Text(
                            text = line.longName,
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            SquareButton(
                                icon = ImageVector.vectorResource(R.drawable.phosphoricons_star_fill),
                                iconTint = Color("#ffcc00".toColorInt()),
                                iconContentDescription = "Favorite",
                                size = 60,
                                action = {
                                    navController.navigate(
                                        Screens.FavoriteItemCustomization.route.replace(
                                            "{favoriteType}",
                                            "LINE"
                                        ).replace("{favoriteId}", lineId)
                                    )
                                })
                            SquareButton(
                                icon = ImageVector.vectorResource(R.drawable.phosphoricons_warning_fill),
                                iconTint = Color.Black,
                                iconContentDescription = "Alerts",
                                size = 60,
                                action = {
                                    navController.navigate(
                                        Screens.AlertsForEntity.route.replace(
                                            "{entityType}",
                                            "LINE"
                                        ).replace("{entityId}", lineId)
                                    )
                                })
                        }

                        DatePickerField(
                            label = "Data",
                            date = selectedDate,
                            onDateSelected = { selectedDate = it })

                        if (routes.isNotEmpty() && patterns.isNotEmpty()) {
                            DynamicSelectTextField(
                                selectedValue = selectedPattern?.headsign ?: "",
//                                options = routes.flatMap { route ->
//                                    route.patterns.map { patternId ->
//                                        val pattern = patterns.first { it.id == patternId }
//                                        DynamicSelectTextFieldOption(
//                                            id = pattern.id,
//                                            title = pattern.headsign,
//                                            subtitle = route.longName
//                                        )
//                                    }
//                                },
                                options = patterns.map { pattern ->
                                    val route = routes.first { it.patterns.contains(pattern.id) }
                                    DynamicSelectTextFieldOption(
                                        id = pattern.id,
                                        title = pattern.headsign,
                                        subtitle = route.longName
                                    )
                                },
                                label = "Sentido",
                                onValueChangedEvent = { option ->
                                    selectedPattern = patterns.first { it.id == option.id }
                                },
                                modifier = Modifier
                            )
                        }
                    }
                    MLNMapView(
                        modifier = Modifier
                            .height(height = 200.dp)
                    )
                }
            }

            if (showBottomSheet) {
                ModalBottomSheet(
                    onDismissRequest = {
                        showBottomSheet = false
                    },
                    sheetState = sheetState,
                ) {
                    StopScheduleView(
                        scheduleItems = getScheduleItemsForStop(
                            selectedPattern?.trips ?: listOf(),
                            selectedStopIdForSchedule ?: "",
                            selectedDate
                        )
                    )

//                Button(onClick = {
//                    scope.launch { sheetState.hide() }.invokeOnCompletion {
//                        if (!sheetState.isVisible) {
//                            showBottomSheet = false
//                        }
//                    }
//                }) {
//                    Text("Hide bottom sheet")
//                }
                }
            }
        }
    }
}

//@Preview
//@Composable
//fun LineDetailsViewPreview() {
//    LineDetailsView(lineId = "", navController = rememberNavController())
//}

@Composable
fun SquareButton (
    icon: ImageVector,
    iconTint: Color,
    iconContentDescription: String,
    size: Int,
    action: () -> Unit
) {
    Button(
        onClick = action,
        shape = RoundedCornerShape(10.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.White,
            contentColor = Color.White
        ),
        elevation = ButtonDefaults.elevatedButtonElevation(
            defaultElevation = 3.dp,
            pressedElevation = 1.dp
        ),
        modifier = Modifier
            .width(width = size.dp)
            .height(height = size.dp),
        contentPadding = PaddingValues(0.dp)
    ) {
        Icon(icon, contentDescription = iconContentDescription, tint = iconTint, modifier = Modifier.size(30.dp))
    }
}

// {hour: minute}
fun getScheduleItemsForStop(trips: List<Trip>, stopId: String, validOn: LocalDate): List<ScheduleItem> {
    // Early returns
    if (trips.isEmpty()) return listOf()
    if (stopId.isEmpty()) return listOf()

    // Date formatting
    val dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd")
    val validOnFormatted = dateFormatter.format(validOn)

    val scheduleItems = mutableListOf<ScheduleItem>()

    for (trip in trips) {
        if (trip.dates.contains(validOnFormatted)) {
            for (schedule in trip.schedule) {
                if (schedule.stopId == stopId) {
                    val hour = schedule.arrivalTime.substring(0, 2)
                    val minute = schedule.arrivalTime.substring(3, 5)
                    if (scheduleItems.any { it.hour == hour }) {
                        val scheduleItem = scheduleItems.first { it.hour == hour }
                        scheduleItem.minutes + minute
                    } else {
                        scheduleItems.add(ScheduleItem(hour, listOf(minute)))
                    }
                }
            }
        }
    }
    return scheduleItems
}