//
//  AnotherMapView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 17/03/2024.
//

import SwiftUI
import SwiftUI
import MapKit

class AnotherStopAnnotation: MKPointAnnotation {
    let stop: Stop
    
    init(stop: Stop) {
        self.stop = stop
        super.init()
        self.coordinate = CLLocationCoordinate2D(latitude: Double(stop.lat)!, longitude: Double(stop.lon)!)
        self.title = stop.name
    }
}


struct AnotherMapView: UIViewRepresentable {
    var stops: [Stop]
    
    func makeUIView(context: Context) -> MKMapView {
        let mapView = MKMapView()
        mapView.delegate = context.coordinator
        return mapView
    }
    
    func updateUIView(_ view: MKMapView, context: Context) {
        updateAnnotations(from: view)
    }
    
    private func updateAnnotations(from mapView: MKMapView) {
        mapView.removeAnnotations(mapView.annotations)
        let annotations = self.stops.map(AnotherStopAnnotation.init)
        mapView.addAnnotations(annotations)
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, MKMapViewDelegate {
        var parent: AnotherMapView
        
        init(_ parent: AnotherMapView) {
            self.parent = parent
        }
        
        func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
            if let cluster = annotation as? MKClusterAnnotation {
                let identifier = "cluster"
                var view: MKAnnotationView
                if let dequeuedView = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) {
                    dequeuedView.annotation = annotation
                    view = dequeuedView
                } else {
                    view = MKAnnotationView(annotation: annotation, reuseIdentifier: identifier)
                }
                view.displayPriority = .defaultHigh
                
                let renderer = UIGraphicsImageRenderer(size: CGSize(width: 40, height: 40))
                let count = cluster.memberAnnotations.count
                let image = renderer.image { _ in
                    // Fill full circle with black color
                    UIColor.black.setFill()
                    UIBezierPath(ovalIn: CGRect(x: 0, y: 0, width: 40, height: 40)).fill()
                    
                    // Fill inner circle with yellow color
                    UIColor.yellow.setFill()
                    UIBezierPath(ovalIn: CGRect(x: 3, y: 3, width: 34, height: 34)).fill()
                    
                    // Finally draw count text vertically and horizontally centered
                    let attributes = [ NSAttributedString.Key.foregroundColor: UIColor.black,
                                       NSAttributedString.Key.font: UIFont.boldSystemFont(ofSize: 20)]
                    let text = "\(count)"
                    let size = text.size(withAttributes: attributes)
                    let rect = CGRect(x: 20 - size.width / 2, y: 20 - size.height / 2, width: size.width, height: size.height)
                    text.draw(in: rect, withAttributes: attributes)
                }
                view.image = image
                
                return view
            } else {
                let identifier = "stop"
                var view: MKAnnotationView
                if let dequeuedView = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) {
                    dequeuedView.annotation = annotation
                    view = dequeuedView
                } else {
                    view = MKAnnotationView(annotation: annotation, reuseIdentifier: identifier)
                }
                view.image = UIImage(named: "CMFacilityBoat") // Replace with your stop image
                
                return view
            }
        }
    }


}
