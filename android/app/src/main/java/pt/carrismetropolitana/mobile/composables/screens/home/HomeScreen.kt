package pt.carrismetropolitana.mobile.composables.screens.home

import android.content.Context
import android.os.Build
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.navigation.NavController
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import pt.carrismetropolitana.mobile.LocalFavoritesManager
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.Screens
import pt.carrismetropolitana.mobile.composables.components.favorites.FavoritesCustomizationButton
import pt.carrismetropolitana.mobile.composables.components.internal_widgets.FavoriteLineWidget
import pt.carrismetropolitana.mobile.composables.components.internal_widgets.FavoriteStopWidget
import pt.carrismetropolitana.mobile.composables.components.startup.messages.currentBuildInBuildInterval
import pt.carrismetropolitana.mobile.services.cmwebapi.CMWebAPI
import pt.carrismetropolitana.mobile.services.cmwebapi.PresentationType
import pt.carrismetropolitana.mobile.services.cmwebapi.StartupMessage
import pt.carrismetropolitana.mobile.services.favorites.FavoriteType
import pt.carrismetropolitana.mobile.ui.theme.CMYellow
import java.util.Locale


val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "startupMessages")
val LAST_SHOWED_CHANGELOG_MESSAGE_ID = stringPreferencesKey("lastShowedChangelogMessageId")

fun getLastShowedChangelogMessageId(context: Context): Flow<String> {
    return context.dataStore.data.map { preferences ->
        preferences[LAST_SHOWED_CHANGELOG_MESSAGE_ID] ?: ""
    }
}

fun setLastShowedChangelogMessageId(context: Context, messageId: String) {
    runBlocking {
        context.dataStore.edit { preferences ->
            preferences[LAST_SHOWED_CHANGELOG_MESSAGE_ID] = messageId
        }
    }
}

fun getCurrentLocale(context: Context): Locale {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        context.resources.configuration.locales[0]
    } else {
        context.resources.configuration.locale
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(parentPaddingValues: PaddingValues, navController: NavController, shownStartupMessage: Boolean, onShowStartupMessage: () -> Unit) {
    val favoritesManager = LocalFavoritesManager.current
    val context = LocalContext.current

//    LaunchedEffect(Unit) {
//        favoritesManager.wipeFavorites()
//    }

    LaunchedEffect(Unit) {
        if (!shownStartupMessage) {
            val startupMessages = CMWebAPI.shared.getStartupMessages()
            println("Startup messages: $startupMessages")
            for (message in startupMessages) {
                if (currentBuildInBuildInterval(
                        context = context,
                        maxBuild = message.buildMax,
                        minBuild = message.buildMin
                    )
                ) {
                    val lastShowedChangelogMessageId = getLastShowedChangelogMessageId(context)
                    if (
                        (message.presentationType == PresentationType.Changelog && lastShowedChangelogMessageId.first() != message.messageId)
                        || message.presentationType == PresentationType.Breaking
                    ) {
                        val url = message.urlHost + getCurrentLocale(context) + message.urlPath
                        println("Navigating to $url")
                        onShowStartupMessage()

                        navController.navigate(
                            Screens.StartupMessage.route
                                .replace("{url}", url)
                                .replace("{presentationType}", message.presentationType.name),
                        )

                    }

                    if (message.presentationType == PresentationType.Changelog) {
                        setLastShowedChangelogMessageId(context, message.messageId)
                    }

                    break
                }
            }
        }
    }

    Scaffold(
        topBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(
                        CMYellow
                    ),
                contentAlignment = Alignment.BottomStart
            ) {
                Image(
                    painter = painterResource(id = R.drawable.cm_logo_white),
                    contentDescription = "Logo Carris Metropolitana",
                    modifier = Modifier
                        .padding(bottom = 10.dp)
                        .padding(start = 10.dp)
                        .height(60.dp)
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = paddingValues.calculateTopPadding())
                .padding(bottom = parentPaddingValues.calculateBottomPadding()),
            verticalArrangement = Arrangement.Top,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            if (favoritesManager.favorites.isEmpty()) {
                UnregisteredUserView(
                    navController = navController,
                    modifier = Modifier
                        .padding(top = 48.dp)
                        .padding(horizontal = 24.dp)
                        .verticalScroll(rememberScrollState())
                )
            } else {
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp)
                        .padding(top = 12.dp)
                ) {
                    Text("Favoritos", fontWeight = FontWeight.Bold, fontSize = 24.sp)
                    FavoritesCustomizationButton(onClick = {
                        navController.navigate(Screens.FavoritesCustomization.route)
                    })
                }
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 12.dp)
                        .verticalScroll(rememberScrollState())
                        .padding(top = 18.dp)
                        .padding(bottom = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(24.dp),
                ) {
                    for (favorite in favoritesManager.favorites) {
                        when (favorite.type) {
                            FavoriteType.STOP -> FavoriteStopWidget(
                                favoriteItem = favorite,
                                onStopClick = {
                                    navController.navigate(
                                        Screens.StopDetails.route.replace(
                                            "{stopId}",
                                            favorite.stopId!!
                                        )
                                    )
                                },
                                onLineClick = { lineId, patternId ->
                                    navController.navigate(
                                        Screens.LineDetails.route.replace(
                                            "{lineId}",
                                            lineId
                                        ).replace(
                                            "{overridePatternId}",
                                            patternId
                                        )
                                    )
                                }
                            )
                            FavoriteType.PATTERN -> FavoriteLineWidget(
                                favoriteItem = favorite,
                                onLineClick = {
                                    navController.navigate(
                                        Screens.LineDetails.route.replace(
                                            "{lineId}",
                                            favorite.lineId!!
                                        ).replace(
                                            "{overridePatternId}",
                                            favorite.patternIds.first()
                                        )
                                    )
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}