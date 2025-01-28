//
//  StopSearchResultsView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/09/2024.
//

import SwiftUI

struct StopSearchResultsView: View {
    let stops: [Stop]
    let onStopSelected: (Stop) -> Void

    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(stops) { stop in
                    Button {
                        onStopSelected(stop)
                    } label: {
                        StopSearchResultEntry(stop: stop)
                            .padding(.horizontal)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(
                        Text("Paragem número \(stop.id.map { String($0) }.joined(separator: " ")), \(stop.ttsName ?? stop.name)", comment: "Paragem resultado de pesquisa")
                    )
                }
            }
        }
        .contentMargins(.top, 70, for: .scrollContent)
    }
}

//#Preview {
//    StopSearchResultsView()
//}
