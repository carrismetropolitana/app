//
//  VehicleInfoAPI.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 15/06/2024.
//

import Foundation


class VehicleInfoAPI { // TODO: this should be relatively static and should be a global service too
    let baseUrl = "https://cmvs.jdcp.workers.dev"
    
    static let shared = VehicleInfoAPI()
    
    enum CustomError: Error {
        case failedToGetVehicleInfo
        case vehicleNotFound
    }
    
    func getVehicleInfo(id: String) async throws -> StaticVehicleInfo {
        var vehicleInfo: StaticVehicleInfo? = nil
        do {
            vehicleInfo = try await NetworkService.makeGETRequest("\(self.baseUrl)/\(id)", responseType: StaticVehicleInfo.self)
        } catch NetworkError.notOkResponse(let statusCode) {
            if (statusCode == 400) {
                print("vehicle not found :/")
                throw CustomError.vehicleNotFound
            }
        } catch {
            print("Failed to fetch vehicle info!")
            print(error)
        }
        
        guard vehicleInfo != nil else {
            throw CustomError.failedToGetVehicleInfo
        }
        
        return vehicleInfo!
    }
}

struct StaticVehicleInfo: Codable {
    let agencyId: Int
    let vehicleNumber: Int
    let id: String
    let startDate: Int
    let licensePlate: String
    let make: String
    let model: String
    let owner: String
    let registrationDate: Int
    let availableSeats: Int
    let availableStanding: Int
    let typology: Int
    let vclass: Int
    let propulsion: Int
    let emission: Int
    let newSeminew: Int
    let ecological: Int
    let climatization: Int
    let wheelchair: Int
    let corridor: Int
    let loweredFloor: Int
    let ramp: Int
    let foldingSystem: Int
    let kneeling: Int
    let staticInformation: Int
    let onboardMonitor: Int
    let frontDisplay: Int
    let rearDisplay: Int
    let sideDisplay: Int
    let internalSound: Int
    let externalSound: Int
    let consumptionMeter: Int
    let bicycles: Int
    let passengerCounting: Int
    let videoSurveillance: Int
}
