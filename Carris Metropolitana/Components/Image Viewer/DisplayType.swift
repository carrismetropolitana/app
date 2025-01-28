//
//  DisplayType.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 11/10/2024.
//


import SwiftUI

public enum DisplayType {
  case image
  case av

  public init(from attachmentType: MediaAttachment.SupportedType) {
    switch attachmentType {
    case .image:
      self = .image
    case .video, .gifv, .audio:
      self = .av
    }
  }
}
