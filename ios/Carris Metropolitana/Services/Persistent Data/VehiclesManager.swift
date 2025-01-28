//
//  VehiclesManager.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 08/06/2024.
//

import Foundation

class VehiclesManager: ObservableObject {
    @Published var vehicles: [VehicleV2] = []
    private var timer: Timer?

    init() {
        print("VehiclesManager got instantiated!")
        fetchVehicles()
        print("Vehicles: \(vehicles.count)")
    }

    func fetchVehicles() {
        Task {
            do {
                let newVehicles = try await CMAPI.shared.getVehiclesV2()
                DispatchQueue.main.async {
                    self.vehicles = newVehicles.realtimeVehicles // we're not using offline vehicles
                    print("Got \(newVehicles.count) new vehicles!, \(Date.now)")
                }
            } catch {
                print("Failed to fetch vehicles!")
                print(error)
            }
        }
    }

    func startFetching() {
        print("VMANA started periodically fetching")
        if (timer == nil) {
            self.fetchVehicles()
            timer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { _ in
                self.fetchVehicles()
            }
        }
    }
    
    func stopFetching() {
        print("VMANA stopped periodically fetching")
        // Invalidate the timer to stop fetching
        timer?.invalidate()
        timer = nil
    }
}
