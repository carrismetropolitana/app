//
//  FavoriteStopWidgetView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/03/2024.
//

import SwiftUI

struct FavoriteStopWidgetView: View {
    @Environment(\.colorScheme) var colorScheme
    
    @EnvironmentObject var linesManager: LinesManager
    
    let stop: Stop?
    let patternIds: [String]
//    let estimates: [RealtimeETA]
    
    @State private var fullPatterns: [Pattern] = []
    
    @State private var timer: Timer?
    
//    @State private var stopEtas: [RealtimeETA] = []
    
    @State private var etasForPatterns: [String: [RealtimeETA]] = [:]
    
    @State private var shouldPresentStopDetailsView = false
    
    @State private var _______tempForUiDemoPurposes_isFavorited = true
    var body: some View {
        VStack(spacing: 0) {
            if let stop = stop {
                NavigationLink(destination: StopDetailsView(stop: stop, mapFlyToCoords: .constant(nil)), isActive: $shouldPresentStopDetailsView) { EmptyView() }
            }
            HStack {
                Button {
                    shouldPresentStopDetailsView.toggle()
                } label: {
                    VStack(alignment: .leading) {
                        if let stop = stop {
                            Text(stop.name)
                                .font(.callout)
                                .bold()
                                .multilineTextAlignment(.leading)
                                .lineLimit(1)
                        } else {
                            RoundedRectangle(cornerRadius: 25.0)
                                .fill(.gray.opacity(0.4))
                                .frame(width: 100, height: 15)
                                .blinking()
                        }
                        
                        if let stop = stop {
                            Text(stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                                .fontWeight(.semibold)
                        } else {
                            RoundedRectangle(cornerRadius: 25.0)
                                .fill(.gray.opacity(0.4))
                                .frame(width: 120, height: 15)
                                .blinking()
                        }
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .foregroundStyle(.secondary)
                }
                .tint(.listPrimary)
//                Button {
//                    _______tempForUiDemoPurposes_isFavorited.toggle()
//                } label: {
//                    Image(systemName: _______tempForUiDemoPurposes_isFavorited ? "star.fill" : "star")
//                        .font(.title2)
//                    .foregroundStyle(.yellow)
//                }
            }
            .padding(.vertical, 15.0)
            .padding(.horizontal, 15.0)
            
            Rectangle()
                .fill(.gray.opacity(0.1))
                .frame(height: 2.0)
            
            ForEach(patternIds.indices, id: \.self) { patternIdIdx in
                let patternId = patternIds[patternIdIdx]
                
                if let pattern = fullPatterns.first(where: { $0.id == patternId }), let line = linesManager.lines.first(where: { $0.id == pattern.lineId }) {
                    
                    NavigationLink(destination: LineDetailsView(line: line, overrideDisplayedPatternId: pattern.id)) {
                        HStack(alignment: .center) {
                            Pill(text: pattern.lineId, color: Color(hex: pattern.color), textColor: Color(hex: pattern.textColor))
                            Image(systemName: "arrow.right")
                                .bold()
                                .scaleEffect(0.7)
                                .frame(width: 15)
                            Text(pattern.headsign)
                                .font(.headline)
                                .bold()
                                .lineLimit(1)
                            Spacer()
                            if let etas = etasForPatterns[patternId] {
                                if etas.count > 0 {
                                    let eta = etas[0]
                                    if let estimatedArrival = eta.estimatedArrivalUnix {
                                        let minutesToArrival = getRoundedMinuteDifferenceFromNow(estimatedArrival)
                                        Text(verbatim: "\(minutesToArrival > 1 ? "\(minutesToArrival) min" : String(localized: "A chegar"))")
                                            .foregroundStyle(.green)
                                            .fontWeight(.semibold)
                                    } else {
                                        if let scheduledArrival = eta.scheduledArrival {
                                            let timeComponents = scheduledArrival.components(separatedBy: ":")
                                            let arrivalWithoutSeconds = "\(timeComponents[0]):\(timeComponents[1])"
                                            let adjustedArrival = adjustTimeFormat(time: arrivalWithoutSeconds)
                                            Text(verbatim: adjustedArrival ?? arrivalWithoutSeconds)
                                                .fontWeight(.semibold)
                                        }
                                    }
                                }
                            } else {
                                RoundedRectangle(cornerRadius: 25.0)
                                    .fill(.gray.opacity(0.6))
                                    .frame(width: 40, height: 15)
                                    .blinking()
                            }
                            
                            Image(systemName: "chevron.right")
                                .foregroundStyle(.secondary)
                        }
                        .padding(20.0)
                    }
                    .tint(.listPrimary)
                } else {
                    HStack(alignment: .center) {
                        Pill(text: "", color: .gray.opacity(0.6), textColor: .white)
                            .blinking()
                        Image(systemName: "arrow.right")
                            .bold()
                            .scaleEffect(0.7)
                            .frame(width: 15)
                        RoundedRectangle(cornerRadius: 25.0)
                            .fill(.gray.opacity(0.6))
                            .blinking()
                        Spacer()
                    }
                    .padding(20.0)
                }
                
                if patternIdIdx != patternIds.count - 1 {
                    Rectangle()
                        .fill(.gray.opacity(0.1))
                        .frame(height: 2.0)
                }
            }
            
//            Rectangle()
//                .fill(.gray.opacity(0.1))
//                .frame(height: 3.0)
//            
//            NavigationLink(destination: SmartNotificationCustomizationView()) {
//                HStack(alignment: .center) {
//                    Pill(text: "2042", color: Color(hex: "C61D23"), textColor: .white, size: 60)
//                    Image(systemName: "arrow.right")
//                        .bold()
//                        .scaleEffect(0.7)
//                        .frame(width: 15)
//                    Text("Alfornelos")
//                        .font(.title3)
//                        .bold()
//                    Spacer()
//                }
//                .padding(10.0)
//            }
            
        }
        .background(
            RoundedRectangle(cornerRadius: 15.0)
                .fill(.cmSystemBackground100)
                .shadow(color: colorScheme == .light ? .black.opacity(0.05) : .clear, radius: 5)
        )
        .onAppear {
            Task {
                print("stop widget appeared")
                try await loadPatterns()
                try await loadEtas()
                startFetchingTimer()
            }
        }
        .onChange(of: patternIds) {
            Task {
                try await loadPatterns()
                try await loadEtas()
            }
        }
        .onChange(of: stop) {
            Task {
                try await loadPatterns()
                try await loadEtas()
            }
        }
        .onDisappear {
            stopFetchingTimer()
        }
    }
    
    func loadPatterns() async throws {
        var patterns: [Pattern] = []
        for patternId in patternIds {
            let pattern = try await CMAPI.shared.getPattern(patternId)
            patterns.append(pattern)
        }
        
        fullPatterns = patterns
    }
    
    func loadEtas() async throws {
        if let stop = stop {
            let t1 = Date().timeIntervalSince1970
            let stopEtas = try await CMAPI.shared.getETAs(stop.id)
            let t2 = Date().timeIntervalSince1970
            print("letas got \(stopEtas) in time \(t2-t1)s")
            for patternId in patternIds {
                let etas = stopEtas.filter {
                    $0.patternId == patternId
                }
                etasForPatterns[patternId] = filterAndSortCurrentAndFutureStopETAs(etas)
            }
            print("stop etas count: " + String(stopEtas.count))
        }
    }
    
    private func startFetchingTimer() {
        // Create a timer to trigger fetching every 5 seconds
        print("start feti on stop fav widget")
        timer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { timer in
            print("[FavoriteStopWidgetView stopId:\(stop?.id ?? "UNKNOWN")] — Timer-triggered arrivals fetch")
            Task {
                try await loadEtas()
                print(etasForPatterns.count)
            }
        }
    }
    
    private func stopFetchingTimer() {
        // Invalidate the timer to stop fetching
        timer?.invalidate()
        timer = nil
    }

}

//#Preview {
//    FavoriteStopWidgetView()
//        .shadow(color: .gray.opacity(0.3), radius: 20)
//        .padding()
//}
