//
//  OnboardingView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 06/06/2024.
//

import SwiftUI

struct OnboardingView: View {
    var body: some View {
        ZStack {
            VStack {
                Rectangle()
                    .fill(
                        LinearGradient(
                            gradient: Gradient(colors: [Color.cmYellow, Color.clear]),
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .offset(y: -300)
                    .ignoresSafeArea()
            }
            VStack {
                Image(.cmLogoWhite)
                    .padding()
                Spacer()
            }
        }
        Spacer()
    }
}

#Preview {
    OnboardingView()
}
