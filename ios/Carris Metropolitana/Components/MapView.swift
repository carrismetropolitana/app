//
//  MapView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/03/2024.
//

import SwiftUI
import MapKit
//
//struct MapView: UIViewRepresentable {
//    var annotations: [MKAnnotation]
//
//    func makeUIView(context: Context) -> MKMapView {
//        let mapView = MKMapView()
//        mapView.delegate = context.coordinator
//        return mapView
//    }
//
//    func updateUIView(_ view: MKMapView, context: Context) {
//        view.addAnnotations(annotations)
//    }
//
//    func makeCoordinator() -> Coordinator {
//        Coordinator(self)
//    }
//
//    class Coordinator: NSObject, MKMapViewDelegate {
//        var parent: MapView
//
//        init(_ parent: MapView) {
//            self.parent = parent
//        }
//
//        func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
//                if let cluster = annotation as? MKClusterAnnotation {
//                    let identifier = "Cluster"
//                    var view: MKMarkerAnnotationView
//                    if let dequeuedView = mapView.dequeueReusableAnnotationView(withIdentifier: identifier)
//                        as? MKMarkerAnnotationView {
//                        dequeuedView.annotation = cluster
//                        view = dequeuedView
//                    } else {
//                        view = MKMarkerAnnotationView(annotation: cluster, reuseIdentifier: identifier)
//                        view.canShowCallout = true
//                    }
//                    view.glyphText = "\(cluster.memberAnnotations.count)"
//                    return view
//                } else {
//                    // handle non-cluster annotations
//                }
//                return nil
//            }
//    }
//}

struct MapView: UIViewRepresentable {
    typealias UIViewType = MKMapView

    // Binding for stops
    @Binding var stops: [Stop]

    // MapView delegate
    class Coordinator: NSObject, MKMapViewDelegate {
        var parent: MapView

        init(_ parent: MapView) {
            self.parent = parent
        }

        // Function to create and return annotation views
        func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
            guard let annotation = annotation as? StopAnnotation else {
                return nil
            }

            let identifier = "StopAnnotation"
            var annotationView = mapView.dequeueReusableAnnotationView(withIdentifier: identifier)

            if annotationView == nil {
                annotationView = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: identifier)
                annotationView?.canShowCallout = true
            } else {
                annotationView?.annotation = annotation
            }
            
            // Customize the annotation view
            let circleView = UIView(frame: CGRect(x: 0, y: 0, width: 24, height: 24))
            circleView.layer.cornerRadius = 12
            circleView.backgroundColor = UIColor.black.withAlphaComponent(0.6)
            circleView.layer.borderWidth = 2.0
            circleView.layer.borderColor = UIColor.cmYellow.cgColor
            annotationView?.addSubview(circleView)
            annotationView?.centerOffset = CGPoint(x: 0, y: -12) // Adjust the center offset to align the annotation properly


            return annotationView
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> MKMapView {
        let mapView = MKMapView()
        mapView.delegate = context.coordinator

        // Add initial annotations to the map
        addAnnotations(to: mapView)

        return mapView
    }

    func updateUIView(_ uiView: MKMapView, context: Context) {
        // Remove existing annotations
        uiView.removeAnnotations(uiView.annotations)
        
        // Add updated annotations to the map
        addAnnotations(to: uiView)
    }

    private func addAnnotations(to mapView: MKMapView) {
        for stop in stops {
            if let latitude = Double(stop.lat), let longitude = Double(stop.lon) {
                let coordinate = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
                let annotation = StopAnnotation(coordinate: coordinate, stop: stop)
                mapView.addAnnotation(annotation)
            }
        }
    }
}


// Annotation for each stop
class StopAnnotation: NSObject, MKAnnotation {
    let coordinate: CLLocationCoordinate2D
    let stop: Stop

    init(coordinate: CLLocationCoordinate2D, stop: Stop) {
        self.coordinate = coordinate
        self.stop = stop
    }

    var title: String? {
        stop.name
    }

    var subtitle: String? {
        stop.locality
    }
}
