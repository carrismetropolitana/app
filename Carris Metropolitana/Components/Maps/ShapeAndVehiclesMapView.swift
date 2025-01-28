//
//  ShapeAndVehiclesMapView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 26/03/2024.
//

import SwiftUI
import MapLibre

struct ShapeAndVehiclesMapView: UIViewRepresentable {
//    @Environment(\.colorScheme) var colorScheme
    
    // TODO: These no longer need to be bindings
    let stops: [Stop]
    let vehicles: [VehicleV2]
    let shape: CMShape?
    var isUserInteractionEnabled: Bool = true
    let lineColor: Color
    var showPopupOnVehicleSelect: Bool = false
    var onVehicleCalloutTap: (_ vehicleId: String) -> Void = {vehicleId in }
    
    func makeUIView(context: Context) -> MLNMapView {
        
        let styleURL = URL(string: "https://maps.carrismetropolitana.pt/styles/default/style.json")
//        let styleURL = URL(string: colorScheme == .light ? "https://maps.carrismetropolitana.pt/styles/default/style.json" : "https://api.maptiler.com/maps/e9d3c77d-4552-4ed6-83dd-1075b67bd977/style.json?key=NvTfdJJxC0xa6dknGF48")

        let mapView = MLNMapView(frame: .zero, styleURL: styleURL)
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        mapView.logoView.isHidden = true
//        mapView.attributionButtonPosition = .bottomLeft
        mapView.attributionButton.isHidden = true
        mapView.setCenter(
            CLLocationCoordinate2D(latitude: 38.7, longitude: -9.0),
            zoomLevel: 8.9,
            animated: false
        )
        
        mapView.isUserInteractionEnabled = isUserInteractionEnabled
        
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
    
//    func updateUIView(_ uiView: MLNMapView, context: Context) {}
    
    class Coordinator: NSObject, MLNMapViewDelegate {
        var control: ShapeAndVehiclesMapView

        init(_ control: ShapeAndVehiclesMapView) {
            self.control = control
        }
        
        @objc func handleTap(_ sender: UITapGestureRecognizer) {
            print("was asked to handle tap")
            let mapView = sender.view as! MLNMapView
            let point = sender.location(in: mapView)
//            let features = mapView.visibleFeatures(at: point, styleLayerIdentifiers: ["stops-layer"])
//
//            if let feature = features.last { // if there are multiple overlapping select the last
//                
//                if let stopId = feature.attribute(forKey: "id") as? String {
////                    control.selectedStopId = stopId
//                }
//            }
            
            print("[SAVMV] — Got a tap.")
            
            let vehicleFeatures = mapView.visibleFeatures(at: point, styleLayerIdentifiers: ["vehicles-layer"])
            if let feature = vehicleFeatures.last {
                print("[SAVMV] — Found vehicle at tap coordinates")
                if control.showPopupOnVehicleSelect {
                    print("[SAVMV] — Showing callout on vehicle tap because setting was true.")
                    showPopup(feature: feature, mapView: mapView)
                    return
                }
            }
            
            // If no features were found, deselect the selected annotation, if any.
            mapView.deselectAnnotation(mapView.selectedAnnotations.first, animated: true)
        }
        
        func mapView(_ mapView: MLNMapView, didFinishLoading style: MLNStyle) {
            let now = Date()
            
            if now.isHalloweenPeriod {
                if let image = UIImage(named: "CMPumpkinLongBus") {
                    style.setImage(image, forName: "cm-bus-regular")
                    return
                }
            }
            
            if let image = UIImage(named: "CMBusRegular") {
                style.setImage(image, forName: "cm-bus-regular")
            }
            
            if let image = UIImage(named: "CMBusDelay") {
                style.setImage(image, forName: "cm-bus-delay")
            }
        }

//        func mapViewDidFinishLoadingMap(_ mapView: MLNMapView) {
//            if let style = mapView.style {
//                if let image = UIImage(named: "CMBusRegular") {
//                    style.setImage(image, forName: "cm-bus-regular")
//                }
//            }
//        }
        
        private func showPopup(feature: MLNFeature, mapView: MLNMapView) {
            let point = MLNPointFeature()
            point.title = "Autocarro"
            point.subtitle = feature.attributes["id"] as? String
            point.coordinate = feature.coordinate
            
            mapView.selectAnnotation(point, animated: true, completionHandler: nil)
        }
        
        func mapView(_: MLNMapView, annotationCanShowCallout annotation: MLNAnnotation) -> Bool {
            return !(annotation is MLNUserLocation) // we have other features here besides vehicles but since the callout is only shown for features on the vehicles-layer it's okay too keep it like this for now
        }
        
        func mapView(_ mapView: MLNMapView, viewFor annotation: MLNAnnotation) -> MLNAnnotationView? {
            guard !(annotation is MLNUserLocation) else {
                return nil
            }

            let reuseIdentifier = "vehicleAnnotation"
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
            if let optionalTappedVehicleId = annotation.subtitle,
               let tappedVehicleId = optionalTappedVehicleId  { // a little finnicky, maybe filter features and find the one whose coordinates are the same as annotation's and get the id from there?
                control.onVehicleCalloutTap(tappedVehicleId)
                
                // not really needed since we're not removing the annotation but still
                mapView.deselectAnnotation(annotation, animated: true)
            }
        }
        
    }
    
    func makeCoordinator() -> ShapeAndVehiclesMapView.Coordinator {
        Coordinator(self)
    }
    
    func updateUIView(_ uiView: MLNMapView, context: Context) {
        
        
        var hasDoneFirstAutoZoomIn = false
        if let shapeSource = uiView.style?.source(withIdentifier: "shape-source") as? MLNShapeSource {
            uiView.style?.removeSource(shapeSource)
            if let shapeLayer = uiView.style?.layer(withIdentifier: "shape-layer") {
                uiView.style?.removeLayer(shapeLayer)
                hasDoneFirstAutoZoomIn = true
            }
        }
        
        if let vehiclesSource = uiView.style?.source(withIdentifier: "vehicles-source") as? MLNShapeSource {
            uiView.style?.removeSource(vehiclesSource)
            if let vehiclesLayer = uiView.style?.layer(withIdentifier: "vehicles-layer") {
                uiView.style?.removeLayer(vehiclesLayer)
                hasDoneFirstAutoZoomIn = true
            }
        }
        
        if let stopsSource = uiView.style?.source(withIdentifier: "stops-source") as? MLNShapeSource {
            uiView.style?.removeSource(stopsSource)
            if let stopsLayer = uiView.style?.layer(withIdentifier: "stops-layer") {
                uiView.style?.removeLayer(stopsLayer)
                hasDoneFirstAutoZoomIn = true
            }
        }
        
        
        print("Requested SAVMV update with shapepoints: \(shape!.geojson.geometry.coordinates.count)--\(shape?.id)\nwith vehicles: \(vehicles.count)\nwith stops: \(stops.count), (style != nil) == \(uiView.style)")
        if let style = uiView.style {
            // Delete if already exists
            
            if let shapeSource = style.source(withIdentifier: "shape-source") as? MLNShapeSource {
                style.removeSource(shapeSource)
                if let shapeLayer = style.layer(withIdentifier: "shape-layer") {
                    style.removeLayer(shapeLayer)
                }
            }
            
            if let vehiclesSource = style.source(withIdentifier: "vehicles-source") as? MLNShapeSource {
                style.removeSource(vehiclesSource)
                if let vehiclesLayer = style.layer(withIdentifier: "vehicles-layer") {
                    style.removeLayer(vehiclesLayer)
                }
            }
            
            if let stopsSource = style.source(withIdentifier: "stops-source") as? MLNShapeSource {
                style.removeSource(stopsSource)
                if let stopsLayer = style.layer(withIdentifier: "stops-layer") {
                    style.removeLayer(stopsLayer)
                }
            }
            
            
            
            // Shape
            let shapeCoords = shape!.geojson.geometry.coordinates.map { coord -> CLLocationCoordinate2D in
                return CLLocationCoordinate2D(latitude: coord[1], longitude: coord[0])
            }
            
            let shapeFeature = MLNPolylineFeature(coordinates: shapeCoords, count: UInt(shapeCoords.count))
            
            print("shfs ----> \(shapeFeature.pointCount)")
            
            // Vehicles
            let vehicleFeatures = vehicles.compactMap { vehicle -> MLNPointFeature? in
                if let vehicleLat = vehicle.lat, let vehicleLon = vehicle.lon {
                    let feature = MLNPointFeature()
                    feature.coordinate = CLLocationCoordinate2D(latitude: vehicleLat, longitude: vehicleLon)
                    feature.attributes = ["id": vehicle.id, "bearing": vehicle.bearing ?? 0, "delay": Date.now.timeIntervalSince1970 - Double(vehicle.timestamp ?? 0)]
                    return feature
                }
                return nil
            }
            
            print("vfs ----> \(vehicleFeatures.count)")
            
            // Stops
            let stopsFeatures = stops.map { stop -> MLNPointFeature in
                let feature = MLNPointFeature()
                feature.coordinate = CLLocationCoordinate2D(latitude: Double(stop.lat)!, longitude: Double(stop.lon)!)
                feature.attributes = ["id": stop.id, "name": stop.name]
                return feature
            }
            
            // Sources
            let shapeSource = MLNShapeSource(identifier: "shape-source", features: [shapeFeature], options: nil)
            let vehiclesSource = MLNShapeSource(identifier: "vehicles-source", features: vehicleFeatures, options: nil)
            let stopsSource = MLNShapeSource(identifier: "stops-source", features: stopsFeatures, options: nil)
            
            
            // Add sources
            style.addSource(shapeSource)
            style.addSource(vehiclesSource)
            style.addSource(stopsSource)
            
            
            // Shape (Line)
            let shapeLayer = MLNLineStyleLayer(identifier: "shape-layer", source: shapeSource)
            
            shapeLayer.lineJoin = NSExpression(forConstantValue: "round")
            shapeLayer.lineCap = NSExpression(forConstantValue: "round")
            shapeLayer.lineColor = NSExpression(forConstantValue: UIColor(lineColor))
            shapeLayer.lineWidth = NSExpression(
                forMLNInterpolating: .zoomLevelVariable,
                curveType: .linear,
                parameters: nil,
                stops: NSExpression(forConstantValue: [
                    10: NSExpression(forConstantValue: 4),
                    20: NSExpression(forConstantValue: 12)
                ])
            )
            
            // Vehicles (Symbol)
            let vehiclesLayer = MLNSymbolStyleLayer(identifier: "vehicles-layer", source: vehiclesSource)
            vehiclesLayer.iconImageName = NSExpression(
                forMLNConditional: NSPredicate(format: "delay < 40"),
                trueExpression: NSExpression(forConstantValue: "cm-bus-regular"),
                falseExpression: NSExpression(forConstantValue: "cm-bus-delay")
            )
            vehiclesLayer.iconAllowsOverlap = NSExpression(forConstantValue: true)
            vehiclesLayer.iconIgnoresPlacement = NSExpression(forConstantValue: true)
            vehiclesLayer.iconAnchor = NSExpression(forConstantValue: "center")
            vehiclesLayer.symbolPlacement = NSExpression(forConstantValue: "point")
            vehiclesLayer.iconRotationAlignment = NSExpression(forConstantValue: "map")
            vehiclesLayer.iconScale = NSExpression(
                forMLNInterpolating: .zoomLevelVariable,
                curveType: .linear,
                parameters: nil,
                stops: NSExpression(forConstantValue: [
                    10: NSExpression(forConstantValue: 0.05),
                    20: NSExpression(forConstantValue: 0.15)
                ])
            )
            vehiclesLayer.iconOffset = nil // nil defaults to CGVector(dx: 0, dy: 0)
            vehiclesLayer.iconRotation = NSExpression(forKeyPath: "bearing")
            vehiclesLayer.iconOpacity = NSExpression(
                forMLNInterpolating: NSExpression(forKeyPath: "delay"),
                curveType: .linear,
                parameters: nil,
                stops: NSExpression(forConstantValue: [
                    60: NSExpression(forConstantValue: 1.0),
                    180: NSExpression(forConstantValue: 0.0)
                ])
            )
            
            
            // Stops (Circle)
            let stopsLayer = MLNCircleStyleLayer(identifier: "stops-layer", source: stopsSource)
            stopsLayer.circleColor = NSExpression(forConstantValue: UIColor(.white))
            stopsLayer.circleRadius = NSExpression(
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
            stopsLayer.circleStrokeWidth = NSExpression(
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
            stopsLayer.circleStrokeColor = NSExpression(forConstantValue: UIColor(lineColor))
            stopsLayer.circlePitchAlignment = NSExpression(forConstantValue: "map")
            
            style.addLayer(shapeLayer)
            style.insertLayer(stopsLayer, above: shapeLayer)
            style.insertLayer(vehiclesLayer, above: stopsLayer)
            
            if (!hasDoneFirstAutoZoomIn) {
                let boundingBox = shapeCoords.reduce((minLat: Double.greatestFiniteMagnitude, minLon: Double.greatestFiniteMagnitude, maxLat: -Double.greatestFiniteMagnitude, maxLon: -Double.greatestFiniteMagnitude)) { bbox, coord in
                    return (
                        minLat: min(bbox.minLat, coord.latitude),
                        minLon: min(bbox.minLon, coord.longitude),
                        maxLat: max(bbox.maxLat, coord.latitude),
                        maxLon: max(bbox.maxLon, coord.longitude)
                    )
                }
                
                let boundingBoxCoords = [
                    CLLocationCoordinate2D(latitude: boundingBox.minLat, longitude: boundingBox.minLon),
                    CLLocationCoordinate2D(latitude: boundingBox.maxLat, longitude: boundingBox.maxLon)
                ]
                
                let camera = uiView.cameraThatFitsCoordinateBounds(
                    MLNCoordinateBounds(sw: boundingBoxCoords[0], ne: boundingBoxCoords[1]),
                    edgePadding: UIEdgeInsets(top: 10.0, left: 0.0, bottom: 10.0, right: 0.0)
                )
                
                uiView.setCamera(camera, animated: true)
            }
        }
    }
}
