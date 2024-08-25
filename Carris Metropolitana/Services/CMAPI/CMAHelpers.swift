//
//  Helpers.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 25/08/2024.
//

import Foundation

extension Pattern {
    func isValidOnDate(date: Date) -> Bool {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyyMMdd"
        let stringifiedDate = dateFormatter.string(from: date)
        
        return self.validOn.contains(stringifiedDate)
    }
}

// Helper function to adjust time format for operational day hours after midnight
func adjustTimeFormat(time: String?) -> String? {
    guard let time = time else { return nil }

    let components = time.split(separator: ":")
    guard components.count == 2,
          let hours = Int(components[0]),
          let minutes = Int(components[1]) else { return time }

    let adjustedHours = hours % 24
    let formattedTime = String(format: "%02d:%02d", adjustedHours, minutes)

    return formattedTime
}
