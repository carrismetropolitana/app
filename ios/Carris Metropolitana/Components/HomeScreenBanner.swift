//
//  HomeScreenBanner.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 08/07/2024.
//

import SwiftUI

enum BannerType {
    case warning, info, tip
}

struct HomeScreenBanner: View {
    var type: BannerType? = nil
    var systemIcon: String? = nil
    var color: Color? = nil
    let title: String
    let content: String
    
    
    
    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Image(systemName: systemIcon ?? getBannerIconForType(for: type))
            
            VStack(alignment: .leading) {
                VStack(alignment: .leading) {
                    Text(title)
                        .font(.headline)
                    Text(content)
                        .font(.subheadline)
                }
                .padding(.trailing)
                
                Divider()
                
                Button {
                    
                } label: {
                    Text("Saber mais")
                }
            }
            
            
            
        }
        .padding(.vertical)
        .padding(.leading)
        .background(
            RoundedRectangle(cornerRadius: 15.0)
                .fill(color ?? getBannerColorForType(for: type))
                .opacity(0.5)
        )
    }
    
    func getBannerIconForType(for type: BannerType?) -> String {
        switch type {
        case .warning:
            return "exclamationmark.triangle"
        default:
            return "info.circle"
        }
    }
    
    func getBannerColorForType(for type: BannerType?) -> Color {
        switch type {
        case .warning:
            return .yellow
        case .info:
            return .blue
        case .tip:
            return .purple
        default:
            return .blue
        }
    }
}

#Preview {
    HomeScreenBanner(
        type: .warning,
        title: "Manutenção programada",
        content: "Os serviços online da Carris Metropolitana irão estar offline entre as 23:00 do dia 8 de julho e as 06:00 do dia 9 de julho.\n\nPedimos desculpa pelos incómodos causados."
    )
    .padding()
}
