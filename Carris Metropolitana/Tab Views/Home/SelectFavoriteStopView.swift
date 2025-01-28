//
//  FavoriteStopCustomizationView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 30/06/2024.
//

import SwiftUI

struct SelectFavoriteStopView: View {
    @Environment(\.presentationMode) var presentationMode
    
    @EnvironmentObject var stopsManager: StopsManager
    @EnvironmentObject var locationManager: LocationManager
    @EnvironmentObject var favoritesManager: FavoritesManager
    
    @State private var suggestedStops: [Stop] = []
    @State private var nearbyStops: [Stop] = []
    
    @Binding var selectedStopId: String?
    
    // Location debounce
    @State private var debounceLocationItem: DispatchWorkItem?
    // Search term debounce
    @State private var debounceSearchItem: DispatchWorkItem?
    
    
    @State private var searchTerm = ""
    
    var body: some View {
        VStack {
            StopsMapView(stops: stopsManager.stops, onStopSelect: { stopId in
                selectedStopId = stopId
                presentationMode.wrappedValue.dismiss()
            }, flyToCoords: .constant(nil), shouldFlyToUserCoords: .constant(false), mapVisible: .constant(true), showPopupOnStopSelect: true)
                .frame(height: 300)
            
            List {
                ForEach(suggestedStops) { stop in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(stop.name)
                            
                            Text(stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)")
                                .foregroundStyle(.secondary)
                        }
                        
                        Spacer()
                        
                        Button {
                            selectedStopId = stop.id
                            presentationMode.wrappedValue.dismiss()
                        } label: {
                            Image(systemName: "plus.circle.fill")
                                .foregroundStyle(.green)
                                .scaleEffect(1.3)
                        }
                    }
                }
            }
            .listStyle(.inset)
            .searchable(text: $searchTerm, prompt: "Nome ou número da paragem")
        }
        .navigationTitle("Selecionar paragem")
        .onAppear {
            if let location = locationManager.location {
                nearbyStops = closestStops(to: location.coordinate, stops: stopsManager.stops, maxResults: 10) // this is being done multiple times in the app, meybe consider globalizing it??
                suggestedStops = nearbyStops
            } else {
                suggestedStops = Array(stopsManager.stops.prefix(10))
            }
        }
        .onChange(of: locationManager.location) {
            // Cancel the previous debounce operation if it's still pending
            debounceLocationItem?.cancel()

            // Create a new DispatchWorkItem for debouncing
            debounceLocationItem = DispatchWorkItem {
                if stopsManager.stops.count > 0 {
                    if let location = locationManager.location {
                        nearbyStops = closestStops(to: location.coordinate, stops: stopsManager.stops, maxResults: 10)
                    } else {
                        nearbyStops = []
                    }
                }
            }

            // Execute the debounce work item after 1000ms delay
            DispatchQueue.main.asyncAfter(deadline: .now() + 1, execute: debounceLocationItem!)
        }
        .onChange(of: searchTerm) {
            // Cancel the previous debounce operation if it's still pending
            debounceSearchItem?.cancel()

            // Create a new DispatchWorkItem for debouncing
            debounceSearchItem = DispatchWorkItem {
                let normalizedSearchTerm = searchTerm.normalizedForSearch()
                let filtered = stopsManager.stops.filter {
                    $0.id.contains(normalizedSearchTerm) || ($0.nameNormalized != nil && $0.nameNormalized!.contains(normalizedSearchTerm)) || ($0.ttsNameNormalized != nil && $0.ttsNameNormalized!.contains(normalizedSearchTerm))
                }
                
                if filtered.count > 0 {
                    suggestedStops = filtered
                } else {
                    if nearbyStops.count > 0 {
                        suggestedStops = nearbyStops
                    } else {
                        suggestedStops = Array(stopsManager.stops.prefix(10))
                    }
                }
            }
            // Execute the debounce work item after 100ms delay
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1, execute: debounceSearchItem!)
        }
    }
}
//
//#Preview {
//    SelectFavoriteStopView(selectedStopId: .constant("123"))
//}
