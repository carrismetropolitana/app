//
//  SearchHistoryService.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 01/07/2024.
//

import Foundation

class LinesSearchHistoryManager: ObservableObject {
    static let shared = LinesSearchHistoryManager() // TODO: this can be an EnvironmentObject
    
    private let userDefaultsKey = "linesSearchHistory"
    
    @Published private(set) var searchHistory: [String] {
        didSet {
            UserDefaults.standard.set(searchHistory, forKey: userDefaultsKey)
        }
    }
    
    private init() {
        self.searchHistory = UserDefaults.standard.array(forKey: userDefaultsKey) as? [String] ?? []
    }
    
    func addSearchResult(_ searchResult: String) {
        if let index = searchHistory.firstIndex(of: searchResult) {
            searchHistory.remove(at: index)
        }
        
        searchHistory.insert(searchResult, at: 0)
        
        if searchHistory.count > 3 {
            searchHistory.removeLast()
        }
    }
    
   func wipeSearchHistory() {
       searchHistory.removeAll()
   }
}
