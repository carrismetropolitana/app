package pt.carrismetropolitana.mobile.services.favorites

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ColumnInfo

enum class FavoriteType {
    PATTERN, STOP
}

@Entity(tableName = "favorites")
data class FavoriteItem(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "type") val type: FavoriteType,
    @ColumnInfo(name = "display_name") val displayName: String?,
    @ColumnInfo(name = "line_id") val lineId: String?,
    @ColumnInfo(name = "stop_id") val stopId: String?,
    @ColumnInfo(name = "pattern_ids") val patternIds: List<String>,
    @ColumnInfo(name = "receive_notifications") val receiveNotifications: Boolean
) {
    companion object {
        fun create(
            type: FavoriteType,
            patternIds: List<String>,
            stopId: String? = null,
            displayName: String? = null,
            lineId: String? = null,
            receiveNotifications: Boolean = false
        ): FavoriteItem {
            val id = when (type) {
                FavoriteType.PATTERN -> "favorites:pattern:${patternIds.firstOrNull()}"
                FavoriteType.STOP -> "favorites:stop:$stopId"
            }
            return FavoriteItem(
                id = id,
                type = type,
                displayName = displayName,
                lineId = lineId,
                stopId = stopId,
                patternIds = if (type == FavoriteType.PATTERN) patternIds.take(1) else patternIds,
                receiveNotifications = receiveNotifications
            )
        }
    }
}