//
//  MapFloatingButton.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 25/08/2024.
//

import SwiftUI

struct MapFloatingButton: View {
    let systemImage: String
    var action: () -> Void

    // Initialize with an action and a label view
    init(systemImage: String, action: @escaping () -> Void) {
        self.systemImage = systemImage
        self.action = action
    }
    
    // Body of the custom button view
    var body: some View {
        Button {
            action()
        } label: {
            ZStack {
                RoundedRectangle(cornerRadius: 15.0)
                    .fill(.cmListItemBackground)
                    .frame(width: 60, height: 60)
                    .shadow(color: .black.opacity(0.2), radius: 10)
                Image(systemName: systemImage)
                    .resizable()
                    .foregroundColor(.blue)
                    .frame(width: 30, height: 30)
            }
        }
        .buttonStyle(.plain)
    }
}
#Preview {
    MapFloatingButton(systemImage: "map", action: {})
}
