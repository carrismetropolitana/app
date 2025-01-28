//
//  ArrivalsHelpers.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 26/08/2024.
//

import Foundation

func filterAndSortCurrentAndFutureStopETAs(_ etas: [RealtimeETA]) -> [RealtimeETA] {
    var fixedEtas: [RealtimeETA] = []
    
    let currentAndFutureFiltering = etas.filter({
        let tripHasObservedArrival = $0.observedArrivalUnix != nil
        let tripScheduledArrivalIsInThePast = $0.scheduledArrivalUnix ?? 0 <= Int(Date().timeIntervalSince1970)
        let tripHasScheduledArrival = $0.scheduledArrivalUnix != nil
        let tripHasEstimatedArrival = $0.estimatedArrivalUnix != nil
        let tripEstimatedArrivalIsInThePast = $0.estimatedArrivalUnix ?? 0 <= Int(Date().timeIntervalSince1970)
        let tripEstimatedArrivalIsInTheFuture = $0.estimatedArrivalUnix ?? 0 >= Int(Date().timeIntervalSince1970)
        
        let estimatedArrivalAfterMidnight = tripHasEstimatedArrival && Int($0.estimatedArrival!.prefix(2))! > 23
        let scheduledArrivalAfterMidnight = tripHasScheduledArrival && Int($0.scheduledArrival!.prefix(2))! > 23
        
        
        if tripScheduledArrivalIsInThePast && !tripEstimatedArrivalIsInTheFuture{
            return false
        }
        
        if tripHasEstimatedArrival && tripEstimatedArrivalIsInThePast {
            return false
        }
        
        if tripHasObservedArrival {
            return false
        }
        
        // Fix for past midnight estimatedArrivals represented as being in the day before
        if tripHasEstimatedArrival && !estimatedArrivalAfterMidnight && scheduledArrivalAfterMidnight {
            let fixedEta = RealtimeETA(
                lineId: $0.lineId,
                patternId: $0.patternId,
                routeId: $0.routeId,
                tripId: $0.tripId,
                headsign: $0.headsign,
                stopSequence: $0.stopSequence,
                scheduledArrival: $0.scheduledArrival,
                scheduledArrivalUnix: $0.scheduledArrivalUnix,
                estimatedArrival: $0.estimatedArrival, // not fixed currently, but atm not being used for anything
                estimatedArrivalUnix: $0.estimatedArrivalUnix! + 86400,
                observedArrival: $0.observedArrival,
                observedArrivalUnix: $0.observedArrivalUnix,
                vehicleId: $0.vehicleId
            )
            fixedEtas.append(fixedEta)
            return false
        }
        
        return true
    })
    
    print("Filtered \(currentAndFutureFiltering.count) ETAs as currentAndFuture.")
    
    let etasToSort = currentAndFutureFiltering + fixedEtas
    
    let sorted = etasToSort.sorted { (a, b) -> Bool in
        if let estimatedArrivalA = a.estimatedArrivalUnix, let estimatedArrivalB = b.estimatedArrivalUnix {
            // Both have estimated_arrival, compare them
            return estimatedArrivalA < estimatedArrivalB
        } else if a.estimatedArrivalUnix != nil && b.scheduledArrivalUnix != nil{
            // Only `a` has estimated_arrival, so it comes before `b`
            return a.estimatedArrivalUnix! < b.scheduledArrivalUnix!
        } else if b.estimatedArrivalUnix != nil && a.scheduledArrivalUnix != nil{
            // Only `b` has estimated_arrival, so it comes before `a`
            return a.scheduledArrivalUnix! < b.scheduledArrivalUnix!
        } else {
            // Both have only scheduled_arrival, compare them
            return a.scheduledArrivalUnix! < b.scheduledArrivalUnix!
        }
    }
    
    return sorted
}

func filterAndSortCurrentAndFuturePatternETAs(_ etas: [PatternRealtimeETA]) -> [PatternRealtimeETA] {
    var fixedEtas: [PatternRealtimeETA] = []
    
    let currentAndFutureFiltering = etas.filter({
        let tripHasObservedArrival = $0.observedArrivalUnix != nil
        let tripScheduledArrivalIsInThePast = $0.scheduledArrivalUnix ?? 0 <= Int(Date().timeIntervalSince1970)
        let tripHasScheduledArrival = $0.scheduledArrivalUnix != nil
        let tripHasEstimatedArrival = $0.estimatedArrivalUnix != nil
        let tripEstimatedArrivalIsInThePast = $0.estimatedArrivalUnix ?? 0 <= Int(Date().timeIntervalSince1970)
        
        let estimatedArrivalAfterMidnight = tripHasEstimatedArrival && Int($0.estimatedArrival!.prefix(2))! > 23
        let scheduledArrivalAfterMidnight = tripHasScheduledArrival && Int($0.scheduledArrival!.prefix(2))! > 23
        
        
        if tripScheduledArrivalIsInThePast {
            return false
        }
        
        if tripHasEstimatedArrival && tripEstimatedArrivalIsInThePast {
            return false
        }
        
        if tripHasObservedArrival {
            return false
        }
        
        // Fix for past midnight estimatedArrivals represented as being in the day before
        if tripHasEstimatedArrival && !estimatedArrivalAfterMidnight && scheduledArrivalAfterMidnight {
            let fixedEta = PatternRealtimeETA(
                stopId: $0.stopId,
                lineId: $0.lineId,
                patternId: $0.patternId,
                routeId: $0.routeId,
                tripId: $0.tripId,
                headsign: $0.headsign,
                stopSequence: $0.stopSequence,
                scheduledArrival: $0.scheduledArrival,
                scheduledArrivalUnix: $0.scheduledArrivalUnix,
                estimatedArrival: $0.estimatedArrival, // not fixed currently, but atm not being used for anything
                estimatedArrivalUnix: $0.estimatedArrivalUnix! + 86400,
                observedArrival: $0.observedArrival,
                observedArrivalUnix: $0.observedArrivalUnix,
                vehicleId: $0.vehicleId
            )
            fixedEtas.append(fixedEta)
            return false
        }
        
        return true
    })
    
    print("Filtered \(currentAndFutureFiltering.count) ETAs as currentAndFuture.")
    
    let etasToSort = currentAndFutureFiltering + fixedEtas
    
    let sorted = etasToSort.sorted { (a, b) -> Bool in
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
    }
    
    return sorted
}

func arrangeByStopIds(_ patternEtas: [PatternRealtimeETA]) -> [String: [PatternRealtimeETA]] {
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


func getRoundedMinuteDifferenceFromNow(_ refTimestamp: Int) -> Int {
    let now = Int(Date().timeIntervalSince1970)
    print("Rounded minute: NOW -> \(now); refTS -> \(refTimestamp)")
    let differenceInSeconds = now - refTimestamp
    let differenceInMinutes = Double(differenceInSeconds) / 60.0
    print("Minute difference is: \(differenceInMinutes)")
    return Int(differenceInMinutes.magnitude.rounded(.towardZero))
}
