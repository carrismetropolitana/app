//
//  ShareToolbarItem.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 11/10/2024.
//


import SwiftUI

struct ShareToolbarItem: ToolbarContent, @unchecked Sendable {
  let url: URL
  let type: DisplayType

  var body: some ToolbarContent {
    ToolbarItem(placement: .topBarTrailing) {
      MediaUIShareLink(url: url, type: type)
    }
  }
}