//
//  POCNavigationStackBug.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 21/06/2024.
//

import SwiftUI

struct POCNavigationStackBehavior: View {
    @State private var animating = false
    var body: some View {
        NavigationStack {
            VStack {
                RoundedRectangle(cornerRadius: 15.0)
                    .fill(.quaternary)
                    .padding(.horizontal)
                    .frame(height: 200)
                    .opacity(animating ? 0.3 : 1)
                    .animation(.easeInOut(duration: 0.75).repeatForever(), value: animating)
                    .onAppear {
                        DispatchQueue.main.async {
                                animating.toggle()
                        }
                    }
            }
        }
    }
}

#Preview {
    POCNavigationStackBehavior()
}
