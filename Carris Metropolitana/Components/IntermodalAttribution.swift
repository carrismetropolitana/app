//
//  IntermodalAttribution.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 04/10/2024.
//

import SwiftUI

struct IntermodalAttribution: View {
    @Environment(\.openURL) private var openURL
    
    let expanded: Bool
    
    @State private var externalLinkAlertPresented = false
    
    var body: some View {
        HStack {
            if expanded {
                HStack {
                    Text("Powered by".uppercased())
                        .font(.caption)
                        .fontWeight(.heavy)
                        .foregroundStyle(.secondary)
                    Image(.intermodalLogo)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 12.0)
                }
                .transition(.move(edge: .trailing).combined(with: .opacity))
                .onTapGesture {
                    externalLinkAlertPresented = true
                }
            } else {
                Image(.intermodalMinimalLogo)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 15.0)
                    .transition(.move(edge: .trailing).combined(with: .opacity))
            }
        }
        .handleOpenURLInApp()
        .alert("A visitar página externa", isPresented: $externalLinkAlertPresented, presenting: Text("hello")) { _ in
            Button("OK") {
                openURL(URL(string: "https://intermodal.pt/sobre")!)
            }
            Button("Cancelar", role: .cancel) {}
        } message: { _ in
            Text("Ao continuar, será redirecionado para a página web do Intermodal (intermodal.pt)")
        }
    }
}

#Preview {
    IntermodalAttribution(expanded: false)
}
