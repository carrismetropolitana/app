//
//  IMLModel.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 29/03/2024.
//

import Foundation

struct IMLStop: Codable {
    let id: Int
    let name: String
    let shortName: String?
    let lat: Double
    let lon: Double
}

struct IMLPicture: Codable, Identifiable { // a bunch of other fields we're not using atm
    let id: Int
    let captureDate: String
    let urlFull: String
    let urlMedium: String
    let urlThumb: String
}
