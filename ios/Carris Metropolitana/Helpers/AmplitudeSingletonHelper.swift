//
//  AmplitudeSingletonHelper.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 27/12/2024.
//

import AmplitudeSwift

extension Amplitude {
    static var shared = Amplitude(configuration: Configuration(
        apiKey: "API_KEY_HERE",
        serverZone: .EU,
        autocapture: [.sessions, .appLifecycles]
    ))
}
