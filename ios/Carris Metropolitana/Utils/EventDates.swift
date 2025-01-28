//
//  EventDates.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 30/10/2024.
//

import Foundation

extension Date {
    var isCarnivalPeriod: Bool {
        return false
    }
    
    var isHalloweenPeriod : Bool {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.month, .day], from: self)
        return components.month == 10 && components.day == 31
        || components.month == 11 && (components.day == 1 || components.day == 2)
    }
    
    var isChristmasPeriod: Bool {
        return false
    }
}
