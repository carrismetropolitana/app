package pt.carrismetropolitana.mobile.composables.components.favorites

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGesturesAfterLongPress
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.toMutableStateList
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import androidx.navigation.NavController
import pt.carrismetropolitana.mobile.LocalFavoritesManager
import pt.carrismetropolitana.mobile.LocalLinesManager
import pt.carrismetropolitana.mobile.services.favorites.FavoriteItem
import pt.carrismetropolitana.mobile.services.favorites.FavoriteType
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.composables.components.Pill
import pt.carrismetropolitana.mobile.managers.FavoritesManager
import pt.carrismetropolitana.mobile.ui.theme.CMYellow
import sh.calvin.reorderable.ReorderableItem
import sh.calvin.reorderable.rememberReorderableLazyListState


suspend fun updateFavorites(favoritesManager: FavoritesManager, favorites: List<FavoriteItem>): List<FavoriteItem> {
    println("updating favorites from ${favoritesManager.favorites.map { it.id }} to ${favorites.map { it.id }}")
    favoritesManager.rewriteAllFavoritesForReorder(favorites)
    return favoritesManager.favorites
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun FavoritesCustomization(
    navController: NavController,
    onCloseButtonClick: () -> Unit
) {
    val view = LocalView.current

    val favoritesManager = LocalFavoritesManager.current
    val userReorderedFavorites = remember { mutableStateOf(favoritesManager.favorites.toList()) }

    val lazyListState = rememberLazyListState()
    val reorderableLazyListState = rememberReorderableLazyListState(lazyListState) { from, to ->
        userReorderedFavorites.value = userReorderedFavorites.value.toMutableList().apply {
            add(to.index - 1, removeAt(from.index - 1))
        }
        updateFavorites(favoritesManager, userReorderedFavorites.value)
    }

    LaunchedEffect(favoritesManager.favorites) {
        userReorderedFavorites.value = favoritesManager.favorites.toList()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Personalizar") },
                actions = {
                    IconButton(onClick = { onCloseButtonClick() }) {
                        Icon(Icons.Default.Close, contentDescription = "Fechar")
                    }
                }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            state = lazyListState,
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            item {
                Text(
                    "Ordenar Cartões",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "Organize os cartões como quer que apareçam na página principal. Altere a ordem deslizando no ícone ≡",
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            items(userReorderedFavorites.value, { it.id }) {item ->
                ReorderableItem(reorderableLazyListState, key = item.id) { isDragging ->
                    val interactionSource = remember { MutableInteractionSource() }
                    val modifier = if (isDragging) {
                        Modifier
                            .zIndex(1f)
                            .shadow(16.dp)
                    } else {
                        Modifier
                    }
                    Box(modifier = modifier) {
                        Box(
                            modifier = Modifier
                                .longPressDraggableHandle(
                                    onDragStarted = {
                                        view.performHapticFeedback(HapticFeedbackConstants.DRAG_START)
                                    },
                                    onDragStopped = {
                                        view.performHapticFeedback(HapticFeedbackConstants.GESTURE_END)
                                    },
                                    interactionSource = interactionSource,
                                )
                                .clearAndSetSemantics { }
                        ) {
                            FavoriteItemCard(item, onClick = {
                                navController.navigate("favorite_item_customization/${item.type.name}?favoriteId=${item.stopId ?: item.lineId}")
                            })
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "Adicionar novo cartão",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "Escolha um tipo de cartão para adicionar à página principal.",
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            items(getNewCardOptions()) { option ->
                NewCardOptionButton(option, onClick = { favoriteType ->
                    navController.navigate("favorite_item_customization/${option.favoriteType.name}")
                })
                Spacer(modifier = Modifier.height(8.dp))
            }

            item {
                ComingSoonNewCardOptionButton("Notificação Inteligente") {}
            }
        }
    }
}

data class DraggableItem(val index: Int)

@Composable
fun FavoriteItemCard(item: FavoriteItem, onClick: () -> Unit) {
    val linesManager = LocalLinesManager.current
    Card(
        elevation = CardDefaults.elevatedCardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.background),
        modifier = Modifier
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = ImageVector.vectorResource(R.drawable.drag_handle),
                contentDescription = "Reorder"
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text("${if (item.type == FavoriteType.PATTERN) "Linha" else "Paragem"} favorita", fontSize = 12.sp)
                if (item.type == FavoriteType.PATTERN) {
                    val line = linesManager.data.collectAsState().value.firstOrNull { it.id == item.lineId }
                    Text(line?.longName ?: "", fontWeight = FontWeight.Bold)
                } else {
                    Text(item.displayName!!, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun NewCardOptionButton(option: NewCardOption, onClick: (favoriteType: FavoriteType) -> Unit) {
    Button(
        onClick = { onClick(option.favoriteType) },
        colors = ButtonDefaults.buttonColors(containerColor = CMYellow),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(option.title, color = Color.Black)
            Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.Black)
        }
    }
}

@Composable
fun ComingSoonNewCardOptionButton(optionTitle: String, onClick: () -> Unit) {
    Button(
        onClick = { onClick() },
        colors = ButtonDefaults.buttonColors(containerColor = CMYellow),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(optionTitle, color = Color.Black)
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .background(color = Color.Gray, shape = RoundedCornerShape(24.dp))
                    .width(88.dp)
            ) {
                Text(
                    text = "Em breve".uppercase(),
                    color = Color.White,
                    fontSize = 14.sp, // Set font size in scaled pixels (sp)
                    fontWeight = FontWeight.Black,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                )
            }
        }
    }
}

data class NewCardOption(val favoriteType: FavoriteType, val title: String)

fun getNewCardOptions(): List<NewCardOption> = listOf(
    NewCardOption(FavoriteType.STOP,"Paragem Favorita"),
    NewCardOption(FavoriteType.PATTERN,"Linha Favorita"),
)