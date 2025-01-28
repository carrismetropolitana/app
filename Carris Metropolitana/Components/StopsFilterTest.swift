//
//  StopsFilterTest.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 19/08/2024.
//

import SwiftUI

struct StopsFilterTest: View {
    @EnvironmentObject var stopsManager: StopsManager
    @State private var searchTerm: String = ""
    @State private var searchFilteredStops: [Stop] = []
    var body: some View {
        VStack {
            TextField("STOP", text: $searchTerm)
            ScrollView {
                LazyVStack {
                    ForEach(searchFilteredStops) { stop in 
                        StopSearchResultEntry(stop: stop)
                    }
                }
            }
        }
        .onChange(of: stopsManager.stops) {
            searchFilteredStops = Array(stopsManager.stops.prefix(20))
        }
        .onChange(of: searchTerm) {
            let stops = stopsManager.stops
            let normalizedSearchTerm = searchTerm.lowercased()
            let filtered = stops.filter({
                $0.name.lowercased().contains(normalizedSearchTerm)
                || $0.id.lowercased().contains(normalizedSearchTerm)
                || ($0.ttsName != nil && $0.ttsName!.lowercased().contains(normalizedSearchTerm))
            })
            
            print("Got \(filtered.count) filtered stops from \(stops.count) stops")
            
            searchFilteredStops = filtered
        }
    }
}

#Preview {
    StopsFilterTest()
}
