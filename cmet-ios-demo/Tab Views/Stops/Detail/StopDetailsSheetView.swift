//
//  StopDetailsSheetView.swift
//  cmet-ios-demo
//
//  Created by João Pereira on 25/03/2024.
//

import SwiftUI

struct StopDetailsSheetView: View {
    @EnvironmentObject var linesManager: LinesManager
    
    @Binding var shouldPresentStopDetailsView: Bool
    @State private var timer: Timer?
    
    let onEtaClick: (_ eta: RealtimeETA) -> Void
    
    let stop: Stop
    @State private var nextEtas: [RealtimeETA] = []
    var body: some View {
        VStack {
            Button {
                shouldPresentStopDetailsView = true
            } label: {
                HStack {
                    VStack(alignment: .leading) {
                        Text(stop.name)
                            .bold()
                        //                                Text(pattern.municipalities.joined(separator: ", "))
                        //                                    .foregroundStyle(.secondary)
                        HStack(spacing: 20.0) {
                            Text(stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)")
                                .foregroundStyle(.secondary)
                            
                            Text(stop.id)
                                .font(.custom("Menlo", size: 12.0).monospacedDigit())
                                .bold()
                                .foregroundStyle(.gray)
                                .padding(.horizontal, 10)
                                .background(Capsule().stroke(.gray, lineWidth: 2.0))
                        }
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .foregroundStyle(.tertiary)
                }
                .padding(.top)
                .padding(.horizontal)
            }
//            .buttonStyle(.plain)
            .tint(.listPrimary)
            
            
            Divider()
            
            HStack {
                Text("Próximos veículos nesta paragem".uppercased())
                    .font(.caption)
                    .foregroundStyle(.tertiary)
                    .fontWeight(.heavy)
                Spacer()
            }
            .padding(.leading)
            .padding(.top, 10.0)
            
            VStack(spacing: 0) {
                ForEach(nextEtas.prefix(3).indices, id: \.self) { etaIdx in
                    let isLast = etaIdx == 2
                    
                    let eta = nextEtas[etaIdx]
                    
                    let fullLine = linesManager.lines.first(where: {
                        $0.id == eta.lineId
                    })
                    
                    Button {
                        print("ETA tripid \(eta.tripId)")
                        onEtaClick(eta) // TODO: this should be realtime or maybe not, decide
                    } label: {
                        HStack {
                            Pill(text: eta.lineId, color: Color(hex: fullLine!.color), textColor: Color(hex: fullLine!.textColor), size: 60) // TODO: match line colors to these
                            Text(eta.headsign)
                                .bold()
                                .lineLimit(1)
                            Spacer()
                            if let estimatedArrival = eta.estimatedArrivalUnix {
                                PulseLabel(accent: .green, label: Text("\(getRoundedMinuteDifferenceFromNow(eta.estimatedArrivalUnix!)) min"))
                            } else if let scheduledArrival = eta.scheduledArrival {
                                let timeComponents = scheduledArrival.components(separatedBy: ":")
                                Text("\(timeComponents[0]):\(timeComponents[1])")
                            }
                            Image(systemName: "chevron.right")
                                .foregroundStyle(.tertiary)
                        }
                        .padding()
                    }
//                    .buttonStyle(.plain)
                    .tint(.listPrimary)
                    
                    
                    if !isLast || nextEtas.count > 3 {
                        Divider()
                    }
                    
                    
                }
//                if nextEtas.count > 3 {
                if true {
                    HStack {
                        Text("Ver mais serviços nesta paragem")
                            .foregroundStyle(.secondary)
                        Spacer()
                        Image(systemName: "chevron.down")
                            .foregroundStyle(.tertiary)
                    }
                    .padding()
                }
            }
            .background(RoundedRectangle(cornerRadius: 15.0).fill(.windowBackground))
            .padding()
            
            Spacer()
        }
        .onAppear {
            // fetch estimates
            fetchEtas()
            
            startFetchingTimer()
        }
        .onDisappear {
            stopFetchingTimer()
        }
    }
    
    private func fetchEtas() {
        Task {
            var etas: [RealtimeETA]
            etas = try await CMAPI.shared.getETAs(stop.id)
            
            print("Got \(etas.count) ETAS for stop \(stop.id)")
            
            nextEtas = filterAndSortCurrentAndFutureStopETAs(etas)
        }
    }
    
    private func startFetchingTimer() {
        // Create a timer to trigger fetching every 5 seconds
        timer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { timer in
            fetchEtas()
        }
    }
    
    private func stopFetchingTimer() {
        // Invalidate the timer to stop fetching
        timer?.invalidate()
        timer = nil
    }
}

//#Preview {
//    StopDetailsSheetView()
//}


func filterAndSortCurrentAndFutureStopETAs(_ etas: [RealtimeETA]) -> [RealtimeETA] {
    let currentAndFutureFiltering = etas.filter({
        let tripHasObservedArrival = $0.observedArrivalUnix != nil
        let tripScheduledArrivalIsInThePast = $0.scheduledArrivalUnix ?? 0 <= Int(Date().timeIntervalSince1970)
        let tripHasEstimatedArrival = $0.estimatedArrivalUnix != nil
        let tripEstimatedArrivalIsInThePast = $0.estimatedArrivalUnix ?? 0 <= Int(Date().timeIntervalSince1970)
        
        return !tripScheduledArrivalIsInThePast && !tripHasObservedArrival
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
    }
    
    return sorted
}
