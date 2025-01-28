//
//  ETAPlayground.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 08/07/2024.
//

import SwiftUI

struct ETAPlayground: View {
    @State private var stopIdsWithEtas: [String: [PatternRealtimeETA]] = [:]
    

    var body: some View {
        List {
            ForEach(Array(stopIdsWithEtas.keys), id: \.self) { stopId in
                if let etas = stopIdsWithEtas[stopId] {
                    Section(header: Text("Stop \(stopId)")) {
                        ForEach(etas, id: \.tripId) { eta in
                            VStack(alignment: .leading) {
                                Text("STOP " + eta.stopId)
                                    .font(.title2)
                                    .bold()
                                Text("Scheduled: " + (eta.scheduledArrival ?? "UNAVAILABLE"))
                                    .font(.title3)
                                Text("Estimated: " + (eta.estimatedArrival ?? "UNAVAILABLE"))
                                    .font(.title3)
                                Text("Observed: " + (eta.observedArrival ?? "UNAVAILABLE"))
                                    .font(.title3)
                            }
                        }
                    }
                }
            }
        }
        .onAppear {
            Task {
                do {
                    let etas = try await CMAPI.shared.getETAs(patternId: "3710_0_1")
                    stopIdsWithEtas = arrangeByStopIds(etas)
                    for stopId in stopIdsWithEtas.keys {
                        print("Filtering for stopId \(stopId)")
                        let currentAndFutureEtas = filterAndSortCurrentAndFuturePatternETAs(stopIdsWithEtas[stopId]!)
                        stopIdsWithEtas[stopId] = currentAndFutureEtas
                    }
                } catch {
                    print("Failed to fetch ETAs: \(error)")
                }
            }
        }
    }
}

func __dev_filterAndSortCurrentAndFuturePatternETAs(_ etas: [PatternRealtimeETA]) -> [PatternRealtimeETA] {
    let currentAndFutureFiltering = etas.filter({
        print("Filtering eta with tripId \($0.tripId)")
        let tripHasObservedArrival = $0.observedArrivalUnix != nil
        print("tripHasObservedArrival: \(tripHasObservedArrival), observedArrival: \($0.observedArrival ?? "N/A")")
        let tripScheduledArrivalIsInThePast = $0.scheduledArrivalUnix ?? 0 <= Int(Date().timeIntervalSince1970)
        print("tripScheduledArrivalIsInThePast: \(tripScheduledArrivalIsInThePast), scheduledArrival: \($0.scheduledArrival ?? "N/A")")
        let tripHasEstimatedArrival = $0.estimatedArrivalUnix != nil
        print("tripHasEstimatedArrival: \(tripHasEstimatedArrival), estimatedArrival: \($0.estimatedArrival ?? "N/A")")
        let tripEstimatedArrivalIsInThePast = $0.estimatedArrivalUnix ?? 0 <= Int(Date().timeIntervalSince1970)
        print("tripEstimatedArrivalIsInThePast: \(tripEstimatedArrivalIsInThePast), estimatedArrival: \($0.estimatedArrival ?? "N/A")")
        print("\n\n")
        
        return !tripScheduledArrivalIsInThePast && !tripHasObservedArrival
//        || !tripHasObservedArrival || (tripHasEstimatedArrival && !tripEstimatedArrivalIsInThePast)
    })
    
    print("Filtered \(currentAndFutureFiltering.count) ETAs as currentAndFuture.")
    
    let sorted = currentAndFutureFiltering.sorted { (a, b) -> Bool in
        if let estimatedArrivalA = a.estimatedArrivalUnix, let estimatedArrivalB = b.estimatedArrivalUnix {
            // Both have estimated_arrival, compare them
            return estimatedArrivalA < estimatedArrivalB
        } else if a.estimatedArrivalUnix != nil {
            // Only `a` has estimated_arrival, so it comes before `b`
            return true
        } else if b.estimatedArrivalUnix != nil {
            // Only `b` has estimated_arrival, so it comes before `a`
            return false
        } else {
            // Both have only scheduled_arrival, compare them
            return a.scheduledArrivalUnix! < b.scheduledArrivalUnix!
        }
//        $0.scheduledArrivalUnix! < $1.scheduledArrivalUnix!
    }
    
    return sorted
}


func __dev_arrangeByStopIds(_ patternEtas: [PatternRealtimeETA]) -> [String: [PatternRealtimeETA]] {
    var arrangedDict = [String: [PatternRealtimeETA]]()
    
    for eta in patternEtas {
        if arrangedDict[eta.stopId] != nil {
            arrangedDict[eta.stopId]?.append(eta)
        } else {
            arrangedDict[eta.stopId] = [eta]
        }
    }
    
    return arrangedDict
}

#Preview {
    ETAPlayground()
}
