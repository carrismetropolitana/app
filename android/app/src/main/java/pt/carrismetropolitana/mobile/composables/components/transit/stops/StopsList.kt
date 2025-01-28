package pt.carrismetropolitana.mobile.composables.components.transit.stops

import android.content.Context
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import pt.carrismetropolitana.mobile.composables.screens.lines.getLineSearchHistory
import pt.carrismetropolitana.mobile.dataStore
import pt.carrismetropolitana.mobile.services.cmapi.Line
import pt.carrismetropolitana.mobile.services.cmapi.Stop
import pt.carrismetropolitana.mobile.utils.normalizedForSearch

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "stopsSearch")
val STOP_SEARCH_HISTORY = stringPreferencesKey("history")

fun getStopSearchHistory(context: Context): Flow<List<String>> {
    return context.dataStore.data.map { preferences ->
        preferences[STOP_SEARCH_HISTORY]?.split(",")?.filter { it.isNotEmpty() } ?: listOf()
    }
}

fun setStopSearchHistory(context: Context, searchHistory: List<String>) {
    runBlocking {
        context.dataStore.edit { preferences ->
            preferences[STOP_SEARCH_HISTORY] = searchHistory.joinToString(",")
        }
    }
}

// limited to 5 lines
fun addStopToSearchHistory(context: Context, stopId: String) {
    runBlocking {
        context.dataStore.edit { preferences ->
            val searchHistory = preferences[STOP_SEARCH_HISTORY]?.split(",")?.filter { it.isNotEmpty() } ?: emptyList()
            if (searchHistory.size == 5) {
                preferences[STOP_SEARCH_HISTORY] = (listOf(stopId) + searchHistory.drop(1)).joinToString(",")
            } else {
                preferences[STOP_SEARCH_HISTORY] =  (listOf(stopId) + searchHistory).joinToString(",")
            }
        }
    }
}

fun removeStopFromSearchHistory(context: Context, stopId: String) {
    runBlocking {
        context.dataStore.edit { preferences ->
            val searchHistory = preferences[STOP_SEARCH_HISTORY]?.split(",")?.filter { it.isNotEmpty() } ?: emptyList()
            preferences[STOP_SEARCH_HISTORY] = searchHistory.filter { it != stopId }.joinToString(",")
        }
    }
}

fun wipeSearchHistory(context: Context) {
    runBlocking {
        context.dataStore.edit { preferences ->
            preferences[STOP_SEARCH_HISTORY] = ""
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun StopsList(
    modifier: Modifier = Modifier,
    stops: List<Stop>,
    isSearch: Boolean = false,
    searchFilter: String? = null,
    onStopClick: (stopId: String) -> Unit,
    header: @Composable () -> Unit = {},
) {
//    val context = LocalContext.current
//
//    var searchFilteredStops by remember { mutableStateOf(listOf<Stop>()) }
//
//    val searchHistory = getStopSearchHistory(context).collectAsState(initial = emptyList())
//
//    LaunchedEffect(searchFilter) {
//        if (!searchFilter.isNullOrEmpty()) {
//            val normalizedText = searchFilter.normalizedForSearch()
//            searchFilteredStops = stops.filter {
//                it.nameNormalized.contains(normalizedText, true)
//                        || it.id.contains(normalizedText, true)
//                        || it.ttsNameNormalized?.contains(normalizedText, true) ?: false
//            }
//        } else {
//            searchFilteredStops = listOf()
//        }
//    }


    LazyColumn(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(vertical = 8.dp)
    ) {
//        val items = if (isSearch) {
//            if (searchFilteredStops.isEmpty()) {
//                searchHistory.value.map { stopId ->
//                    stops.find { it.id == stopId }
//                }
//            } else searchFilteredStops
//        } else {
//            stops
//        }

        stickyHeader {
            header()
        }
        items(stops) {
            StopsListItem(it, onStopClick = {
                onStopClick(it)
            }, paddingValues = PaddingValues(horizontal = 12.dp))
        }
    }
}