//
//  CustomizeWidgetsSheetView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 20/03/2024.
//

import SwiftUI

enum WidgetType: String {
    case favoriteStop = "Paragem Favorita"
    case favoriteLine = "Linha Favorita"
    case smartNotification = "Notificação Inteligente"
}

struct Widget {
    let name: String
    let type: WidgetType
    let defaultValue: String
    let systemImage: String
    let color: Color
}

let staticWidgets = [
    Widget(name: WidgetType.favoriteStop.rawValue, type: .favoriteStop, defaultValue: "Hospital (Elvas)", systemImage: "mappin.and.ellipse", color: .orange),
    Widget(name: WidgetType.favoriteLine.rawValue, type: .favoriteLine, defaultValue: "3025 - Pragal (Estação)", systemImage: "arrow.triangle.swap", color: .red),
    Widget(name: WidgetType.smartNotification.rawValue, type: .smartNotification, defaultValue: "Hospital (Elvas)", systemImage: "bell.badge", color: .green)
]

struct CustomizeWidgetsSheetView: View {
    @EnvironmentObject var favoritesManager: FavoritesManager
    @EnvironmentObject var stopsManager: StopsManager
    @EnvironmentObject var linesManager: LinesManager
    
    @Binding var isSheetOpen: Bool
    
    @State var editMode: EditMode = .active
    @State var widgets = [ // TODO: here temporarily as mock values, this should be coherent with the home page widgets
        Widget(name: WidgetType.favoriteStop.rawValue, type: .favoriteStop, defaultValue: "Hospital (Elvas)", systemImage: "mappin.and.ellipse", color: .orange),
        Widget(name: WidgetType.favoriteLine.rawValue, type: .favoriteLine, defaultValue: "3025 - Pragal (Estação)", systemImage: "arrow.triangle.swap", color: .red),
        Widget(name: WidgetType.smartNotification.rawValue, type: .smartNotification, defaultValue: "Hospital (Elvas)", systemImage: "bell.badge", color: .green)
    ]
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                List {
                    Section {
//                        ForEach(widgets, id: \.self.type) { widget in
//                            NavigationLink(destination: SmartNotificationCustomizationView()) {
//                                HStack {
//                                    Image(systemName: "line.3.horizontal")
//                                        .font(.title2)
//                                        .foregroundStyle(.tertiary)
//                                        .padding(.trailing, 10)
//                                    VStack(alignment: .leading) {
//                                        Text(widget.name)
//                                            .font(.footnote)
//                                            .foregroundStyle(.secondary)
//                                        Text(widget.defaultValue)
//                                            .bold()
//                                    }
//                                }
//                            }
//                        }
                        if favoritesManager.favorites.count > 0{
                            ForEach(favoritesManager.favorites) { fav in
                                NavigationLink(destination: getDestinationForWidgetEditLink(favorite: fav, isSheetOpen: $isSheetOpen)) {
                                    HStack {
                                        Image(systemName: "line.3.horizontal")
                                            .font(.title2)
                                            .foregroundStyle(.tertiary)
                                            .padding(.trailing, 10)
                                        VStack(alignment: .leading) {
                                            Text("\(fav.type == .stop ? String(localized: "Paragem") : String(localized: "Linha")) Favorita", comment: "Na sheet de personalização dos favoritos")
                                                .font(.footnote)
                                                .foregroundStyle(.secondary)
                                            if fav.type == .stop {
                                                // will crash if stopsManager is empty due to no network for example. add local persistent cache.
                                                Text(stopsManager.stops.first { $0.id == fav.stopId }!.name)
                                                    .bold()
                                            } else {
                                                Text(fav.displayName!)
                                                    .bold()
                                            }
                                        }
                                    }
                                }
//                                .contentTransition(.opacity)
                                .swipeActions {
                                    Button(role: .destructive) {
                                        withAnimation {
                                            favoritesManager.removeFavorite(fav)
                                        }
                                    } label: {
                                        Label("Apagar", systemImage: "trash.fill")
                                    }
                                }
                            }
                            .onMove(perform: { indices, newOffset in
                                favoritesManager.moveFavorites(fromOffsets: indices, toOffset: newOffset)
                            })
                        } else {
                            Text("Ainda não tem favoritos.\nExperimente adicionar um abaixo!", comment: "Na sheet de personalização dos favoritos")
                                .foregroundStyle(.secondary)
                        }
                    } header: {
                        VStack(alignment: .leading) {
                            Text("Ordenar Cartões", comment: "Na sheet de personalização dos favoritos")
                                .font(.headline)
                                .bold()
                                .foregroundStyle(.primary)
                            Text("Organize os cartões como quer que apareçam na página principal. Altere a ordem deslizando no ícone \(Image(systemName: "line.3.horizontal"))", comment: "Na sheet de personalização dos favoritos") // wow i had no idea, cool, actually makes so much sense since SF Symbols conform to a common thing with Text
                        }
                        .textCase(nil)
                        .listRowInsets(EdgeInsets(top: 20, leading: 0, bottom: 10, trailing: 0))
                    }
                    
                    Section {
                        ForEach(staticWidgets, id: \.self.type) { widget in // TODO: make static, leftovers from showcase
                            HStack {
                                Image(systemName: widget.systemImage)
                                    .font(.title2)
                                    .foregroundStyle(widget.type == .smartNotification ? .secondary : widget.color)
                                    .padding(.trailing, 10)
                                Text(widget.name)
                                    .bold()
                                    .padding(.vertical, 8)
                                    .foregroundStyle(widget.type == .smartNotification ? .secondary : .primary)
                                Spacer()
                                if widget.type == .smartNotification {
                                    Text("Em breve".uppercased())
                                        .foregroundStyle(.white)
                                        .font(.callout)
                                        .fontWeight(.heavy)
                                        .padding(.horizontal, 10.0)
                                        .background(Capsule().fill(.gray))
                                } else {
                                    Image(systemName: "plus.circle.fill")
                                        .font(.title2)
                                        .foregroundStyle(.green)
                                }
                            }
                            .background {
                                if widget.type != .smartNotification {
                                    NavigationLink("", destination: getDestinationForNewWidgetLink(widget: widget, isSheetOpen: $isSheetOpen))
                                }
                            }
                        }
                    } header: {
                        VStack(alignment: .leading) {
                            Text("Adicionar novo cartão", comment: "Na sheet de personalização dos favoritos")
                                .font(.headline)
                                .bold()
                                .foregroundStyle(.primary)
                            Text("Escolha um tipo de cartão para adicionar à página principal.", comment: "Na sheet de personalização dos favoritos")
                        }
                        .textCase(nil)
                        .listRowInsets(EdgeInsets(top: 40, leading: 0, bottom: 10, trailing: -8)) // wooow also new for me very kewl
                    }
                }
            }
            .navigationTitle("Personalizar")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        isSheetOpen.toggle()
                    } label: {
                        Text("Fechar")
                    }
                }
            }
        }
//        .environment(\.editMode, $editMode)
    }
}

func getDestinationForNewWidgetLink(widget: Widget, isSheetOpen: Binding<Bool>) -> some View {
    switch widget.type {
    case .favoriteStop:
        return AnyView(FavoriteCustomizationView(type: .stop, isSelfPresented: isSheetOpen))
    case .favoriteLine:
        return AnyView(FavoriteCustomizationView(type: .line, isSelfPresented: isSheetOpen))
    case .smartNotification:
        return AnyView(SmartNotificationCustomizationView())
    }
}

func getDestinationForWidgetEditLink(favorite: FavoriteItem, isSheetOpen: Binding<Bool>) -> some View {
    switch favorite.type {
    case .stop:
        return AnyView(FavoriteCustomizationView(type: .stop, isSelfPresented: isSheetOpen, overrideFavoriteItem: favorite))
    case .pattern:
        return AnyView(FavoriteCustomizationView(type: .line, isSelfPresented: isSheetOpen, overrideFavoriteItem: favorite))
//    case .smartNotification:
//        return AnyView(SmartNotificationCustomizationView())
    }
}




extension View {
    func scrollEnabled(_ value: Bool) -> some View {
        self.onAppear {
            UITableView.appearance().isScrollEnabled = value // will probably affect other scrollviews in scope (?)
        }
    }
}

//#Preview {
//    CustomizeWidgetsSheetView(isSheetOpen: false)
//}
