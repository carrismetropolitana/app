//
//  CMWebAPI.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/09/2024.
//

import Foundation

enum CMWebAPIError: Error {
    case requestFailed(Error)
}

class CMWebAPI {
    private static let baseUrl = "https://www.cmet.pt/api/app-ios"
    private static let startupMessagesUrl = "\(baseUrl)/v2/startup/message"
    
    static let shared = CMWebAPI()
    
    func getStartupMessages() async throws -> [StartupMessage] {
        var startupMessages: [StartupMessage] = []
        
        do {
            startupMessages = try await NetworkService.makeGETRequest(CMWebAPI.startupMessagesUrl, responseType: [StartupMessage].self)
        } catch {
            print("Failed to fetch startup messages!")
            print(error)
            throw CMWebAPIError.requestFailed(error)
        }
        
        return startupMessages
    }
}
