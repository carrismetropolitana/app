//
//  StopsManager.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 29/06/2024.
//

import Foundation

class StopsManager: ObservableObject {
    @Published var stops: [Stop] = []


    init() {
        print("StopsManager got instantiated!")
        fetchStops()
        setupAutoRefresh()
        print("Stops: \(stops.count)")
    }

    func fetchStops() {
        Task {
            var newStops = await CMAPI.shared.getStops()
            for i in newStops.indices {
                newStops[i].nameNormalized = newStops[i].name.normalizedForSearch()
                if let ttsName = newStops[i].ttsName {
                    newStops[i].ttsNameNormalized = ttsName.normalizedForSearch()
                }
            }
            let modifiedStops = newStops
            DispatchQueue.main.async {
                self.stops = modifiedStops
                print("Got \(modifiedStops.count) new stops!")
            }
            
        }
    }

    private func setupAutoRefresh() {
        Timer.scheduledTimer(withTimeInterval: 60*10, repeats: true) { _ in
            self.fetchStops()
        }
    }
}
