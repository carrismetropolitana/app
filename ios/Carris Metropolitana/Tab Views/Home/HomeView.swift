//
//  HomeView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/03/2024.
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var favoritesManager: FavoritesManager
    @State private var isSheetOpen = false
    
//    @State var isEasterEggVisible = false
    @AppStorage("onboarded") var onboarded: Bool = false
//    @AppStorage("debugModeEnabled") var debugModeEnabled: Bool = false
    @State private var debugModeEnabled = false
    
    @State private var cmLogoConsecutiveTaps: CGFloat = .zero
    @State private var timer: Timer?
    
    @State private var alertsSheetPresented: Bool = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                HStack {
                    HStack {
                        Image(.cmLogoWhite)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(height: 50)
    //                        .onLongPressGesture(minimumDuration: 2) {
    //                            isEasterEggVisible.toggle()
    //                        }
//                            .onTapGesture {
//                                withAnimation {
//                                    cmLogoConsecutiveTaps += 1
//                                }
//                                
//                                if cmLogoConsecutiveTaps == 6 {
//                                    withAnimation {
//                                        cmLogoConsecutiveTaps = 30
//                                        debugModeEnabled.toggle()
//                                    }
//                                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
//                                        cmLogoConsecutiveTaps = -5
//                                        withAnimation {
//                                            cmLogoConsecutiveTaps = 0
//                                        }
//                                    }
//                                }
//                            }
                            .offset(x: cmLogoConsecutiveTaps * 20.0)
                            .accessibilityLabel(Text("Logótipo da Carris Metropolitana"))
                            .accessibilityHidden(true)
                        Spacer()
                        if debugModeEnabled {
                            DebugMenuButton()
                        }
                        SquaredButton(
                            action: {
                                alertsSheetPresented = true
                            },
                            systemIcon: "exclamationmark.triangle",
                            iconColor: .primary,
                            badgeValue: 0
                        )
                        .scaleEffect(0.8)
    //                    WifiConnectButton()
                    }
                    .padding()
                }
                .background(.cmYellow)
                
                if (
//                    onboarded
                    favoritesManager.favorites.count > 0
                ) {
                    PersonalUserView()
                } else {
                    UnregisteredUserView(onAddFavoritesButtonClick: {
                        isSheetOpen.toggle()
                    })
                }
                
            }
        }
//        .sheet(isPresented: $isEasterEggVisible) {
//            EasterEggView()
//        }
        .sheet(isPresented: $alertsSheetPresented) {
            AllAlertsView()
        }
        .onChange(of: cmLogoConsecutiveTaps) {
            if timer == nil {
                if cmLogoConsecutiveTaps == 1 {
                    timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: false) { timer in
                        withAnimation {
                            cmLogoConsecutiveTaps = 0
                        }
                    }
                }
            } else {
                timer?.invalidate()
                timer = nil
                timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: false) { timer in
                    withAnimation {
                        cmLogoConsecutiveTaps = 0
                    }
                }
            }
        }
        .sheet(isPresented: $isSheetOpen) {
            CustomizeWidgetsSheetView(isSheetOpen: $isSheetOpen)
                .presentationDragIndicator(.visible)
        }
    }
}

struct WifiConnectButton: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 25.0)
                .fill(.windowBackground)
            HStack {
                Circle()
                    .overlay {
                        Image(systemName: "wifi")
                            .foregroundStyle(.windowBackground)
                    }
                    .padding(.vertical, 5)
                    .padding(.leading, 5)
                Spacer()
                Text("Ligar ao Wi-Fi")
                    .bold()
                    .lineLimit(1)
            }
            .padding(.trailing)
        }
        .frame(width: 180, height: 50)
    }
}


struct DebugMenuButton: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 25.0)
                .fill(.windowBackground)
            HStack {
                Circle()
                    .overlay {
                        Image(systemName: "wrench.and.screwdriver.fill")
                            .foregroundStyle(.windowBackground)
                    }
                    .padding(.vertical, 5)
                    .padding(.leading, 5)
                Spacer()
                Text("Debug")
                    .bold()
                    .lineLimit(1)
            }
            .padding(.trailing)
        }
        .frame(width: 130, height: 50)
    }
}

#Preview {
    HomeView()
}
