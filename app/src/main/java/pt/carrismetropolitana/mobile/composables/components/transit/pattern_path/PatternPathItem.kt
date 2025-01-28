package pt.carrismetropolitana.mobile.composables.components.transit.pattern_path

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.composables.screens.stops.adjustTimeFormat
import pt.carrismetropolitana.mobile.composables.screens.stops.getRoundedMinuteDifferenceFromNow
import pt.carrismetropolitana.mobile.services.cmapi.Facility
import pt.carrismetropolitana.mobile.services.cmapi.PathEntry
import pt.carrismetropolitana.mobile.services.cmapi.PatternRealtimeETA
import pt.carrismetropolitana.mobile.services.cmapi.RealtimeETA
import pt.carrismetropolitana.mobile.services.cmapi.Stop
import pt.carrismetropolitana.mobile.ui.animations.RealtimePingAnimation
import pt.carrismetropolitana.mobile.ui.theme.CarrisMetropolitanaTheme
import pt.carrismetropolitana.mobile.ui.theme.SmoothGreen
import kotlin.math.exp

enum class PositionInList { FIRST, MIDDLE, LAST }

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun PatternPathItem(
    pathItem: PathEntry,
    pathColor: Color,
    expanded: Boolean,
    positionInList: PositionInList,
    onClick: () -> Unit,
    onSchedulesButtonClick: () -> Unit,
    onStopDetailsButtonClick: () -> Unit,
    hideBottomButtons: Boolean = false,
//    nextArrivals: List<RealtimeETA>
    nextArrivals: List<PatternRealtimeETA>
) {

    val nextArrivalsForStop = nextArrivals.filter { it.stopId == pathItem.stop.id }

    val heightInDp = animateDpAsState(
        targetValue = if (expanded) 180.dp else if (nextArrivalsForStop.isNotEmpty() && nextArrivalsForStop[0].estimatedArrivalUnix != null) 90.dp else 60.dp,
        animationSpec = tween(
            durationMillis = 300,
        )
    )

    LaunchedEffect(nextArrivals) {
        println("Next arrivals for patternPathItem: ${nextArrivals.count()}")
    }

    Box(
        modifier = Modifier
            .height(heightInDp.value)
            .shadow(elevation = if (expanded) 30.dp else 0.dp)
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 12.dp)
            .clickable { onClick() }
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(start = 6.dp)
        ) {
            Box {
                // rect
                Column {
                    Spacer(modifier = Modifier.height(18.dp))
                    Box(
                        modifier = Modifier
                            .clip(
                                RectangleShape
                            )
                            .background(Color.Black)
                            .width(25.dp)
                            .height(2.dp)
                    )
                }
                Box(
                    modifier = Modifier
                        .padding(top = if (positionInList == PositionInList.FIRST) 10.dp else 0.dp)
                        .padding(bottom = if (positionInList == PositionInList.LAST) if (expanded) 110.dp else 30.dp else 0.dp)
                        .clip(
                            RoundedCornerShape(
                                topStart = if (positionInList == PositionInList.FIRST) 30.dp else 0.dp,
                                topEnd = if (positionInList == PositionInList.FIRST) 30.dp else 0.dp,
                                bottomStart = if (positionInList == PositionInList.LAST) 30.dp else 0.dp,
                                bottomEnd = if (positionInList == PositionInList.LAST) 30.dp else 0.dp
                            )
                        )
                        .background(pathColor)
                        .width(15.dp)
                        .fillMaxHeight()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Spacer(modifier = Modifier.height(if (positionInList == PositionInList.FIRST) 6.dp else 18.dp))
                        Box(
                            Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(Color.White)
                        )
                    }
                }
            }
            Column(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.weight(1f)
            ) {
                Column {
                    Text(
                        pathItem.stop.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = if (expanded) 20.sp else 16.sp,
                        maxLines = 1
                    )
                    Text(pathItem.stop.municipalityName)
                }

                if (expanded) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(5.dp)
                    ) {
                        pathItem.stop.facilities.forEach {
                            val facilityIconResourceId = getIconResourceIdForFacility(it)
                            val facilityName = it.name

                            facilityIconResourceId?.let {
                                Image(
                                    imageVector = ImageVector.vectorResource(
                                        id = it
                                    ),
                                    contentDescription = "Nearby facility: $facilityName",
                                    Modifier.size(30.dp)
                                )
                            }
                        }
                    }
                }

                Column {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        var nextArrivalIsRealtime = false
                        if (nextArrivalsForStop.isNotEmpty()) {
                            nextArrivalsForStop[0].estimatedArrivalUnix?.let {
                                Box(modifier = Modifier.size(18.dp)) {
                                    RealtimePingAnimation(
                                        color = SmoothGreen
                                    )
                                }
                                Text(
                                    "${getRoundedMinuteDifferenceFromNow(it)} minutos",
                                    color = SmoothGreen
                                )
                                nextArrivalIsRealtime = true
                            }
                        }
                        if (expanded) {
                            if (nextArrivalsForStop.drop(1).isNotEmpty()) {
                                Icon(
                                    imageVector = ImageVector.vectorResource(R.drawable.phosphoricons_clock),
                                    contentDescription = "Clock icon",
                                    Modifier.size(20.dp)
                                )
                                nextArrivalsForStop.drop(if (nextArrivalIsRealtime) 1 else 0).take(3).forEach {
                                    if (it.estimatedArrivalUnix != null && it.estimatedArrival != null) {
                                        Text(
                                            adjustTimeFormat(
                                                it.estimatedArrival.substring(
                                                    0,
                                                    5
                                                )
                                            )!!,
                                            color = SmoothGreen
                                        )
                                    } else if (it.scheduledArrival != null) {
                                        Text(
                                            adjustTimeFormat(
                                                it.scheduledArrival.substring(
                                                    0,
                                                    5
                                                )
                                            )!!
                                        )
                                    }
                                }
                            } else {
                                Text(
                                    "Sem próximas passagens",
                                    color = Color.Gray,
                                    fontSize = 16.sp,
                                    fontStyle = FontStyle.Italic,
                                    modifier = Modifier.padding(bottom = 5.dp)
                                )
                            }
                        }
                    }
                }

                if (expanded && !hideBottomButtons) {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        PatternPathFooterButton(text = "Horários", iconResourceId = R.drawable.phosphoricons_clock) {
                            onSchedulesButtonClick()
                        }
                        PatternPathFooterButton(text = "Sobre a paragem", iconResourceId = R.drawable.phosphoricons_map_pin_simple_area) {
                            onStopDetailsButtonClick()
                        }
                    }
                }
            }
        }
    }
}

fun getIconResourceIdForFacility(facility: Facility): Int? {
    return when (facility) {
        Facility.School -> R.drawable.cm_facility_school
        Facility.Boat -> R.drawable.cm_facility_boat
        Facility.Subway -> R.drawable.cm_facility_subway
        Facility.Train -> R.drawable.cm_facility_train
        Facility.Hospital -> null
        Facility.Shopping -> R.drawable.cm_facility_shopping
        Facility.TransitOffice -> R.drawable.cm_facility_transit_office
        Facility.LightRail -> R.drawable.cm_facility_light_rail
        Facility.BikeSharing -> null
    }
}

@Preview
@Composable
fun PatternPathItemPreview() {
    val previewPathEntry = PathEntry(
        allowDropOff = false,
        allowPickup = false,
        distanceDelta = 0.6906,
        stop = Stop(
            districtId = "11",
            districtName = "Lisboa",
            facilities = listOf(Facility.School, Facility.Train, Facility.Subway),
            id = "170491",
            lat = "38.768486",
            lines = listOf(
                "1209", "1215", "1220", "1222", "1223", "1225", "1233", "1236", "1520",
                "1521", "1523", "1613", "1622", "1731"
            ),
            locality = "Sintra",
            lon = "-9.300971",
            municipalityId = "1111",
            municipalityName = "Sintra",
            name = "R Elias Garcia (Supermercado)",
            operationalStatus = "ACTIVE",
            parishId = null,
            parishName = null,
            patterns = listOf(
                "1209_0_2", "1209_1_2", "1215_0_3", "1220_0_3", "1222_0_3", "1223_0_1",
                "1223_1_1", "1223_2_1", "1225_0_3", "1233_0_3", "1236_0_2", "1520_0_2",
                "1521_0_2", "1523_0_1", "1613_0_1", "1613_1_1", "1622_0_1", "1731_0_1"
            ),
            regionId = "PT170",
            regionName = "AML",
            routes = listOf(
                "1209_0", "1209_1", "1215_0", "1220_0", "1222_0", "1223_0", "1223_1",
                "1223_2", "1225_0", "1233_0", "1236_0", "1520_0", "1521_0", "1523_0",
                "1613_0", "1613_1", "1622_0", "1731_0"
            ),
            shortName = "a definir",
            ttsName = "Rua Elias Garcia ( Supermercado )",
            wheelchairBoarding = "0",
            stopId = "170491"
        ),
        stopSequence = 2
    )

    PatternPathItem(
        pathItem = previewPathEntry,
        pathColor = Color.Red,
        expanded = true,
        positionInList = PositionInList.FIRST,
        onClick = { /*TODO*/ },
        onSchedulesButtonClick = { /*TODO*/ },
        onStopDetailsButtonClick = { /*TODO*/ },
        nextArrivals = listOf()
    )
}