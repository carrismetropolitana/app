package pt.carrismetropolitana.mobile.services.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import pt.carrismetropolitana.mobile.services.favorites.FavoriteDao
import pt.carrismetropolitana.mobile.services.favorites.FavoriteItem

@Database(entities = [FavoriteItem::class], version = 2)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun favoriteDao(): FavoriteDao
}