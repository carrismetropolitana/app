//
//  CirculatingVehiclesIndicator.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 25/09/2024.
//

import SwiftUI

struct CirculatingVehiclesIndicator: View {
    let vehiclesCount: Int
    
    var body: some View {
        HStack {
            if vehiclesCount == 0 {
                Image(systemName: "slash.circle.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .foregroundStyle(.gray.opacity(0.3))
                    .frame(height: 20.0)
            } else {
                Pulse(size: 20.0, accent: .green)
            }
            
            Text("\(vehiclesCount == 0 ? String(localized: "Sem", comment: "Texto no indicador de veículos overlayed no mapa e primeiro argumento da string completa. Apenas aparece como prefixo da string completa se o número de veículos em circulação for 0.") : "")\(vehiclesCount > 0 ? String(vehiclesCount) : "") veículo\(vehiclesCount == 1 ? "" : "s") em circulação", comment: "Texto no indicador de veículos overlayed no mapa. A terceira variável é \"s\" ou \"\", dependendo do número de veículos em circulação.")
                .foregroundStyle(vehiclesCount == 0 ? .gray : .green)
                .bold()
                .font(.footnote)
                .padding(.horizontal, 5.0)
        }
        .padding(5.0)
        .background {
            Capsule()
                .fill(.white.shadow(.drop(color: .black.opacity(0.2), radius: 10)))
        }
    }
}

#Preview {
    CirculatingVehiclesIndicator(vehiclesCount: 3)
}
