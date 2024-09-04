//
//  ContentView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/03/2024.
//

import SwiftUI
import MapKit

enum Tab {
    case home, lines, stops, more
}

class TabCoordinator: ObservableObject {
    @Published var selectedTab: Tab = .home
    
    // Properties to persist between tab changes
    @Published var mapFlyToCoords: CLLocationCoordinate2D?
    @Published var flownToStopId: String?
}

struct ContentView: View {
    @StateObject private var tabCoordinator = TabCoordinator()
    
    var body: some View {
        ZStack {
            TabView(selection: $tabCoordinator.selectedTab) {
                HomeView()
                    .tabItem {
                        Label("Home", systemImage: "person.crop.circle.fill")
                    }
                    .tag(Tab.home)
                
                LinesView()
                    .tabItem {
                        Label("Linhas", systemImage: "arrow.triangle.swap")
                    }
                    .tag(Tab.lines)
                
                StopsView()
                    .tabItem {
                        Label("Paragens", systemImage: "map")
                    }
                    .tag(Tab.stops)
                
                MoreView()
                    .tabItem {
                        Label("Mais", systemImage: "ellipsis")
                    }
                    .tag(Tab.more)
            }
            .environmentObject(tabCoordinator)
        }
        .onAppear {
            let appearance = UITabBarAppearance()
//                    appearance.configureWithOpaqueBackground()
            appearance.backgroundEffect = UIBlurEffect(style: .systemMaterial)
            appearance.backgroundColor = UIColor(.cmSystemBackground100).withAlphaComponent(0.6)
            
            appearance.stackedLayoutAppearance.normal.iconColor = .gray
            appearance.stackedLayoutAppearance.normal.titleTextAttributes = [NSAttributedString.Key.foregroundColor: UIColor.gray]
                    
            appearance.stackedLayoutAppearance.selected.iconColor = UIColor(.primary)
            appearance.stackedLayoutAppearance.selected.titleTextAttributes = [NSAttributedString.Key.foregroundColor: UIColor(.primary)]
                    
            UITabBar.appearance().standardAppearance = appearance
            UITabBar.appearance().scrollEdgeAppearance = appearance
        }
    }
}

#Preview {
    ContentView()
}
