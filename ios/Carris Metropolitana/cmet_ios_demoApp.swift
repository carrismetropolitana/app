//
//  cmet_ios_demoApp.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/03/2024.
//

import SwiftUI

@main
struct cmet_ios_demoApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    @Environment(\.scenePhase) var scenePhase
    
    @StateObject private var alertsManager = AlertsManager()
    @StateObject private var vehiclesManager = VehiclesManager()
    @StateObject private var linesManager = LinesManager()
    @StateObject private var stopsManager = StopsManager()
    
    @StateObject private var favoritesManager = FavoritesManager()
    
    @StateObject private var locationManager = LocationManager()
    
    
    @State private var isShowingLaunchAnimation = true
    
    var body: some Scene {
        let _ = locationManager.requestAuthorization() // later this should be done in a controlled manner
        WindowGroup {
            ZStack {
                ContentView()
                    .environmentObject(alertsManager)
                    .environmentObject(vehiclesManager)
                    .environmentObject(locationManager)
                    .environmentObject(linesManager)
                    .environmentObject(stopsManager)
                    .environmentObject(favoritesManager)
                    .onAppear {
                        UINavigationBar.appearance().prefersLargeTitles = true
                    }
                    .onChange(of: scenePhase) { oldPhase, newPhase in
                        // right now we assume the user has seen notifs if they enter or leave the app
                        if let groupUserDefaults = UserDefaults(suiteName: "group.pt.carrismetropolitana.app") {
                            groupUserDefaults.set(0, forKey: "badgeCount")
                        }
                        UNUserNotificationCenter.current().setBadgeCount(0)
                    }
                    .zIndex(0)
                
                if isShowingLaunchAnimation {
                    CMLogoAnimation()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(.cmLaunchBackground)
                        .ignoresSafeArea()
                        // ?? https://stackoverflow.com/questions/57730074/transition-animation-not-working-properly-in-swiftui/60151028#60151028
                        .transition(AnyTransition.opacity.animation(.easeInOut(duration: 0.2)))
                        .zIndex(1)
                    
                        .onAppear {
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1.7) {
                                withAnimation {
                                    isShowingLaunchAnimation = false
                                }
                            }
                        }
                }
            }
//            ETAPlayground()
//            ErrorBannerDemo()
//            TestPreview()
//            OtherTestPreview()
//            NewsView()
        }
    }
}
