package pt.carrismetropolitana.mobile.composables.components.favorites

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardColors
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import pt.carrismetropolitana.mobile.LocalFavoritesManager
import pt.carrismetropolitana.mobile.LocalLinesManager
import pt.carrismetropolitana.mobile.LocalStopsManager
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.composables.screens.lines.LineItem
import pt.carrismetropolitana.mobile.services.cmapi.CMAPI
import pt.carrismetropolitana.mobile.services.cmapi.Pattern
import pt.carrismetropolitana.mobile.services.favorites.FavoriteItem
import pt.carrismetropolitana.mobile.services.favorites.FavoriteType
import pt.carrismetropolitana.mobile.ui.theme.CMSystemBorder100
import pt.carrismetropolitana.mobile.ui.theme.CMYellow


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FavoriteItemCustomization(
    navController: NavController,
    favoriteType: FavoriteType,
    favoriteId: String?
) {
    val linesManager = LocalLinesManager.current
    val stopsManager = LocalStopsManager.current
    val favoritesManager = LocalFavoritesManager.current

    var receiveNotifications by remember { mutableStateOf(true) }

    val result by navController.currentBackStackEntryFlow.collectAsState(initial = null)
    val selectedFavoriteRootItemId = result?.savedStateHandle?.get<String>("selectedFavoriteRootItemId")

    var patterns by remember { mutableStateOf<List<Pattern>>(listOf()) }
    var selectedPatternIds by remember { mutableStateOf<List<String>>(listOf()) }

    val favorite = if (favoriteId != null)
        favoritesManager.favorites.firstOrNull {
            if (favoriteType == FavoriteType.PATTERN) {
                it.lineId == favoriteId
            } else {
                it.stopId == favoriteId
            }
        } else null

    if (favorite != null) {
        receiveNotifications = favorite.receiveNotifications
    }

    LaunchedEffect(selectedFavoriteRootItemId) {
        if (selectedFavoriteRootItemId != null || favoriteId != null) {
            val intermediatePatterns = mutableListOf<Pattern>()
            if (favoriteType == FavoriteType.PATTERN) {
                val line = linesManager.data.value.firstOrNull {
                    it.id == (selectedFavoriteRootItemId ?: favoriteId)
                }
                for (patternId in line?.patterns ?: listOf()) {
                    val pattern = CMAPI.shared.getPattern(patternId) ?: continue
                    intermediatePatterns += pattern
                }
            } else {
                val stop =
                    stopsManager.data.value.firstOrNull {
                        it.id == (selectedFavoriteRootItemId ?: favoriteId)
                    }
                for (patternId in stop?.patterns ?: listOf()) {
                    val pattern = CMAPI.shared.getPattern(patternId) ?: continue
                    intermediatePatterns += pattern
                }
            }
            patterns = intermediatePatterns
        }

        if (favorite != null) {
            selectedPatternIds = favorite.patternIds
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("${if (favoriteType == FavoriteType.STOP) "Paragem" else "Linha"} favorita")
                },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Dismiss")
                    }
                },
                actions = {
                    Text(text = "Guardar", modifier = Modifier.clickable {
                        if (selectedPatternIds.isNotEmpty()) {
                            if (favoriteType == FavoriteType.PATTERN) {
                                val line = linesManager.data.value.firstOrNull {
                                    it.id == (selectedFavoriteRootItemId ?: favoriteId)
                                }
                                if (line != null) {
                                    val newFavorite = FavoriteItem.create(
                                        type = favoriteType,
                                        patternIds = selectedPatternIds,
                                        lineId = line.id,
                                        receiveNotifications = receiveNotifications
                                    )
                                    favoritesManager.addFavorite(newFavorite)
                                }
                            } else {
                                val stop = stopsManager.data.value.firstOrNull {
                                    it.id == (selectedFavoriteRootItemId ?: favoriteId)
                                }
                                if (stop != null) {
                                    val newFavorite = FavoriteItem.create(
                                        type = favoriteType,
                                        stopId = stop.id,
                                        patternIds = selectedPatternIds,
                                        displayName = stop.name,
                                        receiveNotifications = receiveNotifications
                                    )
                                    favoritesManager.addFavorite(newFavorite)
                                }
                            }
                        }

                        navController.popBackStack()
                    })
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .padding(paddingValues)
                .padding(horizontal = 12.dp)
                .padding(top = 24.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    "Selecionar ${if (favoriteType == FavoriteType.STOP) "paragem" else "linha"}",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp
                )
                Text("Escolha uma ${if (favoriteType == FavoriteType.STOP) "paragem" else "linha"} para visualizar na página principal.")


                Card(
                    elevation = CardDefaults.elevatedCardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.background,
                    ),
                    modifier = Modifier
                        .padding(vertical = 12.dp)
                        .clickable {
                            if (favoriteType == FavoriteType.PATTERN) {
                                navController.navigate("select_favorite_line")
                            } else {
                                navController.navigate("select_favorite_stop")
                            }
                        }
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(shape = RoundedCornerShape(size = 12.dp))
                            .padding(horizontal = 12.dp, vertical = 16.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            if (selectedFavoriteRootItemId != null || favoriteId != null) {
                                if (favoriteType == FavoriteType.PATTERN) {
                                    LineItem(
                                        line = linesManager.data.collectAsState().value.find {
                                            it.id == (selectedFavoriteRootItemId ?: favoriteId)
                                        }!!,
                                        isLastInList = true,
                                        onClick = {})
                                } else {
                                    val stop = stopsManager.data.collectAsState().value.find {
                                        it.id == (selectedFavoriteRootItemId ?: favoriteId)
                                    }!!
                                    Box(modifier = Modifier.weight(1f)) {
                                        Column {
                                            Text(stop.name)
                                            Text(
                                                text = if (stop.locality == stop.municipalityName) stop.locality else (if (stop.locality == null) stop.municipalityName else "${stop.locality}, ${stop.municipalityName}"),
                                                color = Color.Gray
                                            )
                                        }
                                    }
                                }
                            } else {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Search,
                                        contentDescription = "Search"
                                    )
                                    Text("Pesquisar ${if (favoriteType == FavoriteType.STOP) "paragens" else "linhas"}")
                                }
                            }
                            Icon(imageVector = ImageVector.vectorResource(R.drawable.chevron_right), contentDescription = "Chevron Right Icon", Modifier.size(24.dp), tint = Color.Gray)
                        }
                    }
                }
            }

            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    "Selecionar destino${if (favoriteType == FavoriteType.STOP) "s" else ""}",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp
                )
                Text(if (favoriteType == FavoriteType.STOP) "Escolha 1 destino para gravar na página de entrada." else "Escolha quais destinos pretende visualizar.")

                Card(
                    elevation = CardDefaults.elevatedCardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.background,
                    ),
                    modifier = Modifier
                        .padding(vertical = 12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(shape = RoundedCornerShape(size = 12.dp))
                            .padding(horizontal = 12.dp, vertical = 20.dp)
                    ) {
                        if (patterns.isNotEmpty()) {
                            Column {
                                for (pattern in patterns) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(horizontal = 12.dp)
                                            .clickable {
                                                if (favoriteType == FavoriteType.STOP) {
                                                    if (selectedPatternIds.contains(pattern.id)) {
                                                        selectedPatternIds -= pattern.id
                                                    } else {
                                                        selectedPatternIds += pattern.id
                                                    }
                                                } else {
                                                    selectedPatternIds = listOf(pattern.id)
                                                }
                                            }
                                    ) {
                                        if (favoriteType == FavoriteType.STOP) {
                                            Checkbox(
                                                checked = selectedPatternIds.contains(pattern.id),
                                                onCheckedChange = {
                                                    if (it) {
                                                        selectedPatternIds += pattern.id
                                                    } else {
                                                        selectedPatternIds -= pattern.id
                                                    }
                                                },
                                                colors = CheckboxDefaults.colors(
                                                    checkedColor = MaterialTheme.colorScheme.secondary,
                                                    uncheckedColor = MaterialTheme.colorScheme.onSurface,
                                                    checkmarkColor = CMYellow
                                                )
                                            )
                                            Pill(text = pattern.lineId, color = Color(pattern.color.toColorInt()), textColor = Color(pattern.textColor.toColorInt()), size = 60)
                                            Text(pattern.headsign)
                                        } else {
                                            RadioButton(selected = selectedPatternIds.getOrNull(0) == pattern.id, onClick = {
                                                selectedPatternIds = listOf(pattern.id)
                                            })
                                            Text(pattern.headsign)
                                        }
                                    }
                                    if (pattern.id != patterns.last().id) {
                                        HorizontalDivider(thickness = 2.dp, color = CMSystemBorder100)
                                    }
                                }
                            }
                        } else {
                            if (selectedFavoriteRootItemId != null || favoriteId != null) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth(),
                                    verticalArrangement = Arrangement.Center,
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    CircularProgressIndicator(
                                        modifier = Modifier.width(36.dp),
                                        color = MaterialTheme.colorScheme.secondary,
                                        trackColor = MaterialTheme.colorScheme.surfaceVariant,
                                    )
                                }
                            } else {
                                Text(
                                    "Selecione uma ${if (favoriteType == FavoriteType.STOP) "paragem" else "linha"}"
                                )
                            }
                        }
                    }
                }
            }

            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    "Ativar notificações",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp
                )
                Text("Receber notificações sempre que houver novos avisos para as linhas e paragens selecionadas.")

                Card(
                    elevation = CardDefaults.elevatedCardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.background,
                    ),
                    modifier = Modifier
                        .padding(vertical = 12.dp)
                ) {
                    Row(
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(shape = RoundedCornerShape(size = 12.dp))
                            .padding(horizontal = 12.dp, vertical = 5.dp),
                    ) {
                        Text("Receber notificações")
                        Switch(
                            checked = receiveNotifications,
                            onCheckedChange = { receiveNotifications = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = MaterialTheme.colorScheme.primary,
                                uncheckedThumbColor = MaterialTheme.colorScheme.onSurface,
                                checkedTrackColor = CMYellow,
                                uncheckedTrackColor = MaterialTheme.colorScheme.surfaceVariant
                            )
                        )
                    }
                }
            }


            if (favorite != null) {
                Spacer(modifier = Modifier.weight(1f))
                Button(
                    onClick = {
                        favoritesManager.removeFavorite(favorite)
                        navController.popBackStack()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Red)
                ) {
                    Text("Eliminar", color = Color.White)
                }
            }
        }
    }
}

@Preview
@Composable
fun FavoriteItemCustomizationPreview() {
    FavoriteItemCustomization(
        navController = rememberNavController(),
        favoriteType = FavoriteType.PATTERN,
        favoriteId = "1523"
    )
//    MyTextField()
}

@Composable
fun MyTextField() {
    var text by remember { mutableStateOf("") }

    OutlinedTextField(
        value = text,
        onValueChange = { newText -> text = newText },
        label = { Text("Enter text") },
        modifier = Modifier
            .padding(16.dp)
            .clickable { text = "Hello World!" }
    )
}