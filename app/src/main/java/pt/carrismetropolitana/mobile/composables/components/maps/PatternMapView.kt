package pt.carrismetropolitana.mobile.composables.components.maps

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.res.ResourcesCompat
import androidx.core.graphics.drawable.toBitmap
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdateFactory
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.geometry.LatLngBounds
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.style.expressions.Expression
import org.maplibre.android.style.layers.CircleLayer
import org.maplibre.android.style.layers.LineLayer
import org.maplibre.android.style.layers.Property
import org.maplibre.android.style.layers.PropertyFactory
import org.maplibre.android.style.layers.SymbolLayer
import org.maplibre.android.style.sources.GeoJsonSource
import org.maplibre.geojson.BoundingBox
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.geojson.Point
import pt.carrismetropolitana.mobile.R
import pt.carrismetropolitana.mobile.services.cmapi.Shape
import pt.carrismetropolitana.mobile.services.cmapi.Stop
import pt.carrismetropolitana.mobile.services.cmapi.Vehicle
import pt.carrismetropolitana.mobile.utils.isHalloweenPeriod
import java.time.LocalDate

@Composable
fun PatternMapView(
    modifier: Modifier = Modifier,
    shape: Shape,
    lineColorHex: String,
    stops: List<Stop>,
    vehicles: List<Vehicle>,
    disabledUserInteraction: Boolean = false,
    onMapReady: (MapLibreMap) -> Unit = {},
    onStopClick: (stopId: String) -> Unit = {}
) {
    val context = LocalContext.current
    val mapView = rememberMapViewWithLifecycle(context)

    AndroidView(
        modifier = modifier,
        factory = {
            mapView.apply {
                getMapAsync { map ->
                    map.setStyle("https://maps.carrismetropolitana.pt/styles/default/style.json") { style ->
                        // Hide attributions
                        map.uiSettings.isAttributionEnabled = false
                        map.uiSettings.isLogoEnabled = false

                        if (disabledUserInteraction) {
                            map.uiSettings.isScrollGesturesEnabled = false
                            map.uiSettings.isZoomGesturesEnabled = false
                            map.uiSettings.isRotateGesturesEnabled = false
                        }

                        val now = LocalDate.now()

                        val cmBusDrawable = if (now.isHalloweenPeriod) {
                            ResourcesCompat.getDrawable(
                                context.resources,
                                R.drawable.cm_pumpkin_long_bus,
                                null
                            )
                        } else null ?: ResourcesCompat.getDrawable(
                            context.resources,
                            R.drawable.cm_bus_regular,
                            null
                        )

                        cmBusDrawable?.let {
                            style.addImage(
                                "cm-bus-regular",
                                it
                            )
                        }

                        println(Json.encodeToString(shape.geojson))

                        // Sources
                        val shapeGeoJsonSource = GeoJsonSource("shape-source", FeatureCollection.fromFeature(
                            Feature.fromJson(Json.encodeToString(shape.geojson))
                        ))

                        val stopsGeoJsonSource = GeoJsonSource("stops-source", createGeoJsonFromStops(stops))

                        val vehiclesGeoJsonSource = GeoJsonSource("vehicles-source", createGeoJsonFromVehicles(vehicles))

                        // Layers
                        val shapeLayer = LineLayer("shape-layer", "shape-source")
                            .withProperties(
                                PropertyFactory.lineJoin(Property.LINE_JOIN_ROUND),
                                PropertyFactory.lineCap(Property.LINE_CAP_ROUND),
                                PropertyFactory.lineColor(lineColorHex),
                                PropertyFactory.lineWidth(
                                    Expression.interpolate(
                                        Expression.linear(), Expression.zoom(),
                                        Expression.stop(10, 4f),
                                        Expression.stop(20, 12f)
                                    )
                                )
                            )

                        val vehiclesLayer = SymbolLayer("vehicles-layer", "vehicles-source")
                            .withProperties(
                                PropertyFactory.iconImage("cm-bus-regular"),
                                PropertyFactory.iconAllowOverlap(true),
                                PropertyFactory.iconIgnorePlacement(true),
                                PropertyFactory.iconAnchor(Property.ICON_ANCHOR_CENTER),
                                PropertyFactory.symbolPlacement(Property.SYMBOL_PLACEMENT_POINT),
                                PropertyFactory.iconRotationAlignment(Property.ICON_ROTATION_ALIGNMENT_MAP),
                                PropertyFactory.iconSize(
                                    Expression.interpolate(
                                        Expression.linear(), Expression.zoom(),
                                        Expression.stop(10, 0.05f),
                                        Expression.stop(20, 0.15f)
                                    )
                                ),
                                PropertyFactory.iconOffset(arrayOf(0f, 0f)),
                                PropertyFactory.iconRotate(
                                    Expression.get("bearing")
                                )
                            )



                        // Add stops layer
                        val stopsLayer = CircleLayer("stops-layer", "stops-source")
                            .withProperties(
                                PropertyFactory.circleColor("#ffffff"),
                                PropertyFactory.circleStrokeColor(lineColorHex),
                                PropertyFactory.circleRadius(
                                    Expression.interpolate(
                                        Expression.linear(), Expression.zoom(),
                                        Expression.stop(9, 1f),
                                        Expression.stop(26, 20f)
                                    )
                                ),
                                PropertyFactory.circleStrokeWidth(
                                    Expression.interpolate(
                                        Expression.linear(), Expression.zoom(),
                                        Expression.stop(9, 0.01f),
                                        Expression.stop(26, 7f)
                                    )
                                ),
                                PropertyFactory.circlePitchAlignment(Property.CIRCLE_PITCH_ALIGNMENT_MAP)
                            )


                        style.addSource(shapeGeoJsonSource)
                        style.addSource(stopsGeoJsonSource)
                        style.addSource(vehiclesGeoJsonSource)

                        style.addLayer(shapeLayer)
                        style.addLayer(stopsLayer)
                        style.addLayer(vehiclesLayer)

                        // calculate shape bbox


                        val cameraUpdate = CameraUpdateFactory.newLatLngBounds(getShapeLatLngBounds(shape), 50)
                        map.moveCamera(cameraUpdate)


                        // Setup map click listener to handle stop clicks
                        map.addOnMapClickListener { point ->
                            val screenPoint = map.projection.toScreenLocation(point)
                            val features = map.queryRenderedFeatures(screenPoint, "stops-layer")

                            if (features.isNotEmpty()) {
                                val feature = features[0]
                                val stopId = feature.getStringProperty("id")
                                onStopClick(stopId)
                                true
                            } else {
                                false
                            }
                        }

                        onMapReady(map)
                    }
                }
            }
        },
        update = {
            it.getMapAsync { mapboxMap ->
                mapboxMap.getStyle { style ->
                    val shapeGeoJsonSource = style.getSourceAs<GeoJsonSource>("shape-source")
                    shapeGeoJsonSource?.setGeoJson(
                        FeatureCollection.fromFeature(
                            Feature.fromJson(
                                Json.encodeToString(shape.geojson)
                            )
                        )
                    )

                    val stopsGeoJsonSource = style.getSourceAs<GeoJsonSource>("stops-source")
                    stopsGeoJsonSource?.setGeoJson(createGeoJsonFromStops(stops))

                    val vehiclesGeoJsonSource = style.getSourceAs<GeoJsonSource>("vehicles-source")
                    vehiclesGeoJsonSource?.setGeoJson(createGeoJsonFromVehicles(vehicles))
                }
            }
        }
    )
}



fun createGeoJsonFromVehicles(vehicles: List<Vehicle>): FeatureCollection {
    println("Creating GeoJson from ${vehicles.size} vehicles")
    val features = vehicles.map { vehicle ->
        val point = Point.fromLngLat(vehicle.lon, vehicle.lat)
        Feature.fromGeometry(point).apply {
            addStringProperty("id", vehicle.id)
            addNumberProperty("bearing", vehicle.bearing)
        }
    }
    return FeatureCollection.fromFeatures(features)
}

fun getShapeLatLngBounds(shape: Shape): LatLngBounds {
    val boundsBuilder = LatLngBounds.Builder()

    // Add all points from the shape to the bounds
    for (point in shape.points) {
        boundsBuilder.include(LatLng(point.shapePtLat, point.shapePtLon))
    }

    return boundsBuilder.build()
}