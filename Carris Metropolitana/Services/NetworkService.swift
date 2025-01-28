//
//  NetworkService.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/03/2024.
//

import Foundation

enum NetworkError: Error {
    case invalidUrl
    case notOkResponse(statusCode: Int)
    case invalidJSONData
}

class NetworkService {
    static func makeGETRequest<T: Decodable>(_ urlString: String, responseType: T.Type) async throws -> T {
        guard let url = URL(string: urlString) else {
            throw NetworkError.invalidUrl
        }
        let (data, response) = try await URLSession.shared.data(from: url)
        
//         print(String(data: data, encoding: .utf8)?.prefix(300))
        
        guard let response = response as? HTTPURLResponse, response.statusCode == 200 else {
            let statusCode = (response as? HTTPURLResponse)?.statusCode ?? -1
            throw NetworkError.notOkResponse(statusCode: statusCode)
        }
        
//        print(data)
        
        do {
            let decoder = JSONDecoder()
            decoder.keyDecodingStrategy = .convertFromSnakeCase // TODO: coding keys not needed for this
//            decoder.dateDecodingStrategy = .secondsSince1970
            
            return try decoder.decode(T.self, from: data)
        } catch {
            print("Error from decoder: \(error)")
            throw NetworkError.invalidJSONData
        }
    }
}
