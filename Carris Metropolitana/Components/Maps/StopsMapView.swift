//
//  StopsMapView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 17/03/2024.
//

import SwiftUI
import MapLibre

enum MapVisualStyle: CaseIterable {
    case standard, satellite
}

func getMapVisualStyleString(for mapVisualStyle: MapVisualStyle) -> String {
    switch mapVisualStyle {
    case .standard:
        "Mapa"
    case .satellite:
        "Satélite"
    }
}


struct StopsMapView: UIViewRepresentable {
    @Environment(\.colorScheme) var colorScheme
    
//    @EnvironmentObject var locationManager: LocationManager
    
    var stops: [Stop]
//    @Binding var selectedStopId: String?
    
    let onStopSelect: (_ stopId: String) -> Void
    
    @Binding var flyToCoords: CLLocationCoordinate2D?
    @Binding var shouldFlyToUserCoords: Bool
    @Binding var mapVisible: Bool
    
    var mapVisualStyle: MapVisualStyle = .standard
    
    var showPopupOnStopSelect: Bool = false
    
    func makeUIView(context: Context) -> MLNMapView {
        print("StopsMapView makeUIView called")
        //        let styleURL = URL(string: "https://maps.carrismetropolitana.pt/styles/default/style.json")
        //        let styleURL = URL(string: colorScheme == .light ? "https://maps.carrismetropolitana.pt/styles/default/style.json" : "https://api.maptiler.com/maps/e9d3c77d-4552-4ed6-83dd-1075b67bd977/style.json?key=NvTfdJJxC0xa6dknGF48")
        
        //        let mapView = MLNMapView(frame: .zero, styleURL: styleURL)
        let mapView = MLNMapView(frame: .zero)
        updateStyle(mapView)
//        updateTiles(mapView)
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        mapView.logoView.isHidden = true
        mapView.attributionButtonPosition = .bottomLeft
        
        if let location = mapView.userLocation {
            mapView.setCenter(
                location.coordinate,
                zoomLevel: 12,
                animated: false
            )
        } else {
            mapView.setCenter(
                CLLocationCoordinate2D(latitude: 38.7, longitude: -9.0),
                zoomLevel: 8.9,
                animated: false)
        }
        
        // Add a single tap gesture recognizer. This gesture requires the built-in MGLMapView tap gestures (such as those for zoom and annotation selection) to fail. Apparently... Test if true or not
        let tap = UITapGestureRecognizer(target: context.coordinator, action: #selector(context.coordinator.handleTap(_:)))
        for recognizer in mapView.gestureRecognizers! where recognizer is UITapGestureRecognizer {
            tap.require(toFail: recognizer)
        }
        mapView.addGestureRecognizer(tap)
        
        
        // needed to respond to map events
        mapView.delegate = context.coordinator
        
        mapView.showsUserLocation = true
        
        return mapView
    }
    
    private func updateStyle(_ mapView: MLNMapView) {
        mapView.styleURL = URL(string: "https://maps.carrismetropolitana.pt/styles/default/style.json")
    }
    
    private func updateTiles(on mapView: MLNMapView, to visualStyle: MapVisualStyle) {
        guard let style = mapView.style else {
            print("[StopsMapView.updateTiles] — Tried to update tiles but style is not loaded.")
            return
        }
        
        switch visualStyle {
        case .standard:
            if let satelliteTilesSource = mapView.style?.source(withIdentifier: "satellite-source") {
                mapView.style?.removeSource(satelliteTilesSource)
            }
            
            if let satelliteTilesLayer = mapView.style?.layer(withIdentifier: "satellite-layer") {
                mapView.style?.removeLayer(satelliteTilesLayer)
            }
        case .satellite:
            print("updating to satellite")
            let rasterTilesSource = MLNRasterTileSource(
                identifier: "satellite-source",
                tileURLTemplates: ["https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                options: [
                    .minimumZoomLevel: 5,
                    .maximumZoomLevel: 18,
                    .tileSize: 256,
                    .attributionInfos: [
                        MLNAttributionInfo(
                            title: NSAttributedString("Esri, Maxar, Earthstar Geographics, and the GIS User Community"),
                            url: URL(string: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer")
                        )
                    ]
                ]
            )
            mapView.style?.addSource(rasterTilesSource)
            
            let rasterTilesLayer = MLNRasterStyleLayer(identifier: "satellite-layer", source: rasterTilesSource)
            mapView.style?.insertLayer(rasterTilesLayer, below: (mapView.style?.layer(withIdentifier: "stops-layer"))!)
        }
    }
    
    private func addStops(to mapView: MLNMapView) {
        print("Adding stops layer with \(stops.count) stops")
        // Convert Stop objects to MGLPointFeature objects
        let features = stops.map { stop -> MLNPointFeature in
            let feature = MLNPointFeature()
            feature.coordinate = CLLocationCoordinate2D(latitude: Double(stop.lat)!, longitude: Double(stop.lon)!)
            feature.attributes = ["id": stop.id, "name": stop.name]
            return feature
        }
        
        // Create a MGLShapeSource with the features
        let source = MLNShapeSource(identifier: "stops", features: features, options: nil)
        
        // Create a MGLCircleStyleLayer using the source
        let layer = MLNCircleStyleLayer(identifier: "stops-layer", source: source)
        
        
        // Set the layer properties
//        layer.circleColor = NSExpression(
//            forMLNStepping: .zoomLevelVariable,
//            from: NSExpression(forConstantValue: UIColor.cmYellow),
//            stops: NSExpression(forConstantValue: [
//                9: NSExpression(forConstantValue: UIColor.white)
//            ])
//        )
        layer.circleColor = NSExpression(forConstantValue: UIColor.cmYellow)
        layer.circleRadius = NSExpression(
            forMLNInterpolating: .zoomLevelVariable,
            curveType: .linear,
            parameters: nil,
            stops: NSExpression(forConstantValue: [
                9: NSExpression(
                    forConditional: NSPredicate(format: "selected == TRUE"),
                    trueExpression: NSExpression(forConstantValue: 5),
                    falseExpression: NSExpression(forConstantValue: 1)
                ),
                26: NSExpression(
                    forConditional: NSPredicate(format: "selected == TRUE"),
                    trueExpression: NSExpression(forConstantValue: 25),
                    falseExpression: NSExpression(forConstantValue: 20)
                )
            ])
        )
        layer.circleStrokeWidth = NSExpression(
            forMLNInterpolating: .zoomLevelVariable,
            curveType: .linear,
            parameters: nil,
            stops: NSExpression(forConstantValue: [
                9: NSExpression(forConstantValue: 0.01),
                26: NSExpression(
                    forConditional: NSPredicate(format: "selected == TRUE"),
                    trueExpression: NSExpression(forConstantValue: 8),
                    falseExpression: NSExpression(forConstantValue: 7)
                )
            ])
        )
        layer.circleStrokeColor = NSExpression(forConstantValue: UIColor(.black))
        layer.circlePitchAlignment = NSExpression(forConstantValue: "map")
        
        
        // Add the source to the map view
        mapView.style?.addSource(source)
        
        // Add the layer to the map view
        mapView.style?.addLayer(layer)
    }
    
    private func updateStops(on mapView: MLNMapView) {
        print("Updating stops layer with \(stops.count) stops")
        guard let source = mapView.style?.source(withIdentifier: "stops") as? MLNShapeSource else {
            print("Stops source not found")
            return
        }
        
        let features = stops.map { stop -> MLNPointFeature in
            let feature = MLNPointFeature()
            feature.coordinate = CLLocationCoordinate2D(latitude: Double(stop.lat)!, longitude: Double(stop.lon)!)
            feature.attributes = ["id": stop.id, "name": stop.name]
            return feature
        }
        
        source.shape = MLNShapeCollectionFeature(shapes: features)
    }
    
    class Coordinator: NSObject, MLNMapViewDelegate {
        var control: StopsMapView
        var mapVisualStyle: MapVisualStyle // is this really how this is supposed to be done??
        var flyToCoords: CLLocationCoordinate2D?
        var mapVisible: Bool = true
        
        init(_ control: StopsMapView) {
            self.control = control
            self.mapVisualStyle = control.mapVisualStyle
            self.flyToCoords = control.flyToCoords
            self.mapVisible = control.mapVisible
        }
        
        @objc func handleTap(_ sender: UITapGestureRecognizer) {
            print("was asked to handle tap")
            let mapView = sender.view as! MLNMapView
            let point = sender.location(in: mapView)
            let features = mapView.visibleFeatures(at: point, styleLayerIdentifiers: ["stops-layer"])
            
            // Try matching the exact point first.
            if let feature = features.last { // if there are multiple overlapping select the last
                if let stopId = feature.attribute(forKey: "id") as? String {
//                    control.selectedStopId = ""
//                    DispatchQueue.main.async {
//                        self.control.selectedStopId = stopId
//                    }
                    if (control.showPopupOnStopSelect) {
                        showPopup(feature: feature, mapView: mapView)
                        return
                    } else {
                        // if let style = mapView.style {
                        //     updateAndMakeVisibleSelectedStop(coordinate: feature.coordinate, style: style)
                        // } else {
                        //     print("[ADD_SELECTED_STOP_FLAG] — Style was not available.")
                        // }
                        control.onStopSelect(stopId)
                        return
                    }
                }
            }
            
            let touchCoordinate = mapView.convert(point, toCoordinateFrom: sender.view!)
            let touchLocation = CLLocation(latitude: touchCoordinate.latitude, longitude: touchCoordinate.longitude)


            // Otherwise, get all features within a rect the size of a touch (44x44).
            let touchRect = CGRect(origin: point, size: .zero).insetBy(dx: -22.0, dy: -22.0)
            let possibleFeatures = mapView.visibleFeatures(in: touchRect, styleLayerIdentifiers: Set(["stops-layer"])).filter { $0 is MLNPointFeature }
            
            // Select the closest feature to the touch center. Basically this solves having to click exactly on the annotation, giving the user a little more margin for click error
            let closestFeatures = possibleFeatures.sorted(by: {
                CLLocation(latitude: $0.coordinate.latitude, longitude: $0.coordinate.longitude).distance(from: touchLocation) < CLLocation(latitude: $1.coordinate.latitude, longitude: $1.coordinate.longitude).distance(from: touchLocation)
            })
            if let feature = closestFeatures.first {
                guard let closestFeature = feature as? MLNPointFeature else {
                    fatalError("Failed to cast selected feature as MLNPointFeature")
                }
                if let stopId = feature.attribute(forKey: "id") as? String {
                    if (control.showPopupOnStopSelect) {
                        showPopup(feature: feature, mapView: mapView)
                        return
                    } else {
                        // if let style = mapView.style {
                        //     updateAndMakeVisibleSelectedStop(coordinate: feature.coordinate, style: style)
                        // } else {
                        //     print("[ADD_SELECTED_STOP_FLAG] — Style was not available.")
                        // }
                        control.onStopSelect(stopId)
                        return
                    }
                }
                return
            }
            
            
            // If no features were found, deselect the selected annotation, if any.
            mapView.deselectAnnotation(mapView.selectedAnnotations.first, animated: true)
            // if let style = mapView.style {
            //     hideSelectedStop(style: style)
            // } else {
            //     print("[ADD_SELECTED_STOP_FLAG] — (on hideSelectedStop): Style was not available.")
            // }
        }
        
        func mapView(_ mapView: MLNMapView, didFinishLoading style: MLNStyle) {
            if (!mapVisible){
                return
            }
            print("MapView loaded Style -> \(mapVisualStyle)")
            if let image = UIImage(named: "CMMapSelectedStop") {
                style.setImage(image, forName: "cm-map-selected-stop")
            }
            // control.updateStyle(mapView)
            control.addStops(to: mapView)
            control.updateTiles(on: mapView, to: mapVisualStyle)
            
            // addSelectedStopSource(style: style)
        }
        
        func mapViewDidFinishLoadingMap(_ mapView: MLNMapView) {
            print("mapviewdidfinishloadingmap")
        }
        
        func mapView(_: MLNMapView, annotationCanShowCallout annotation: MLNAnnotation) -> Bool {
            return !(annotation is MLNUserLocation)
        }
        
        // can't do this because the map will try to access the annotation by pointer onDisappear which is left dangling at that point because the annotation was removed. it's okay to leave it because it's invisible. this was an issue because if an annotation is selected and then the map disappears it will still try to access the annotation and cause an error by trying because of the now dangling pointer
//        func mapView(_ mapView: MLNMapView, didDeselect annotation: MLNAnnotation) {
//            mapView.removeAnnotations([annotation])
//        }
        
        func mapView(_ mapView: MLNMapView, viewFor annotation: MLNAnnotation) -> MLNAnnotationView? {
            guard !(annotation is MLNUserLocation) else {
                return nil
            }

            let reuseIdentifier = "stopAnnotation"
            var annotationView = mapView.dequeueReusableAnnotationView(withIdentifier: reuseIdentifier)

            if annotationView == nil {
                annotationView = MLNAnnotationView(annotation: annotation, reuseIdentifier: reuseIdentifier)
            }

            return annotationView
        }
    

        // wow
        func mapView(_ mapView: MLNMapView, rightCalloutAccessoryViewFor annotation: MLNAnnotation) -> UIView? {
            let configuration = UIImage.SymbolConfiguration(weight: .medium)
            let chevronImage = UIImage(systemName: "chevron.right", withConfiguration: configuration)
            let chevronImageView = UIImageView(image: chevronImage)
            chevronImageView.tintColor = .black
            
            let containerButton = UIButton(frame: CGRect(x: 0, y: 0, width: chevronImageView.frame.width + 20, height: chevronImageView.frame.height + 20))
            containerButton.addSubview(chevronImageView)
            chevronImageView.center = containerButton.center
            
            // Make the button's background clear
            containerButton.backgroundColor = .clear
            
            return containerButton
        }
        
        func mapView(_ mapView: MLNMapView, tapOnCalloutFor annotation: MLNAnnotation) {
            // double optional
            if let optionalSelectedStopId = annotation.subtitle,
               let selectedStopId = optionalSelectedStopId  { // a little finnicky, maybe filter features and find the one whose coordinates are the same as annotation's and get the id from there?
                control.onStopSelect(selectedStopId)
                
                // not really needed since we're not removing the annotation but still
                mapView.deselectAnnotation(annotation, animated: true)
            }
        }
        
        private func showPopup(feature: MLNFeature, mapView: MLNMapView) {
            let point = MLNPointFeature()
            point.title = feature.attributes["name"] as? String
            point.subtitle = feature.attributes["id"] as? String
            point.coordinate = feature.coordinate
            
            mapView.selectAnnotation(point, animated: true, completionHandler: nil)
        }
        
        // this might not be the best way to do this
        
        // can only be ran once per map init
        private func addSelectedStopSource(style: MLNStyle) {
            if style.source(withIdentifier: "selected-stop-source") == nil {
                print("[ADD_FLAG_IMAGE] — Adding flag image.")
                
                let selectedStopSource = MLNShapeSource(identifier: "selected-stop-source", features: [])
                
                style.addSource(selectedStopSource)
                print("[ADD_FLAG_IMAGE] — Added source to style.")
            }
        }
        
        private func addSelectedStopLayer(style: MLNStyle, forSource selectedStopSource: MLNSource) {
            let selectedStopLayer = MLNSymbolStyleLayer(identifier: "selected-stop-layer", source: selectedStopSource)
            selectedStopLayer.iconImageName = NSExpression(forConstantValue: "cm-map-selected-stop")
            selectedStopLayer.iconAllowsOverlap = NSExpression(forConstantValue: true)
            selectedStopLayer.iconIgnoresPlacement = NSExpression(forConstantValue: true)
            selectedStopLayer.iconAnchor = NSExpression(forConstantValue: "bottom")
            selectedStopLayer.symbolPlacement = NSExpression(forConstantValue: "point")
//            selectedStopLayer.iconRotationAlignment = NSExpression(forConstantValue: "map")
            selectedStopLayer.iconScale = NSExpression(
                forMLNInterpolating: .zoomLevelVariable,
                curveType: .linear,
                parameters: nil,
                stops: NSExpression(forConstantValue: [
                    10: NSExpression(forConstantValue: 0.1),
                    20: NSExpression(forConstantValue: 0.25)
                ])
            )
            selectedStopLayer.iconOffset = NSExpression(forConstantValue: CGVector(dx: 0, dy: 5)) // nil defaults to CGVector(dx: 0, dy: 0)
            selectedStopLayer.iconOpacity = NSExpression(
                forMLNInterpolating: .zoomLevelVariable,
                curveType: .linear,
                parameters: nil,
                stops: NSExpression(forConstantValue: [
                    7: NSExpression(forConstantValue: 0),
                    10: NSExpression(forConstantValue: 1)
                ])
            )
            
            if let stopsLayer = style.layer(withIdentifier: "stops-layer") {
                style.insertLayer(selectedStopLayer, above: stopsLayer)
                print("[ADD_FLAG_IMAGE] — Found stops layer so added flag above it.")
            } else {
                style.addLayer(selectedStopLayer)
                print("[ADD_FLAG_IMAGE] — Stops layer not found so added flag on top of everything.")
            }
        }
        
        private func hideSelectedStop(style: MLNStyle) {
            if let layer = style.layer(withIdentifier: "selected-stop-layer") {
                print("[ADD_FLAG_IMAGE] — Layer already exists, removing...")
                style.removeLayer(layer)
            }
        }
        
        private func updateAndMakeVisibleSelectedStop(coordinate: CLLocationCoordinate2D, style: MLNStyle) {
            if let selectedStopSource = style.source(withIdentifier: "selected-stop-source") as? MLNShapeSource {
                let selectedStopFeature = MLNPointFeature()
                selectedStopFeature.coordinate = coordinate
                
                selectedStopSource.shape = MLNShapeCollectionFeature(shapes: [
                    selectedStopFeature
                ])
            }
        }
    }
    
    func flyToCoordinate(on mapView: MLNMapView, to coordinate: CLLocationCoordinate2D) {
        let camera = MLNMapCamera(
            lookingAtCenter: coordinate,
            altitude: 1500,
            pitch: 0,
            heading: 0)
        
        mapView.setCamera(
            camera,
            withDuration: 1,
            animationTimingFunction: CAMediaTimingFunction(name: .easeInEaseOut))
    }
    
    func flyToUserCoords(on mapView: MLNMapView) {
        if let userLocation = mapView.userLocation {
            let camera = MLNMapCamera(
                lookingAtCenter: userLocation.coordinate,
                altitude: 1500,
                pitch: 0,
                heading: 0)
            
            mapView.setCamera(
                camera,
                withDuration: 1,
                animationTimingFunction: CAMediaTimingFunction(name: .easeInEaseOut))
        }
    }
    
    func makeCoordinator() -> StopsMapView.Coordinator {
        Coordinator(self)
    }
    
    func updateUIView(_ uiView: MLNMapView, context: Context) {
        if (!mapVisible){
            return
        }
        print("StopsMapView updateUIView called")
        print("updateUIView called with \(stops.count) stops")
        
        guard let style = uiView.style else {
            print("Style not loaded yet")
            return
        }
        
        updateStyle(uiView)
        print("update ui view, st is \(mapVisualStyle)")
        print("style is \(uiView.style)")
//        updateTiles(uiView)
        context.coordinator.mapVisualStyle = mapVisualStyle

        if style.source(withIdentifier: "stops") == nil {
            addStops(to: uiView)
        } else {
            updateStops(on: uiView)
        }
        
        print("flytocoords out nilguard is \(flyToCoords)")
        if let flyToCoords = flyToCoords {
            flyToCoordinate(on: uiView, to: flyToCoords)
        }
        flyToCoords = nil
        
        if shouldFlyToUserCoords {
            print("should fly to user coords is \(shouldFlyToUserCoords)")
            flyToUserCoords(on: uiView)
            DispatchQueue.main.async {
                shouldFlyToUserCoords = false
            }
        }
    }
}
