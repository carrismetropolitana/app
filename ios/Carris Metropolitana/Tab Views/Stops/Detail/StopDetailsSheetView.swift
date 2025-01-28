//
//  StopDetailsSheetView.swift
//  Carris Metropolitana
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
    
    
    @Binding var seeAllNextEtas: Bool
    
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
                            .multilineTextAlignment(.leading)
                            .accessibilityValue(Text(stop.ttsName ?? stop.name))
                            .accessibilityAddTraits(.isHeader)
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
                ForEach(seeAllNextEtas ? nextEtas.indices : nextEtas.prefix(3).indices, id: \.self) { etaIdx in
                    let isLast = etaIdx == 2
                    
                    let eta = nextEtas[etaIdx]
                    
                    
                    let fullLine = linesManager.lines.first(where: {
                        $0.id == eta.lineId
                    })
                    
                    Button {
                        print("ETA tripid \(eta.tripId)")
                        onEtaClick(eta) // TODO: this should be realtime or maybe not, decide
                    } label: {
                        VStack {
                            HStack {
                                Pill(text: eta.lineId, color: Color(hex: fullLine!.color), textColor: Color(hex: fullLine!.textColor))
                                Text(eta.headsign)
                                    .font(Font.system(size: 15, weight: .regular, design: .default))
                                    .multilineTextAlignment(.leading)
                                    .lineLimit(2)
                                Spacer()
                                if let estimatedArrival = eta.estimatedArrivalUnix {
                                    let minutesToArrival = getRoundedMinuteDifferenceFromNow(estimatedArrival)
                                    PulseLabelMin(accent: .green, minutes: Text(verbatim: "\(minutesToArrival)"))
                                        .accessibilityElement(children: .ignore)
                                        .accessibilityLabel(Text("Tempo real estimado."))
                                        .accessibilityValue(Text("Chega dentro de \(minutesToArrival) minutos."))
                                        .accessibilityHint(Text("Duplo toque para ver detalhes do autocarro em tempo real, como o modelo do veículo, matrícula e características de acessibilidade, quando disponíveis."))

                                } else if let scheduledArrival = eta.scheduledArrival {
                                    let timeComponents = scheduledArrival.components(separatedBy: ":")
                                    let arrivalWithoutSeconds = "\(timeComponents[0]):\(timeComponents[1])"
                                    let adjustedArrival = adjustTimeFormat(time: arrivalWithoutSeconds)
                                    let adjustedArrivalComponents = adjustedArrival?.components(separatedBy: ":")
                                    Image(systemName: "clock").font(.system(size: 12, weight: .regular, design: .default))
                                        .bold()
                                        .padding(.trailing, -4)
                                    Text(verbatim: adjustedArrival ?? arrivalWithoutSeconds)
                                        .monospacedDigit()
                                        .bold()
                                        .accessibilityLabel(Text("Horário programado"))
                                        .accessibilityValue(Text("Pelas \(adjustedArrivalComponents?[0] ?? timeComponents[0]) horas e \(timeComponents[1]) minutos"))
                                }
                                Image(systemName: "chevron.right")
                                    .foregroundStyle(.tertiary)
                            }
//                            #if DEBUG
//                                Text(eta.tripId)
//                            #endif
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
//                if !seeAllNextEtas {
                if false {
                    Button {
                        seeAllNextEtas = true
                    } label: {
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
