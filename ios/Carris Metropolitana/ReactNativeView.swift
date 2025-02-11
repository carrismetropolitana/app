//
//  ReactNativeView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 29/01/2025.
//

import SwiftUI
import React
import React_RCTAppDelegate

struct ReactNativeView: UIViewRepresentable {
    var moduleName: String
    var rootViewFactory: RCTRootViewFactory
    var initialProperties: [AnyHashable: Any]?
  
  func makeUIView(context: Context) -> UIView {
      return rootViewFactory.view(withModuleName: moduleName, initialProperties: initialProperties)
  }
  
  func updateUIView(_ uiView: UIView, context: Context) { }
}
