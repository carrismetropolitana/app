//
//  String.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 18/09/2024.
//

import Foundation


extension String {
    func normalizedForSearch() -> String {
        // Lowercase string
        var normalizedString = self.lowercased()
        
        // Remove diacritics
        normalizedString = normalizedString.folding(options: .diacriticInsensitive, locale: .current)
        
        // Remove non-alphanumeric characters
        normalizedString = normalizedString.components(separatedBy: CharacterSet.alphanumerics.union(.whitespaces).inverted).joined()
        
        return normalizedString
    }
}
