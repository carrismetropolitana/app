//
//  LiveActivityService.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 20/03/2024.
//

import Foundation


class LiveActivityService {
    
    func enablePeriodicBackgroundTasks() {
        let urlSession = URLSession(configuration: .background(withIdentifier: "CMBusTrackingLiveActivityUpdater")) // probably wont be possible because of such short frequency; push notis would be more viable and reliable
    }
}
