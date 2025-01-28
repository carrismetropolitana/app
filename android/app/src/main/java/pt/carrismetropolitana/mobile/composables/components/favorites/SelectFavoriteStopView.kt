package pt.carrismetropolitana.mobile.composables.components.favorites

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SearchBar
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.core.graphics.toColorInt
import androidx.navigation.NavController
import pt.carrismetropolitana.mobile.LocalStopsManager
import pt.carrismetropolitana.mobile.composables.components.maps.StopsMapView
import pt.carrismetropolitana.mobile.composables.components.transit.stops.StopsList
import pt.carrismetropolitana.mobile.composables.components.transit.stops.StopsListItem
import pt.carrismetropolitana.mobile.composables.screens.lines.LinesList
import pt.carrismetropolitana.mobile.services.cmapi.Line
import pt.carrismetropolitana.mobile.services.cmapi.Stop
import pt.carrismetropolitana.mobile.utils.normalizedForSearch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SelectFavoriteStopView(
    navController: NavController
) {
    val stopsManager = LocalStopsManager.current

    var text by rememberSaveable {
        mutableStateOf("")
    }

    var active by rememberSaveable {
        mutableStateOf(false)
    }

    var searchFilteredStops by rememberSaveable { mutableStateOf(listOf<Stop>()) }

    Scaffold(
        topBar = {
            Column {
                TopAppBar(
                    title = {
                        Text("Selecionar paragem")
                    },
                    navigationIcon = {
                        IconButton(onClick = { navController.popBackStack() }) {
                            Icon(imageVector = Icons.Default.Close, contentDescription = "Dismiss")
                        }
                    }
                )
                SearchBar(
                    query = text,
                    onQueryChange = {
                        text = it
                        val normalizedText = text.normalizedForSearch()
                        searchFilteredStops = stopsManager.data.value.filter {stop ->
                            stop.nameNormalized.contains(normalizedText, true)
                                    || stop.id.contains(normalizedText, true)
                                    || stop.ttsNameNormalized?.contains(normalizedText, true) ?: false
                        }
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
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.background)
                        .padding(horizontal = if (active) 0.dp else 12.dp)
                        .padding(bottom = if (active) 0.dp else 12.dp),
                    windowInsets = WindowInsets(0, 0, 0, 0)
                ) {
                    StopsList(stops = searchFilteredStops, onStopClick = { stopId ->
                        navController.previousBackStackEntry?.savedStateHandle?.set(
                            "selectedFavoriteRootItemId",
                            stopId
                        )
                        navController.popBackStack()
                    })
                }
            }
        }
    ) { paddingValues ->
        StopsList(
            modifier = Modifier.padding(top = paddingValues.calculateTopPadding()),
            stops = stopsManager.data.collectAsState().value,
            onStopClick = {
                navController.previousBackStackEntry?.savedStateHandle?.set(
                    "selectedFavoriteRootItemId",
                    it
                )
                navController.popBackStack()
            }
        )
//        {
//            StopsMapView(
//                modifier = Modifier.height(500.dp),
//                stops = stopsManager.data.collectAsState().value
//            )
//        }
    }
}