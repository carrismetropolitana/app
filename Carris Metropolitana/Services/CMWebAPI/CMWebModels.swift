//
//  CMWModels.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/09/2024.
//

import Foundation

struct StartupMessage: Codable {
    let messageId: String
    let buildMax: Int?
    let buildMin: Int?
    let presentationType: PresentationType
    let messageUrl: String
    
    enum PresentationType: String, Codable {
        case breaking, changelog
    }
}
