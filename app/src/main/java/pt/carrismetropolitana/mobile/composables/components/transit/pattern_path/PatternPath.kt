package pt.carrismetropolitana.mobile.composables.components.transit.pattern_path

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.Divider
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import kotlinx.coroutines.delay
import pt.carrismetropolitana.mobile.composables.components.feedback.QuestionItem
import pt.carrismetropolitana.mobile.composables.screens.stops.filterAndSortStopArrivalsByCurrentAndFuture
import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.PathEntry
import pt.carrismetropolitana.mobile.services.cmapi.PatternRealtimeETA
import pt.carrismetropolitana.mobile.services.cmapi.RealtimeETA
import java.util.Dictionary


@Composable
fun PatternPath(
    patternId: String?,
    pathItems: List<PathEntry>,
    pathColor: Color,
    onSchedulesButtonClick: (stopId: String) -> Unit,
    onStopDetailsButtonClick: (stopId: String) -> Unit,
    modifier: Modifier = Modifier,
    hideBottomButtons: Boolean = false,
    header: @Composable () -> Unit,
) {
    var expandedPathItemIndex by remember { mutableIntStateOf(0) }
    var nextArrivals by remember { mutableStateOf(listOf<PatternRealtimeETA>()) }

    LaunchedEffect(patternId) {
        if (patternId == null) return@LaunchedEffect
        while (true) {
            val arrivals = CMAPI.shared.getPatternETAs(patternId)
            nextArrivals = filterAndSortPatternArrivalsByCurrentAndFuture(arrivals)
            delay(5000)
        }
    }


    LazyColumn(
        modifier = modifier,
    ) {
        item {
            header()
            Spacer(modifier = Modifier.height(16.dp))
        }
        itemsIndexed(pathItems) { index, pathItem ->
            val positionInList =
                if (index == 0) PositionInList.FIRST
                else if (index == pathItems.size - 1) PositionInList.LAST
                else PositionInList.MIDDLE

            PatternPathItem(
                pathItem = pathItem,
                pathColor = pathColor,
                expanded = index == expandedPathItemIndex,
                positionInList = positionInList,
                onClick = { expandedPathItemIndex = index },
                onSchedulesButtonClick = { onSchedulesButtonClick(pathItem.stop.id) },
                onStopDetailsButtonClick = { onStopDetailsButtonClick(pathItem.stop.id) },
                hideBottomButtons = hideBottomButtons,
                nextArrivals = nextArrivals,
            )
        }
    }
}

fun arrangeArrivalsByStop(arrivals: List<PatternRealtimeETA>): Map<String, List<PatternRealtimeETA>> {
    return arrivals.groupBy { it.stopId }
}

fun filterAndSortPatternArrivalsByCurrentAndFuture(etas: List<PatternRealtimeETA>): List<PatternRealtimeETA> {
    val fixedEtas = mutableListOf<PatternRealtimeETA>()

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

        if (tripHasEstimatedArrival && tripEstimatedArrivalIsInThePast ) {
            return@filter false
        }

        if (tripHasObservedArrival) {
            return@filter false
        }

        // Fix for past midnight estimatedArrivals represented as being in the day before
        if (tripHasEstimatedArrival &&!estimatedArrivalAfterMidnight && scheduledArrivalAfterMidnight) {
            val fixedEta = eta.copy(estimatedArrivalUnix = eta.estimatedArrivalUnix?.plus(86400)) // estimatedArrival not fixed currently, but atm not being used for anything
            fixedEtas += fixedEta

            return@filter false
        }

        true
    }

    println("Filtered ${currentAndFutureFiltering.size} ETAs as currentAndFuture.")
    println("Filtered and fixed ${fixedEtas.size} ETAs.")

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