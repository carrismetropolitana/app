package pt.carrismetropolitana.mobile.composables.components.favorites

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
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
import androidx.compose.runtime.LaunchedEffect
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
import pt.carrismetropolitana.mobile.LocalLinesManager
import pt.carrismetropolitana.mobile.composables.screens.lines.LinesList
import pt.carrismetropolitana.mobile.services.cmapi.Line
import pt.carrismetropolitana.mobile.utils.normalizedForSearch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SelectFavoriteLineView(
    navController: NavController
) {
    val linesManager = LocalLinesManager.current

    var text by rememberSaveable {
        mutableStateOf("")
    }

    var active by rememberSaveable {
        mutableStateOf(false)
    }

    var searchFilteredLines by rememberSaveable { mutableStateOf(listOf<Line>()) }

    LaunchedEffect(text) {
        if (text.isNotEmpty()) {
            val normalizedText = text.normalizedForSearch()
            searchFilteredLines = linesManager.data.value.filter {
                it.shortName.contains(normalizedText, true)
                        || it.longNameNormalized.contains(normalizedText, true)
            }
        } else {
            searchFilteredLines = listOf()
        }
    }

    Scaffold(
        topBar = {
            Column {
                TopAppBar(
                    title = {
                        Text("Selecionar linha")
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
                        Text(text = "Pesquisar linhas")
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.background)
                        .padding(horizontal = if (active) 0.dp else 12.dp)
                        .padding(bottom = if (active) 0.dp else 12.dp),
                    windowInsets = WindowInsets(0, 0, 0, 0)
                ) {
                    LinesList(
                        lines = linesManager.data.collectAsState().value,
                        isSearch = true,
                        searchFilter = text,
                        onLineClick = { lineId ->
                            navController.previousBackStackEntry?.savedStateHandle?.set(
                                "selectedFavoriteRootItemId",
                                lineId
                            )
                            navController.popBackStack()
                        }
                    )
                }
            }
        }
    ) { paddingValues ->
        LinesList(
            modifier = Modifier.padding(top = paddingValues.calculateTopPadding()),
            lines = linesManager.data.collectAsState().value,
            onLineClick = {
                navController.previousBackStackEntry?.savedStateHandle?.set(
                    "selectedFavoriteRootItemId",
                    it
                )
                navController.popBackStack()
            })
    }
}