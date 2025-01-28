package pt.carrismetropolitana.mobile.services.database

import androidx.room.TypeConverter

class Converters {
    @TypeConverter
    fun fromString(value: String): List<String> = value.split(",")

    @TypeConverter
    fun toString(list: List<String>): String = list.joinToString(",")
}