//
//  AnimatedLiveCircle.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 25/03/2024.
//

import SwiftUI

struct AnimatedLiveCircle: View {
    @State private var isExpanded = false
    var body: some View {
        ZStack(alignment: .center) {
            Circle()
                .fill(.green)
                .scaleEffect(0.2)
            Circle()
                .fill(.green.opacity(isExpanded ? 0 : 0.9))
                .scaleEffect(isExpanded ? 0.7 : 0.0)
                .animation(Animation.interpolatingSpring(stiffness: 10, damping: 10).repeatForever(autoreverses: false))
                .onAppear {
                    self.isExpanded.toggle()
                }
        }
        .frame(width: 30, height: 30)
    }
}

#Preview {
    AnimatedLiveCircle()
}
