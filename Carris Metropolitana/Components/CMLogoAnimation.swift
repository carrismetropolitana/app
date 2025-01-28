//
//  CMLogoAnimation.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 09/07/2024.
//

import SwiftUI
import Lottie

struct CMLogoAnimation: View {
    @Environment(\.colorScheme) var colorScheme
    var body: some View {
        VStack {
            LottieView(animation: .named(colorScheme == .light ? "CMLogoLoop" : "CMLogoLoopDark"))
                .animationSpeed(2.3)
                .playing(loopMode: .autoReverse)
                .frame(width: 250)
        }
    }
}

#Preview {
    CMLogoAnimation()
}
