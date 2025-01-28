package pt.carrismetropolitana.mobile.managers
import androidx.compose.runtime.mutableStateListOf
import com.google.firebase.Firebase
import com.google.firebase.messaging.messaging
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import pt.carrismetropolitana.mobile.services.favorites.FavoriteDao
import pt.carrismetropolitana.mobile.services.favorites.FavoriteItem
import pt.carrismetropolitana.mobile.services.favorites.FavoriteType

class FavoritesManager(private val favoriteDao: FavoriteDao) {
    private val coroutineScope = CoroutineScope(Dispatchers.Main)

    val favorites = mutableStateListOf<FavoriteItem>()

    init {
        loadFavorites()
        fcmSubscribeToFavorites()
    }

    private fun loadFavorites() {
        coroutineScope.launch {
            favoriteDao.getAll().collect { loadedFavorites ->
                withContext(Dispatchers.Main) {
                    favorites.clear()
                    favorites.addAll(loadedFavorites)
                }
            }
        }
    }

    private fun fcmSubscribeForFavoriteItem(item: FavoriteItem) {
        if (item.type == FavoriteType.STOP) {
            Firebase.messaging.subscribeToTopic("cm.realtime.alerts.stop.${item.stopId}")
            for (patternId in item.patternIds) {
                Firebase.messaging.subscribeToTopic("cm.realtime.alerts.line.${patternId.split("_")[0]}")
            }
        } else {
            Firebase.messaging.subscribeToTopic("cm.realtime.alerts.line.${item.lineId}")
        }
    }

    private fun fcmUnsubscribeForFavoriteItem(item: FavoriteItem) {
        if (item.type == FavoriteType.STOP) {
            Firebase.messaging.unsubscribeFromTopic("cm.realtime.alerts.stop.${item.stopId}")
            for (patternId in item.patternIds) {
                Firebase.messaging.unsubscribeFromTopic("cm.realtime.alerts.line.${patternId.split("_")[0]}")
            }
        } else {
            Firebase.messaging.unsubscribeFromTopic("cm.realtime.alerts.line.${item.lineId}")
        }
    }

    private fun fcmSubscribeToFavorites() {
        for (favorite in favorites) {
            if (favorite.receiveNotifications) {
                fcmSubscribeForFavoriteItem(favorite)
            } else {
                fcmUnsubscribeForFavoriteItem(favorite)
            }
        }
    }

    fun addFavorite(item: FavoriteItem) {
        if (item.receiveNotifications) {
            fcmSubscribeForFavoriteItem(item)
        } else {
            fcmUnsubscribeForFavoriteItem(item)
        }
        coroutineScope.launch {
            withContext(Dispatchers.IO) {
                favoriteDao.insert(item)
            }
        }
    }

    fun removeFavorite(item: FavoriteItem) {
        fcmUnsubscribeForFavoriteItem(item)
        coroutineScope.launch {
            withContext(Dispatchers.IO) {
                favoriteDao.delete(item)
            }
        }
    }

    fun isFavorited(itemId: String, itemType: FavoriteType): Boolean {
        return favorites.any {
            when (itemType) {
                FavoriteType.STOP -> it.stopId == itemId
                FavoriteType.PATTERN -> it.lineId == itemId
            }
        }
    }

    fun fuzzyRemove(itemId: String, itemType: FavoriteType) {
        val itemToRemove = favorites.find {
            when (itemType) {
                FavoriteType.STOP -> it.stopId == itemId
                FavoriteType.PATTERN -> it.lineId == itemId
            }
        }
        itemToRemove?.let { removeFavorite(it) }
    }

    private fun fcmUnsubscribeFromAllFavorites() {
        for (favorite in favorites) {
            fcmUnsubscribeForFavoriteItem(favorite)
        }
    }

    fun rewriteAllFavoritesForReorder(newFavorites: List<FavoriteItem>) {
        coroutineScope.launch {
            withContext(Dispatchers.IO) {
                favoriteDao.deleteAll()
                for (favorite in newFavorites) {
                    favoriteDao.insert(favorite)
                }
            }
            loadFavorites()
        }
    }

    fun wipeFavorites() {
        fcmUnsubscribeFromAllFavorites()
        coroutineScope.launch {
            withContext(Dispatchers.IO) {
                favoriteDao.deleteAll()
            }
        }
    }
}