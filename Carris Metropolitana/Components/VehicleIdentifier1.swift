//
//  RouteBadgePill.swift
//  GeoBus
//
//  Created by João on 29/04/2020.
//  Copyright © 2020 João de Vasconcelos. All rights reserved.
//

import SwiftUI

// Create an immediate, looping animation
extension View {
   func animatePlaceholder(binding: Binding<Double>) -> some View {
      
      let minOpacity: Double = 0.5
      let animationSpeed: Double = 1
      
      return onAppear {
         withAnimation(.easeInOut(duration: animationSpeed).repeatForever(autoreverses: true)) {
            binding.wrappedValue = minOpacity
         }
      }
      
   }
}

struct VehicleIdentifier: View {

   let vehicleId: String?
   let vehiclePlate: String?

   @State var toggleIdentifier: Bool = false

   @State var placeholderOpacity: Double = 1
   
   var placeholder: some View {
       Text(verbatim: "00000")
         .font(Font.system(size: 12, weight: .bold, design: .monospaced) )
         .foregroundColor(.clear)
         .padding(.vertical, 2)
         .padding(.horizontal, 7)
         .background(Color("PlaceholderShape"))
         .cornerRadius(5)
         .opacity(placeholderOpacity)
         .animatePlaceholder(binding: $placeholderOpacity)
   }
   
   

   var busNumberView: some View {
      Text(vehicleId!)
         .font(Font.system(size: 12, weight: .bold, design: .monospaced) )
         .foregroundColor(.primary)
         .padding(.vertical, 2)
         .padding(.horizontal, 7)
         .background(Color(.secondarySystemFill))
         .cornerRadius(5)
   }


   var licensePlateView: some View {
      HStack(spacing: 0) {
         ZStack {
            Text(verbatim: "P")
               .font(.system(size: 8, weight: .bold, design: .monospaced))
               .foregroundColor(.white)
               .padding(.horizontal, 3)
               .padding(.vertical, 4)
         }
         .background(Color(.systemBlue))
         VStack {
            Text(vehiclePlate!)
               .font(.system(size: 10, weight: .bold, design: .monospaced))
               .foregroundColor(.black)
               .padding(.horizontal, 5)
         }
      }
      .background(Color(.white))
      .border(Color(.systemBlue))
      .cornerRadius(2)
   }


   var body: some View {
      if (vehicleId != nil) {
         
         if (vehiclePlate != nil) {
            VStack {
               if (toggleIdentifier) {
                  busNumberView
                   .accessibilityElement(children: .ignore)
                   .accessibilityLabel(Text("Número de frota do veículo"))
                   .accessibilityValue(Text("\(vehicleId ?? "")"))
                   .accessibilityHint(Text("Duplo toque para alternar para mostrar a matrícula"))
               } else {
                  licensePlateView
                   .accessibilityElement(children: .ignore)
                   .accessibilityLabel(Text("Matrícula do veículo"))
                   .accessibilityValue(Text("\(vehiclePlate ?? "")"))
                   .accessibilityHint(Text("Duplo toque para alternar para mostrar o número de frota"))
               }
            }
            .onTapGesture {
//               TapticEngine.impact.feedback(.light)
               self.toggleIdentifier = !toggleIdentifier
            }
         } else {
            busNumberView
             .accessibilityElement(children: .ignore)
             .accessibilityLabel(Text("Número de frota do veículo"))
             .accessibilityValue(Text("\(vehicleId ?? "")"))
             .accessibilityHint(Text("Matrícula do veículo não disponível"))
         }
         
      } else {
         placeholder
      }
   }

}
