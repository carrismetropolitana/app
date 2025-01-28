//
//  DownloadOfflineDataPromptView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 02/09/2024.
//

import SwiftUI

struct DownloadOfflineDataPromptView: View {
    let onDownloadStartRequest: () -> Void
    
    var body: some View {
        VStack(spacing: 30.0) {
            Image(systemName: "square.and.arrow.down")
                .font(.title)
                .padding()
                .background(Circle().fill(.quaternary))
                .padding()
                .background(Circle().fill(.quinary))
            
            VStack(spacing: 10.0) {
                Text("Descarregar dados")
                    .bold()
                    .font(.title)
                Text("Se descarregar os dados agora, poderá utilizar a aplicação mesmo sem acesso à internet.")
            }
            
            VStack {
                Text("Tamanho estimado: \("23.5 MB")")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Text("Espaço disponível no dispositivo: \("153.5 MB")")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            
            VStack(spacing: 10.0) {
                Button("Descarregar") {
                    onDownloadStartRequest()
                }
                .buttonStyle(.borderedProminent)
                
                Button("Voltar a perguntar mais tarde") {
                    
                }
                .tint(.gray)
                .font(.subheadline)
            }
        }
    }
}

struct DownloadOfflineDataDownloadingView: View {
    // Download
    // Lines, Stops, Routes, Patterns (and matching shapes)
    
    var body: some View {
        VStack(spacing: 30.0) {
            VStack(spacing: 10.0) {
                Text("A descarregar")
                    .bold()
                    .font(.title)
                Text("Por favor não saia deste ecrã")
            }
            
            VStack {
                Text(verbatim: "Lines")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            
            Button("Cancelar") {
                
            }
            .buttonStyle(.borderedProminent)
            .tint(.red)
        }
    }
}

struct DownloadOfflineDataModalView: View {
    @State private var isDownloading = false
    var body: some View {
        VStack {
            if (isDownloading) {
                DownloadOfflineDataDownloadingView()
            } else {
                DownloadOfflineDataPromptView(onDownloadStartRequest: {
                    withAnimation {
                        isDownloading = true
                    }
                })
            }
        }
        .multilineTextAlignment(.center)
        .padding(.vertical, 10.0)
        .padding(.horizontal, 30.0)
        .background(RoundedRectangle(cornerRadius: 15.0).fill(.white))
        .padding(.horizontal, 20.0)
    }
}

#Preview {
    HStack {
        Spacer()
        VStack {
            Spacer()
            
            DownloadOfflineDataModalView()
            
            Spacer()
        }
        Spacer()
    }
    .background(.tertiary)
}
