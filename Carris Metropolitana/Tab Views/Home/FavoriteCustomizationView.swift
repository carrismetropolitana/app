//
//  FavoriteCustomizationView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 20/03/2024.
//

import SwiftUI
import FirebaseCore
import FirebaseMessaging

enum CustomizationViewType {
    case stop, line
}

// TODO: check if only one line fav can exist and if its unique

struct FavoriteCustomizationView: View {
    @Environment(\.presentationMode) var presentationMode
    
    @EnvironmentObject var stopsManager: StopsManager
    @EnvironmentObject var linesManager: LinesManager
    @EnvironmentObject var favoritesManager: FavoritesManager
    let type: CustomizationViewType
    
    @State private var searchTerm: String = ""
    @State private var selectedStopId: String? = nil
    @State private var selectedLineId: String? = nil
    @State private var sendNotifications = true
    
    @State private var patternsForSelectedItem: [Pattern] = []
    
    @State private var selectedPatternIds: [String] = []
    
    @Binding var isSelfPresented: Bool
    
    var overrideItemId: String? = nil // this is for when this sheet is called by the stop or line details view, to fill in the item automatically
    var overrideFavoriteItem: FavoriteItem? = nil // this is for when a favorite exists and therefore is being edited
    
    @State private var isErrorBannerPresented = false
    @State private var errorTitle = ""
    @State private var errorMessage = ""
    
    var body: some View {
        GeometryReader { geo in
            List {
                Section {
                    NavigationLink(destination: type == .stop ? AnyView(SelectFavoriteStopView(selectedStopId: $selectedStopId)) : AnyView(SelectFavoriteLineView(selectedLineId: $selectedLineId))) {
                        
                        if let fav = overrideFavoriteItem {
                            if fav.type == .stop {
                                let stop = stopsManager.stops.first { $0.id == fav.stopId }
                                if let stop = stop {
                                    VStack(alignment: .leading) {
                                        Text(stop.name)
                                        
                                        Text(stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)")
                                            .foregroundStyle(.secondary)
                                    }
                                }
                            } else if fav.type == .pattern {
                                let line = linesManager.lines.first { $0.id == fav.lineId }
                                if let line = line {
                                    LineEntry(line: line)
                                }
                            }
                        } else if let itemId = overrideItemId {
                            if type == .stop {
                                let stop = stopsManager.stops.first { $0.id == itemId }
                                if let stop = stop {
                                    VStack(alignment: .leading) {
                                        Text(stop.name)
                                        
                                        Text(stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)")
                                            .foregroundStyle(.secondary)
                                    }
                                }
                            } else if type == .line {
                                let line = linesManager.lines.first { $0.id == overrideItemId }
                                if let line = line {
                                    LineEntry(line: line)
                                }
                            }
                        } else {
                            if let stopId = selectedStopId {
                                let stop = stopsManager.stops.first { $0.id == stopId }
                                if let stop = stop {
                                    VStack(alignment: .leading) {
                                        Text(stop.name)
                                        
                                        Text(stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)")
                                            .foregroundStyle(.secondary)
                                    }
                                }
                            } else if let lineId = selectedLineId {
                                let line = linesManager.lines.first { $0.id == lineId }
                                if let line = line {
                                    LineEntry(line: line)
                                }
                            } else {
                                Image(systemName: "magnifyingglass")
                                    .foregroundStyle(.gray)
                                    .padding(.trailing,  10)
                                
                                Text("Procurar \(type == .stop ? String(localized: "paragem") : String(localized: "linha"))", comment:  "Na sheet de personalização/criação de um favorito. %@ pode ser \"linha\" ou \"paragem\"").foregroundColor(.gray).fontWeight(.semibold)
                                    .padding(.vertical, 8)
                            }
                        }
                    
                        Spacer()
                    }
                    .buttonStyle(.plain)
                } header: {
                    VStack(alignment: .leading) {
                        Text("Selecionar \(type == .stop ? String(localized: "paragem") : String(localized: "linha"))", comment: "Na sheet de personalização/criação de um favorito. %@ pode ser \"linha\" ou \"paragem\"")
                            .font(.headline)
                            .bold()
                            .foregroundStyle(.primary)
                        Text("Escolha uma \(type == .stop ? String(localized: "paragem") : String(localized: "linha")) para visualizar na página principal.", comment: "Na sheet de personalização/criação de um favorito. %@ pode ser \"linha\" ou \"paragem\"")
                    }
                    .textCase(nil)
                    .listRowInsets(EdgeInsets(top: 20, leading: 0, bottom: 10, trailing: 0))
                }
                
                Section {
                    // TODO: show empty state if no patterns returned
                    if type == .stop && (selectedStopId != nil || overrideFavoriteItem != nil || overrideItemId != nil) {
                        if patternsForSelectedItem.count > 0 {
                            ForEach(patternsForSelectedItem) { pattern in
                                Button {
                                    withAnimation(.snappy(duration: 0.3)) {
                                        if selectedPatternIds.contains(pattern.id) {
                                            if let index = selectedPatternIds.firstIndex(of: pattern.id) {
                                                selectedPatternIds.remove(at: index)
                                            }
                                        } else {
                                            selectedPatternIds.append(pattern.id)
                                        }
                                    }
                                } label: {
                                    SelectablePatternEntry(isSelected: selectedPatternIds.contains(pattern.id), pattern: pattern)
                                }
                                .tint(.listPrimary)
    //                            .buttonStyle(.plain)
                            }
                        } else {
                            LoadingBar(size: 10)
                        }
                    } else if type == .line && (selectedLineId != nil || overrideFavoriteItem != nil || overrideItemId != nil) {
                        if patternsForSelectedItem.count > 0  {
                            ForEach(patternsForSelectedItem) { pattern in
                                Button {
                                    withAnimation(.snappy(duration: 0.3)) {
                                        if selectedPatternIds.count == 0 {
                                            selectedPatternIds.append(pattern.id)
                                        } else {
                                            selectedPatternIds[0] = pattern.id
                                        }
                                    }
                                } label: {
                                    SelectablePatternEntry(isSelected: selectedPatternIds.contains(pattern.id), pattern: pattern)
                                }
                                .tint(.listPrimary)
    //                            .buttonStyle(.plain)
                            }
                        } else {
                            LoadingBar(size: 10)
                        }
                    } else {
                        Text("Selecione uma \(type == .stop ? "paragem" : "linha")", comment: "Na sheet de personalização/criação de um favorito. %@ pode ser \"linha\" ou \"paragem\"")
                            .foregroundStyle(.tertiary)
                    }
                } header: {
                    VStack(alignment: .leading) {
                        Text("Selecionar destinos")
                            .font(.headline)
                            .bold()
                            .foregroundStyle(.primary)
                        Text(type == .stop ? "Escolha quais destinos pretende visualizar." : "Escolha 1 destino para gravar na página de entrada.")
                    }
                    .textCase(nil)
                    .listRowInsets(EdgeInsets(top: 20, leading: 0, bottom: 10, trailing: 0))
                }
                
                Section {
                    Toggle("Receber notificações", isOn: $sendNotifications)
                        .padding(.vertical, 5.0)
                } header: {
                    VStack(alignment: .leading) {
                        Text("Ativar notificações")
                            .font(.headline)
                            .bold()
                            .foregroundStyle(.primary)
                        Text("Receber notificações sempre que houver novos avisos para as linhas e paragens selecionadas.")
                    }
                    .textCase(nil)
                    .listRowInsets(EdgeInsets(top: 20, leading: 0, bottom: 10, trailing: 0))
                } footer: {
                    VStack(spacing: 20.0) {
                        Button {
                            if type == .stop {
                                if selectedStopId != nil || overrideFavoriteItem != nil || overrideItemId != nil {
                                    if patternsForSelectedItem.count > 0 {
                                        if selectedPatternIds.count > 0 {
                                            favoritesManager.addFavorite(
                                                FavoriteItem(type: .stop, patternIds: selectedPatternIds, stopId: selectedStopId ?? overrideFavoriteItem?.stopId ?? overrideItemId, receiveNotifications: sendNotifications)
                                                )
                                            isSelfPresented.toggle()
                                        } else {
                                            errorTitle = String(localized: "Selecione pelo menos um destino.")
                                            isErrorBannerPresented = true
                                        }
                                    }
                                }
                            } else if type == .line {
                                if selectedLineId != nil || overrideFavoriteItem != nil || overrideItemId != nil {
                                    if patternsForSelectedItem.count > 0 {
                                        if selectedPatternIds.count == 1 {
                                            favoritesManager.addFavorite(
                                                FavoriteItem(
                                                    type: .pattern,
                                                    patternIds: selectedPatternIds,
                                                    displayName: "\(selectedLineId ?? overrideFavoriteItem?.lineId ?? overrideItemId!) - \(patternsForSelectedItem.first { $0.id == selectedPatternIds[0] }!.headsign)",
                                                    lineId: selectedLineId ?? overrideFavoriteItem?.lineId ?? overrideItemId,
                                                    receiveNotifications: sendNotifications
                                                )
                                            )
                                            
                                            isSelfPresented.toggle()
                                        } else {
                                            errorTitle = String(localized: "Selecione um destino.")
                                            isErrorBannerPresented = true
                                        }
                                    }
                                }
                            }
                        } label: {
                            Text("Guardar")
                                .font(.title2)
                                .bold()
                                .frame(maxWidth: .infinity)
                                .padding(5.0)
                        }
                        .buttonStyle(.borderedProminent)
                        
                        Button {
    //                        favoritesManager.removeFavorite()
                            if let fav = overrideFavoriteItem { // is editing, exists and should be removed
                                favoritesManager.removeFavorite(fav)
                            } else if let itemId = overrideItemId {
                                favoritesManager.fuzzyRemove(itemId: itemId, itemType: type == .stop ? .stop : .pattern)
                            }
                            
                            // creating new, haven't saved yet, just ignore and don't save
                            presentationMode.wrappedValue.dismiss()
                        } label: {
                            Text("Eliminar")
                                .font(.title2)
                                .bold()
                                .frame(maxWidth: .infinity)
                                .padding(5.0)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.red)
                    }
//                    .padding(.horizontal)
                    .padding(.top)
                    .frame(width: geo.size.width - geo.size.width / 10)
                }
            }
            .navigationTitle("\(type == .stop ? String(localized: "Paragem") : String(localized: "Linha")) favorita")
            .errorBanner(isPresented: $isErrorBannerPresented, title: $errorTitle, message: $errorMessage)
            .onAppear {
                if let fav = overrideFavoriteItem {
                    sendNotifications = fav.receiveNotifications
                    print("Appeared with override fav item \(fav.id)")
                    if fav.type == .stop {
                        let stop = stopsManager.stops.first { $0.id == fav.stopId }
                        if let stop = stop, let stopPatterns = stop.patterns {
                            Task {
                                var patterns: [Pattern] = []
                                
                                for patternId in stopPatterns {
                                    let pattern = try await CMAPI.shared.getPattern(patternId)
                                    patterns.append(pattern)
                                }
                                
                                patternsForSelectedItem = Array(patterns)
                            }
                        }
                    } else if fav.type == .pattern {
                        let line = linesManager.lines.first { $0.id == fav.lineId }
                        if let line = line {
                            Task {
                                var patterns: [Pattern] = []
                                
                                for patternId in line.patterns {
                                    let pattern = try await CMAPI.shared.getPattern(patternId)
                                    patterns.append(pattern)
                                }
                                
                                patternsForSelectedItem = Array(patterns)
                            }
                        }
                    }
                    selectedPatternIds = fav.patternIds
                } else if let itemId = overrideItemId {
                    
                    print("Appeared with override item id \(itemId)")
                    if type == .stop {
                        let stop = stopsManager.stops.first { $0.id == itemId }
                        if let stop = stop, let stopPatterns = stop.patterns {
                            Task {
                                var patterns: [Pattern] = []
                                
                                for patternId in stopPatterns {
                                    let pattern = try await CMAPI.shared.getPattern(patternId)
                                    patterns.append(pattern)
                                }
                                
                                patternsForSelectedItem = Array(patterns)
                            }
                        }
                    } else if type == .line {
                        let line = linesManager.lines.first { $0.id == itemId }
                        if let line = line {
                            Task {
                                var patterns: [Pattern] = []
                                
                                for patternId in line.patterns {
                                    let pattern = try await CMAPI.shared.getPattern(patternId)
                                    patterns.append(pattern)
                                }
                                
                                patternsForSelectedItem = Array(patterns)
                            }
                        }
                    }
                    if favoritesManager.isFavorited(itemId: itemId, itemType: type == .stop ? .stop : .pattern) {
                        let overridenFavoriteItem = favoritesManager.favorites.first {
                            itemId == (type == .stop ? $0.stopId : $0.lineId)
                        }
                        sendNotifications = overridenFavoriteItem!.receiveNotifications
                        selectedPatternIds = overridenFavoriteItem!.patternIds
                    }
                }
            }
            .onChange(of: selectedPatternIds) {
                print("type: \(type); selectedPatternIds: \(selectedPatternIds)")
            }
            .onChange(of: selectedStopId) {
                patternsForSelectedItem = []
                
                let stop = stopsManager.stops.first { $0.id == selectedStopId }
                if let stop = stop, let stopPatterns = stop.patterns {
                    Task {
                        var patterns: [Pattern] = []
                        
                        for patternId in stopPatterns {
                            let pattern = try await CMAPI.shared.getPattern(patternId)
                            patterns.append(pattern)
                        }
                        
                        patternsForSelectedItem = Array(patterns)
                    }
                }
            }
            .onChange(of: selectedLineId) {
                patternsForSelectedItem = []
                
                let line = linesManager.lines.first { $0.id == selectedLineId }
                if let line = line {
                    Task {
                        var patterns: [Pattern] = []
                        
                        for patternId in line.patterns {
                            let pattern = try await CMAPI.shared.getPattern(patternId)
                            patterns.append(pattern)
                        }
                        
                        patternsForSelectedItem = Array(patterns)
                    }
                }
        }
        }
    }
}

struct SearchInputForList: View {
    @Binding var text: String
    let placeholder: String
    let leadingSystemIcon: String?
    let trailingSystemIcon: String?
    
    var body: some View {
//        TextField("", text: $text, prompt: Text(placeholder).foregroundColor(.gray).fontWeight(.semibold))
//            .padding(18)
//            .background(.white)
//            .cornerRadius(15)
        
        VStack(alignment: .center) {
            HStack{
                if leadingSystemIcon != nil {
                    Image(systemName: leadingSystemIcon!)
                        .foregroundStyle(.gray)
                        .padding(.trailing,  10)
                }
                
                TextField("", text: $text, prompt: Text(placeholder).foregroundColor(.gray).fontWeight(.semibold))
                    .padding(.vertical, 8)
                
                if trailingSystemIcon != nil {
                    Spacer()
                    Image(systemName: trailingSystemIcon!)
                        .foregroundStyle(.gray)
                        .padding(.trailing, 5)
                }
            }
            .background(Color.white.opacity(0.7))
            .cornerRadius(15)
        }
    }
}


struct SelectablePatternEntry: View {
    let isSelected: Bool
    let pattern: Pattern
    var body: some View {
        HStack {
                HStack {
                    Pill(text: pattern.shortName, color: .init(hex: pattern.color), textColor: .init(hex: pattern.textColor))
                        .padding(.horizontal, 5.0)
                    Text(pattern.headsign)
                        .bold()
                        .font(.subheadline)
                        .lineLimit(2)
                }
                .frame(height: 40)
                .padding(.vertical, 5)
            Spacer()
            Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(isSelected ? .green : .primary)
                .padding(.trailing, 3.0)
                .scaleEffect(1.3)
        }
    }
}

#Preview {
    FavoriteCustomizationView(type: .stop, isSelfPresented: .constant(true))
}
