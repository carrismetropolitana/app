package pt.carrismetropolitana.mobile.views

import android.content.Context
import android.util.AttributeSet
import android.view.LayoutInflater
import android.widget.LinearLayout
import org.maplibre.android.MapLibre
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapView
import pt.carrismetropolitana.mobile.R

class MapLibreMapView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : LinearLayout(context, attrs, defStyleAttr) {

    private lateinit var mapView: MapView
    private var mapLibreMap: MapLibreMap? = null

    init {
        LayoutInflater.from(context).inflate(R.layout.map_view, this, true)
        mapView = findViewById(R.id.mapView)
        MapLibre.getInstance(context)
        mapView.onCreate(null)
        mapView.getMapAsync { map ->
            mapLibreMap = map
            map.setStyle("https://maps.carrismetropolitana.pt/styles/default/style.json")
            map.cameraPosition =
                CameraPosition.Builder().target(LatLng(38.7, -9.0)).zoom(8.9).build()
        }
    }
}