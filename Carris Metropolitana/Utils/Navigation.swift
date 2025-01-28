//
//  Navigation.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 10/07/2024.
//

import Foundation
import UIKit
import CoreLocation
import MapKit

enum SupportedMapApps: String {
    case appleMaps = "Apple Maps"
    case googleMaps = "Google Maps"
    case waze = "Waze"
}

func getAvailableMapApps() -> [SupportedMapApps] {
    var availableMapApps = [SupportedMapApps]()
    
    // Check for Apple Maps (system will prompt to install if not on device)
    availableMapApps.append(.appleMaps)
    
    // Check for Google Maps
    if let googleMapsURL = URL(string: "comgooglemaps://"), UIApplication.shared.canOpenURL(googleMapsURL) {
        availableMapApps.append(.googleMaps)
    }
    
    // Check for Waze
    if let wazeURL = URL(string: "waze://"), UIApplication.shared.canOpenURL(wazeURL) {
        availableMapApps.append(.waze)
    }
    
    return availableMapApps
}

func navigateTo(destination: CLLocationCoordinate2D, preferredApp: SupportedMapApps) {
    switch preferredApp {
    case .appleMaps:
        let placemark = MKPlacemark(coordinate: destination)
        let mapItem = MKMapItem(placemark: placemark)
        
        mapItem.openInMaps()
    case .googleMaps:
        UIApplication.shared.open(URL(string: "comgooglemaps://?daddr=\(destination.latitude),\(destination.longitude)")!)
        break
    case .waze:
        UIApplication.shared.open(URL(string: "waze://ul?ll=\(destination.latitude),\(destination.longitude)&navigate=yes&zoom=18")!)
        break
    }
}
