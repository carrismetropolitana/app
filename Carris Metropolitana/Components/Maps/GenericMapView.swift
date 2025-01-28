//
//  GenericMapView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 30/03/2024.
//

import SwiftUI
import MapLibre

struct GenericMapView: UIViewRepresentable {
    let styleURL: URL
    
    func makeUIView(context: Context) -> MLNMapView {
        let mapView = MLNMapView(frame: .zero, styleURL: styleURL)
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        mapView.logoView.isHidden = true
        mapView.attributionButtonPosition = .bottomLeft
        mapView.setCenter(
            CLLocationCoordinate2D(latitude: 38.7, longitude: -9.0),
            zoomLevel: 8.9,
            animated: false)
        
        // Add a single tap gesture recognizer. This gesture requires the built-in MGLMapView tap gestures (such as those for zoom and annotation selection) to fail. Apparently... Test if true or not
        let tap = UITapGestureRecognizer(target: context.coordinator, action: #selector(context.coordinator.handleTap(_:)))
        for recognizer in mapView.gestureRecognizers! where recognizer is UITapGestureRecognizer {
             tap.require(toFail: recognizer)
         }
        mapView.addGestureRecognizer(tap)
        

        // needed to respond to map events
        mapView.delegate = context.coordinator

        return mapView
    }
    
    class Coordinator: NSObject, MLNMapViewDelegate {
        var parent: GenericMapView

        init(_ parent: GenericMapView) {
            self.parent = parent
        }
        
        @objc func handleTap(_ sender: UITapGestureRecognizer) {
            print("was asked to handle tap")
            let mapView = sender.view as! MLNMapView
            let point = sender.location(in: mapView)
            let features = mapView.visibleFeatures(at: point, styleLayerIdentifiers: ["stops-layer"])

            if let feature = features.last { // if there are multiple overlapping select the last
                if let featureId = feature.attribute(forKey: "id") as? String {
//                    control.selectedStopId = stopId
                }
            }
        }

        func mapViewDidFinishLoadingMap(_ mapView: MLNMapView) {
            // write your custom code which will be executed
            // after map has been loaded
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func updateUIView(_ uiView: MLNMapView, context: Context) {
    }
}
