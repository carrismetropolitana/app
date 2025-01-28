package pt.carrismetropolitana.mobile.services.favorites

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface FavoriteDao {
    @Query("SELECT * FROM favorites")
    fun getAll(): Flow<List<FavoriteItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(favorite: FavoriteItem)

    @Delete
    suspend fun delete(favorite: FavoriteItem)

    @Query("DELETE FROM favorites")
    suspend fun deleteAll()
}
