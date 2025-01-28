//
//  MediaUIShareLink.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 11/10/2024.
//


import SwiftUI

public struct MediaUIShareLink: View, @unchecked Sendable {
  let url: URL
  let type: DisplayType

  public init(url: URL, type: DisplayType) {
    self.url = url
    self.type = type
  }

  public var body: some View {
    if type == .image {
      let transferable = MediaUIImageTransferable(url: url)
      ShareLink(item: transferable, preview: .init("Partilhar imagem",
                                                   image: transferable))
    } else {
      ShareLink(item: url)
    }
  }
}
