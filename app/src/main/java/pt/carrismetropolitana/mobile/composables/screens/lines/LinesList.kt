package pt.carrismetropolitana.mobile.composables.screens.lines

import android.content.Context
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.Button
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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
import androidx.core.graphics.toColorInt
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.dataStore
import pt.carrismetropolitana.mobile.services.cmapi.Line
import pt.carrismetropolitana.mobile.utils.normalizedForSearch

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "linesSearch")
val LINE_SEARCH_HISTORY = stringPreferencesKey("history")

fun getLineSearchHistory(context: Context): Flow<List<String>> {
    return context.dataStore.data.map { preferences ->
        preferences[LINE_SEARCH_HISTORY]?.split(",")?.filter { it.isNotEmpty() } ?: listOf()
    }
}

fun setLineSearchHistory(context: Context, searchHistory: List<String>) {
    runBlocking {
        context.dataStore.edit { preferences ->
            preferences[LINE_SEARCH_HISTORY] = searchHistory.joinToString(",")
        }
    }
}

// limited to 5 lines
fun addLineToSearchHistory(context: Context, lineId: String) {
    runBlocking {
        context.dataStore.edit { preferences ->
            val searchHistory = preferences[LINE_SEARCH_HISTORY]?.split(",")?.filter { it.isNotEmpty() } ?: emptyList()
            if (searchHistory.size == 5) {
                preferences[LINE_SEARCH_HISTORY] = (listOf(lineId) + searchHistory.drop(1)).joinToString(",")
            } else {
                preferences[LINE_SEARCH_HISTORY] =  (listOf(lineId) + searchHistory).joinToString(",")
            }
        }
    }
}

fun removeLineFromSearchHistory(context: Context, lineId: String) {
    runBlocking {
        context.dataStore.edit { preferences ->
            val searchHistory = preferences[LINE_SEARCH_HISTORY]?.split(",")?.filter { it.isNotEmpty() } ?: emptyList()
            preferences[LINE_SEARCH_HISTORY] = searchHistory.filter { it != lineId }.joinToString(",")
        }
    }
}

fun wipeSearchHistory(context: Context) {
    runBlocking {
        context.dataStore.edit { preferences ->
            preferences[LINE_SEARCH_HISTORY] = ""
        }
    }
}

@Composable
fun LinesList(
    modifier: Modifier = Modifier,
    lines: List<Line>,
    isSearch: Boolean = false,
    searchFilter: String? = null,
    onLineClick: (lineId: String) -> Unit
) {
    val context = LocalContext.current

    var searchFilteredLines by remember { mutableStateOf(listOf<Line>()) }

    val searchHistory = getLineSearchHistory(context).collectAsState(initial = emptyList())

    LaunchedEffect(searchFilter) {
        if (!searchFilter.isNullOrEmpty()) {
            val normalizedText = searchFilter.normalizedForSearch()
            searchFilteredLines = lines.filter {
                it.shortName.contains(normalizedText, true)
                        || it.longNameNormalized.contains(normalizedText, true)
            }
        } else {
            searchFilteredLines = listOf()
        }
    }

    LazyColumn(
        modifier = modifier
    ) {
        val items = if (isSearch) {
            if (searchFilteredLines.isEmpty()) {
                searchHistory.value.map { lineId ->
                    lines.find { it.id == lineId }
                }
            } else searchFilteredLines
        } else {
            lines
        }

        itemsIndexed(
            items
        ) {index, line ->
            line?.let {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    if (isSearch && searchFilteredLines.isEmpty()) {
                        Icon(
                            imageVector = ImageVector.vectorResource(
                                id = R.drawable.history_icon
                            ),
                            contentDescription = "History",
                            tint = Color.White.copy(alpha = 0.5f),
                            modifier = Modifier.padding(start = 12.dp)
                        )
                    }
                    LineItem(line, isLastInList = index == lines.size - 1, onClick = {
                        onLineClick(line.id)
                        addLineToSearchHistory(context = context, lineId = line.id)
                    })
                }
            }
        }

        // TODO: fix button styling, in terms of functionality it works just fine
//        if (isSearch && searchHistory.value.isNotEmpty()) {
//            item {
//                Button(onClick = {
//                    wipeSearchHistory(context)
//                }) {
//                    Text("Apagar histórico de pesquisa")
//                }
//            }
//        }
    }
}

//@Composable
//fun LineItem(line: Line, isLastInList: Boolean, onClick: () -> Unit) {
//    Row(
//        verticalAlignment = Alignment.CenterVertically,
//        modifier = Modifier
//            .padding(16.dp)
//            .clickable { onClick() }
//    ) {
//        Pill(text = line.shortName, color = Color(line.color.toColorInt()), textColor = Color(line.textColor.toColorInt()), size = 60)
//        Spacer(modifier = Modifier.width(8.dp))
//        Text(
//            text = line.longName,
//            fontSize = 16.sp, // Set font size in scaled pixels (sp)
//            fontWeight = FontWeight.Bold,
//            maxLines = 2,
//            overflow = TextOverflow.Ellipsis,
//            modifier = Modifier.weight(1f)
//        )
//    }
//    if (!isLastInList) {
//        HorizontalDivider(thickness = 1.dp, color = Color.LightGray)
//    }
//    Spacer(modifier = Modifier.height(8.dp))
//}

@Composable
fun LineItem(line: Line, isLastInList: Boolean, onClick: () -> Unit) {
    ListItem(
        modifier = Modifier.clickable { onClick() },
        headlineContent = {
            Text(
                text = line.longName,
                fontSize = 16.sp, // Set font size in scaled pixels (sp)
                fontWeight = FontWeight.Bold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        },
        leadingContent = {
            Pill(text = line.shortName, color = Color(line.color.toColorInt()), textColor = Color(line.textColor.toColorInt()), size = 60)
        },
    )
    if (!isLastInList) {
        HorizontalDivider()
    }
}