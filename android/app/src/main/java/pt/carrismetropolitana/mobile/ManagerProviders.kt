package pt.carrismetropolitana.mobile

import androidx.compose.runtime.compositionLocalOf
import pt.carrismetropolitana.mobile.managers.AlertsManager
import pt.carrismetropolitana.mobile.managers.FavoritesManager
import pt.carrismetropolitana.mobile.managers.LinesManager
import pt.carrismetropolitana.mobile.managers.StopsManager
import pt.carrismetropolitana.mobile.managers.VehiclesManager

val LocalLinesManager = compositionLocalOf<LinesManager> { error("No LinesManager provided") }
val LocalStopsManager = compositionLocalOf<StopsManager> { error("No StopsManager provided") }
val LocalAlertsManager = compositionLocalOf<AlertsManager> { error("No AlertsManager provided") }
val LocalVehiclesManager = compositionLocalOf<VehiclesManager> { error("No VehiclesManager provided") }

val LocalFavoritesManager = compositionLocalOf<FavoritesManager> { error("No FavoritesManager provided") }