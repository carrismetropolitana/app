//
//  FavoritesService.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 26/05/2024.
//

import Foundation
import FirebaseMessaging

enum FavoriteType: Codable {
    case pattern, stop
}

struct FavoriteItem: Codable, Identifiable {
    let id: String
    let type: FavoriteType
    let displayName: String?
    let lineId: String?
    let stopId: String?
    private(set) var patternIds: [String]
    let receiveNotifications: Bool
    
    init(type: FavoriteType, patternIds: [String], stopId: String? = nil, displayName: String? = nil, lineId: String? = nil, receiveNotifications: Bool = false) {  // if type == .pattern then patternId.count should equal 1; if for some god forsaken reason it isnt use first and ignore others (shouldn't happen but still)
        self.type = type
        self.displayName = displayName
        self.lineId = lineId
        self.stopId = stopId
        self.receiveNotifications = receiveNotifications
        if type == .pattern {
            self.patternIds = patternIds.count > 0 ? [patternIds[0]] : []
            self.id = "favorites:pattern:\(patternIds[0])"
        } else {
            self.id = "favorites:stop:\(stopId!)"
            self.patternIds = patternIds
        }
    }
}

struct DBV1FavoriteItem: Codable, Identifiable {
    let id: String
    let type: FavoriteType
    let displayName: String?
    let lineId: String?
    let stopId: String?
    private(set) var patternIds: [String]
}


class FavoritesManager: ObservableObject {
    @Published var favorites: [FavoriteItem] = []
    private let userDefaultsKey = "userFavorites"

    init() {
        loadFavorites()
        fcmSubscribeToFavorites()
    }
    
    private func fcmSubscribeForFavoriteItem(item: FavoriteItem) {
        if item.type == .stop {
            Messaging.messaging().subscribe(toTopic: "cm.realtime.alerts.stop.\(item.stopId!)") { error in
                print("Subscribed to selected stop id")
            }
            for patternId in item.patternIds {
                Messaging.messaging().subscribe(toTopic: "cm.realtime.alerts.line.\(patternId.components(separatedBy: "_")[0])") { error in
                    print("Subscribed to selected line id")
                }
            }
        } else if item.type == .pattern {
            Messaging.messaging().subscribe(toTopic: "cm.realtime.alerts.line.\(item.lineId!)") { error in
                print("Subscribed to selected line id")
            }
        }
    }
    
    private func fcmUnsubscribeForFavoriteItem(item: FavoriteItem) {
        if item.type == .stop {
            Messaging.messaging().unsubscribe(fromTopic: "cm.realtime.alerts.stop.\(item.stopId!)") { error in
                print("Unsubscribed to selected stop id")
            }
            for patternId in item.patternIds {
                Messaging.messaging().unsubscribe(fromTopic: "cm.realtime.alerts.line.\(patternId.components(separatedBy: "_")[0])") { error in
                    print("Unsubscribed to selected line id")
                }
            }
        } else if item.type == .pattern {
            Messaging.messaging().unsubscribe(fromTopic: "cm.realtime.alerts.line.\(item.lineId!)") { error in
                print("Unsubscribed to selected line id")
            }
        }
    }
    
    private func fcmSubscribeToFavorites() {
        for favorite in favorites {
            if (favorite.receiveNotifications) {
                fcmSubscribeForFavoriteItem(item: favorite)
            } else {
                fcmUnsubscribeForFavoriteItem(item: favorite)
            }
        }
    }
    
    func addFavorite(_ item: FavoriteItem) {
        if let index = favorites.firstIndex(where: { $0.id == item.id }) {
            favorites.remove(at: index)
            favorites.insert(item, at: index)
        } else {
            favorites.append(item)
        }
        
        if (item.receiveNotifications) {
            fcmSubscribeForFavoriteItem(item: item)
        } else {
            fcmUnsubscribeForFavoriteItem(item: item)
        }
        
        saveFavorites()
    }
    
    func moveFavorites(fromOffsets: IndexSet, toOffset: Int) {
        favorites.move(fromOffsets: fromOffsets, toOffset: toOffset)
        saveFavorites()
    }
    
    func isFavorited(itemId: String, itemType: FavoriteType) -> Bool { // cant be checking for line ids, there can be many same lineids, with different patternids, or maybe not??
        return favorites.contains {
            itemId == (itemType == .stop ? $0.stopId : $0.lineId)
        }
    }
    
    func removeFavorite(_ item: FavoriteItem) {
        if let index = favorites.firstIndex(where: { $0.patternIds == item.patternIds && $0.type == item.type }) {
            fcmUnsubscribeForFavoriteItem(item: favorites[index])
            favorites.remove(at: index)
            saveFavorites()
        }
    }
    
    func fuzzyRemove(itemId: String, itemType: FavoriteType) {
        if itemType == .stop {
            if let item = favorites.first(where: { $0.stopId == itemId }) {
                removeFavorite(item)
                saveFavorites()
            }
        } else if itemType == .pattern {
            if let item = favorites.first(where: { $0.lineId == itemId }) {
                removeFavorite(item)
                saveFavorites()
            }
        }
    }
    
    private func fcmUnsubscribeFromAllFavorites() {
        for favorite in favorites {
            fcmUnsubscribeForFavoriteItem(item: favorite)
        }
    }

    
    func wipeFavorites() {
        fcmUnsubscribeFromAllFavorites()
        favorites.removeAll()
        saveFavorites()
    }
    
    private func saveFavorites() {
        let encoder = PropertyListEncoder()
        if let encoded = try? encoder.encode(favorites) {
            UserDefaults.standard.set(encoded, forKey: userDefaultsKey)
        }
    }
    
    private func loadFavorites() {
        if let savedFavorites = UserDefaults.standard.data(forKey: userDefaultsKey) {
            let decoder = PropertyListDecoder()
            if let loadedFavorites = try? decoder.decode([FavoriteItem].self, from: savedFavorites) {
                favorites = loadedFavorites
            } else if let dbv1Favorites = try? decoder.decode([DBV1FavoriteItem].self, from: savedFavorites) {
                favorites = migrateFromDBV1(dbv1Favorites: dbv1Favorites)
                saveFavorites()
            }
        }
    }
    
    
    private func migrateFromDBV1(dbv1Favorites: [DBV1FavoriteItem]) -> [FavoriteItem] {
        var migratedFavorites: [FavoriteItem] = []
        for favorite in dbv1Favorites {
            migratedFavorites.append(FavoriteItem(
                type: favorite.type,
                patternIds: favorite.patternIds,
                stopId: favorite.stopId,
                displayName: favorite.displayName,
                lineId: favorite.lineId,
                receiveNotifications: false
            ))
        }
        return migratedFavorites
    }
}
