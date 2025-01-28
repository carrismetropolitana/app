//
//  EasterEggView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 01/05/2024.
//

import SwiftUI
import RealityKit

struct EasterEggView: View {
    var body: some View {
        VStack {
            ARViewContainer(modelName: "cm_logo")
        }
    }
}

#Preview {
    EasterEggView()
}

struct ARViewContainer: UIViewRepresentable {
    let modelName: String
    
    func makeUIView(context: Context) -> ARView {
        let arView = ARView(frame: .zero)
        return arView
    }
    
    func updateUIView(_ uiView: ARView, context: Context) {
        // Remove any existing anchor entities from the scene
        uiView.scene.anchors.removeAll()
        
        // Load the model from the app's asset catalog
        let modelEntity = try! ModelEntity.load(named: modelName + ".usdz")
        
        
        // Create an anchor entity and add the model to it
        let anchorEntity = AnchorEntity()
        anchorEntity.addChild(modelEntity)
        
        // Set the position of the anchor entity to 1 meter in front of the camera
        anchorEntity.position = [0, 0, -1]
        
        
        // Add the anchor entity to the scene
        uiView.scene.addAnchor(anchorEntity)
    }
}
