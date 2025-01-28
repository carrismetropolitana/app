//
//  LoadingBar.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 30/03/2024.
//

import SwiftUI

struct LoadingBar: View {
    let size: CGFloat
    
    @State var isInitialState = true
    
    var body: some View {
        ZStack {
            Capsule()
                .fill(.tertiary)
                .frame(width: size * 10, height: size)
            Capsule()
                .fill(.cmYellow)
                .frame(width: size * 2, height: size / 1.5)
                .offset(x: isInitialState ? -(size * 3.1) : size * 3.1)
        }
        .onAppear {
            DispatchQueue.main.async {
                withAnimation(.linear(duration: 0.3).repeatForever(autoreverses: true)) {
                    isInitialState.toggle()
                }
            }
        }
    }
}

#Preview {
    LoadingBar(size: 10)
}
