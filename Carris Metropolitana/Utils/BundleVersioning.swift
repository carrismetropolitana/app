//
//  BundleVersioning.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 12/09/2024.
//

import Foundation

extension Bundle {
    var releaseVersionNumber: String? {
        return infoDictionary?["CFBundleShortVersionString"] as? String
    }
    var buildVersionNumber: String? {
        return infoDictionary?["CFBundleVersion"] as? String
    }
}

func currentBuildInBuildInterval(maxBuild: Int?, minBuild: Int?) -> Bool {
    if let buildVersionNumber = Int(Bundle.main.buildVersionNumber!) {
        guard !(maxBuild == nil && minBuild == nil) else {
            return false
        }
        
        if let maxBuild = maxBuild, let minBuild = minBuild {
            return (buildVersionNumber < maxBuild
                    && buildVersionNumber > minBuild)
        }
        
        if let maxBuild = maxBuild {
            return buildVersionNumber < maxBuild
        }
        
        if let minBuild = minBuild {
            return buildVersionNumber > minBuild
        }
    }
    return false
}
