//
//  AlertsSheetView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 26/05/2024.
//

import SwiftUI

struct AlertsSheetView: View {
    @Binding var isSelfPresented: Bool
    let alerts: [GtfsRtAlertEntity]
    
    enum Source {
        case line, stop
    }
    let source: Source
    
    var body: some View {
        NavigationStack {
            GeometryReader { geo in
                ScrollView {
                    if (alerts.count > 0) {
                        ForEach(alerts) { alert in
                            CMAlert(alertEntity: alert)
                                .padding()
                        }
                    } else {
                        ContentUnavailableView("Sem alertas", systemImage: "checkmark.diamond", description: Text("Esta \(source == .line ? "linha" : "paragem") não tem alertas.\nBoa viagem!", comment: "Texto no empty state da sheet dos alertas. %@ pode ser \"linha\" ou \"paragem\"."))
                            .frame(width: geo.size.width)
                            .frame(minHeight: geo.size.height) // TODO: manually implement for iOS < 17.0
                    }
                }
                .navigationTitle("Alertas")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            isSelfPresented.toggle()
                        } label: {
                            Text("Fechar")
                        }
                    }
                }
            }
        }
    }
}

#Preview {
    AlertsSheetView(isSelfPresented: .constant(true), alerts: [
        .init(
                id: "1234",
                alert: .init(
                    activePeriod: [
                        .init(start: 1717200000, end: 1718409600)],
                    cause: .strike,
                    descriptionText: .init(
                        translation: [.init(
                            text: "Na noite de 24 para 25 de abril, entre as 20h00 e as 02h30, as linhas 3009, 3012, 3014 e 3708 terão desvios de trânsito devido às celebrações do 25 de abril na Praça S. João Batista e na Praça da Liberdade, em Almada. No sentido Cacilhas, o percurso alternativo será feito pela Rua Mendo Gomes de Seabra, Rua Capitão Leitão, Rua da Sociedade Filarmónica Incrível Almadense e Rua Bernardo Francisco da Costa. Com partida de Cacilhas, o percurso será realizado pela Rua Fernão Lopes, Avenida Dom João I e Rua Mendo Gomes de Seabra.",
                            language: "pt"
                        )]
                    ),
                    effect: .modifiedService,
                    headerText: .init(
                        translation: [.init(
                            text: "Almada | 3009, 3012, 3014 e 3708: Condicionamento de trânsito Comemoração 25 de abril",
                            language: "pt"
                        )]
                    ),
                    informedEntity: [.init(
                        agencyId: "1",
                        routeId: "1523",
                        routeType: 2,
                        directionId: 3,
                        stopId: "2121"
                    )],
                    url: .init(
                        translation: [.init(
                            text: "blabla",
                            language: "ptpt"
                        )]
                    ), image: .init(localizedImage: [])
                )
            ),
        .init(
                id: "12345",
                alert: .init(
                    activePeriod: [
                        .init(start: 1717200000, end: 1718409600)],
                    cause: .strike,
                    descriptionText: .init(
                        translation: [.init(
                            text: "A partir do dia 1 de junho, a linha 1008 | Amadora Este (Metro) | Circular terá duas novas paragens R. do Parque (Ft. Pavilhão Desportivo) e R. Óscar Monteiro Torres 30.",
                            language: "pt"
                        )]
                    ),
                    effect: .modifiedService,
                    headerText: .init(
                        translation: [.init(
                            text: "Amadora | 1008: Nova paragem",
                            language: "pt"
                        )]
                    ),
                    informedEntity: [.init(
                        agencyId: "1",
                        routeId: "1523",
                        routeType: 2,
                        directionId: 3,
                        stopId: "2121"
                    )],
                    url: .init(
                        translation: [.init(
                            text: "blabla",
                            language: "ptpt"
                        )]
                    ), image: .init(localizedImage: [])
                )
            )
    ], source: .line)
}

