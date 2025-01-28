//
//  OtherAgencies.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 04/09/2024.
//

import Foundation


func isCcflLine(_ line: String) -> Bool {
    // Ensure the line is exactly 3 characters long and uppercase it
    guard line.count == 3 else { return false }
    let uppercasedLine = line.uppercased()
    
    let characters = Array(uppercasedLine)
    let firstChar = characters[0]
    let secondChar = characters[1]
    let thirdChar = characters[2]
    
    // Check if the first character is a non-zero digit
    guard firstChar.isNumber, firstChar != "0" else { return false }
    
    if firstChar == "7" || firstChar == "2" {
        // If all characters are digits, check that the last two aren't "00"
        if characters.allSatisfy({ $0.isNumber }) {
            return !(secondChar == "0" && thirdChar == "0")
        }
    }
    
    // If the third character is a letter, it must be E or B, and the first two must be digits
    if thirdChar.isLetter && (thirdChar == "E" || thirdChar == "B") {
        return secondChar.isNumber
    }
    
    return false
}
