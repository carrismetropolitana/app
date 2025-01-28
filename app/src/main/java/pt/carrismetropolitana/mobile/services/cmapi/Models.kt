package pt.carrismetropolitana.mobile.services.cmapi

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import pt.carrismetropolitana.mobile.utils.normalizedForSearch

@Serializable
enum class Facility {
    @SerialName("school") School,
    @SerialName("boat") Boat,
    @SerialName("subway") Subway,
    @SerialName("train") Train,
    @SerialName("hospital") Hospital,
    @SerialName("shopping") Shopping,
    @SerialName("transit_office") TransitOffice,
    @SerialName("light_rail") LightRail,
    @SerialName("bike_sharing") BikeSharing
}

@Serializable
data class Line(
    val id: String,
    @SerialName("short_name") val shortName: String,
    @SerialName("long_name") val longName: String,
    @SerialName("color") val color: String,
    @SerialName("text_color") val textColor: String,
    val routes: List<String>,
    val patterns: List<String>,
    val municipalities: List<String>,
    val localities: List<String?>,
    val facilities: List<Facility>,

    val longNameNormalized: String = longName.normalizedForSearch()
)

@Serializable
data class Route(
    val id: String,
    @SerialName("line_id") val lineId: String,
    @SerialName("short_name") val shortName: String,
    @SerialName("long_name") val longName: String,
    @SerialName("color") val color: String,
    @SerialName("text_color") val textColor: String,
    val patterns: List<String>,
    val municipalities: List<String>,
    val localities: List<String?>,
    val facilities: List<Facility>
)


@Serializable
data class Stop(
    val id: String,
    @SerialName("stop_id") val stopId: String,
    val name: String,
    @SerialName("short_name") val shortName: String? = null,
    @SerialName("tts_name") val ttsName: String? = null,
    @SerialName("operational_status") val operationalStatus: String? = null,
    val lat: String,
    val lon: String,
    val locality: String? = null,
    @SerialName("parish_id") val parishId: String? = null,
    @SerialName("parish_name") val parishName: String? = null,
    @SerialName("municipality_id") val municipalityId: String,
    @SerialName("municipality_name") val municipalityName: String,
    @SerialName("district_id") val districtId: String,
    @SerialName("district_name") val districtName: String,
    @SerialName("region_id") val regionId: String,
    @SerialName("region_name") val regionName: String,
    @SerialName("wheelchair_boarding") val wheelchairBoarding: String? = null,
    val facilities: List<Facility>,
    val lines: List<String>? = null,
    val routes: List<String>? = null,
    val patterns: List<String>? = null,

    val nameNormalized: String = name.normalizedForSearch(),
    val ttsNameNormalized: String? = ttsName?.normalizedForSearch()
)

@Serializable
data class Pattern(
    val id: String,
    @SerialName("line_id") val lineId: String,
    @SerialName("route_id") val routeId: String,
    @SerialName("short_name") val shortName: String,
    @SerialName("direction") val direction: Int,
    @SerialName("headsign") val headsign: String,
    @SerialName("color") val color: String,
    @SerialName("text_color") val textColor: String,
    @SerialName("valid_on") val validOn: List<String>,
    val municipalities: List<String>,
    val localities: List<String?>,
    val facilities: List<String>,
    @SerialName("shape_id") val shapeId: String,
    val path: List<PathEntry>,
    val trips: List<Trip>
)

@Serializable
data class PathEntry(
    val stop: Stop,
    @SerialName("stop_sequence") val stopSequence: Int,
    @SerialName("allow_pickup") val allowPickup: Boolean,
    @SerialName("allow_drop_off") val allowDropOff: Boolean,
    @SerialName("distance_delta") val distanceDelta: Double
)

@Serializable
data class ScheduleEntry(
    @SerialName("stop_id") val stopId: String,
    @SerialName("stop_sequence") val stopSequence: Int,
    @SerialName("arrival_time") val arrivalTime: String,
    @SerialName("arrival_time_operation") val arrivalTimeOperation: String
)

@Serializable
data class Trip(
    val id: String?,
    @SerialName("calendar_id") val calendarId: String,
    @SerialName("calendar_description") val calendarDescription: String,
    @SerialName("dates") val dates: List<String>,
    @SerialName("schedule") val schedule: List<ScheduleEntry>
)

@Serializable
data class RealtimeETA(
    @SerialName("line_id") val lineId: String,
    @SerialName("pattern_id") val patternId: String,
    @SerialName("route_id") val routeId: String,
    @SerialName("trip_id") val tripId: String,
    val headsign: String,
    @SerialName("stop_sequence") val stopSequence: Int,
    @SerialName("scheduled_arrival") val scheduledArrival: String?,
    @SerialName("scheduled_arrival_unix") val scheduledArrivalUnix: Int?,
    @SerialName("estimated_arrival") val estimatedArrival: String?,
    @SerialName("estimated_arrival_unix") val estimatedArrivalUnix: Int?,
    @SerialName("observed_arrival") val observedArrival: String?,
    @SerialName("observed_arrival_unix") val observedArrivalUnix: Int?,
    @SerialName("vehicle_id") val vehicleId: String?
)

@Serializable
data class PatternRealtimeETA(
    @SerialName("stop_id") val stopId: String,
    @SerialName("line_id") val lineId: String,
    @SerialName("pattern_id") val patternId: String,
    @SerialName("route_id") val routeId: String,
    @SerialName("trip_id") val tripId: String,
    val headsign: String,
    @SerialName("stop_sequence") val stopSequence: Int,
    @SerialName("scheduled_arrival") val scheduledArrival: String?,
    @SerialName("scheduled_arrival_unix") val scheduledArrivalUnix: Int?,
    @SerialName("estimated_arrival") val estimatedArrival: String?,
    @SerialName("estimated_arrival_unix") val estimatedArrivalUnix: Int?,
    @SerialName("observed_arrival") val observedArrival: String?,
    @SerialName("observed_arrival_unix") val observedArrivalUnix: Int?,
    @SerialName("vehicle_id") val vehicleId: String?
)

@Serializable
data class Vehicle(
    val id: String,
    val timestamp: Int,
    @SerialName("schedule_relationship") val scheduleRelationship: String,
    @SerialName("trip_id") val tripId: String,
    @SerialName("pattern_id") val patternId: String,
    @SerialName("route_id") val routeId: String,
    @SerialName("line_id") val lineId: String,
    @SerialName("stop_id") val stopId: String,
    @SerialName("current_status") val currentStatus: String,
    @SerialName("block_id") val blockId: String,
    @SerialName("shift_id") val shiftId: String,
    val lat: Double,
    val lon: Double,
    val bearing: Int,
    val speed: Double
)

@Serializable
data class GeoJSON(
    val type: String,
    val properties: Map<String, String>,
    val geometry: Geometry
) {
    @Serializable
    data class Geometry(
        val type: String,
        val coordinates: List<List<Double>>
    )
}

@Serializable
data class Shape(
    val id: String,
    val points: List<ShapePoint>,
    val geojson: GeoJSON,
    val extension: Int
) {
    @Serializable
    data class ShapePoint(
        @SerialName("shape_pt_lat") val shapePtLat: Double,
        @SerialName("shape_pt_lon") val shapePtLon: Double,
        @SerialName("shape_pt_sequence") val shapePtSequence: Int,
        @SerialName("shape_dist_traveled") val shapeDistTraveled: Double
    )
}

 @Serializable
data class GtfsRt(
    val header: Header,
    val entity: List<GtfsRtAlertEntity>
) {
     @Serializable
    data class Header(
        val gtfsRealtimeVersion: String,
        val incrementality: String,
        val timestamp: Int
    )
}

@Serializable
data class GtfsRtAlertEntity(
    val id: String,
    val alert: GtfsRtAlert
) {
    @Serializable
    data class GtfsRtAlert(
        val activePeriod: List<ActivePeriod>,
        val cause: Cause,
        val descriptionText: TranslatedString,
        val effect: Effect,
        val headerText: TranslatedString,
        val informedEntity: List<EntitySelector>,
        val url: TranslatedString,
        val image: TranslatedImage
    ) {
        @Serializable
        data class ActivePeriod(
            val start: Int,
            val end: Int
        )

        @Serializable
        data class TranslatedString(
            val translation: List<Translation>
        ) {
            @Serializable
            data class Translation(
                val text: String,
                val language: String
            )
        }

        @Serializable
        data class TranslatedImage(
            val localizedImage: List<LocalizedImage>
        ) {
            @Serializable
            data class LocalizedImage(
                val url: String,
                val mediaType: String,
                val language: String
            )
        }

        @Serializable
        data class EntitySelector(
            val agencyId: String? = null,
            val routeId: String? = null,
            val routeType: Int? = null,
            val directionId: Int? = null,
            val stopId: String? = null
        )

        @Serializable
        enum class Cause {
            UNKNOWN_CAUSE,
            OTHER_CAUSE,
            TECHNICAL_PROBLEM,
            STRIKE,
            DEMONSTRATION,
            ACCIDENT,
            HOLIDAY,
            WEATHER,
            MAINTENANCE,
            CONSTRUCTION,
            POLICE_ACTIVITY,
            MEDICAL_EMERGENCY
        }

        @Serializable
        enum class Effect {
            NO_SERVICE,
            REDUCED_SERVICE,
            SIGNIFICANT_DELAYS,
            DETOUR,
            ADDITIONAL_SERVICE,
            MODIFIED_SERVICE,
            OTHER_EFFECT,
            UNKNOWN_EFFECT,
            STOP_MOVED,
            NO_EFFECT,
            ACCESSIBILITY_ISSUE
        }
    }
}

@Serializable
data class ENCM(
    val id: String,
    val name: String,
    val lat: String,
    val lon: String,
    val phone: String,
    val email: String,
    val url: String,
    val address: String,
    @SerialName("postal_code") val postalCode: String,
    val locality: String,
    @SerialName("parish_id") val parishId: String,
    val parishName: String,
    val municipalityId: String,
    val municipalityName: String,
    val districtId: String,
    val districtName: String,
    val regionId: String,
    val regionName: String,
    val hoursMonday: List<String>,
    val hoursTuesday: List<String>,
    val hoursWednesday: List<String>,
    val hoursThursday: List<String>,
    val hoursFriday: List<String>,
    val hoursSaturday: List<String>,
    val hoursSunday: List<String>,
    val hoursSpecial: String,
    val stops: List<String>,
    val currentlyWaiting: Int,
    val expectedWaitTime: Int,
    val activeCounters: Int,
    val isOpen: Boolean
)