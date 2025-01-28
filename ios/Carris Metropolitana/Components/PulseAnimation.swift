//
//  Pulse.swift
//  GeoBus
//
//  Created by João de Vasconcelos on 14/10/2022.
//

import SwiftUI


struct PulseLabel: View {
   
   let accent: Color
   let label: Text
   
   var body: some View {
      HStack(spacing: 2) {
          Pulse(size: 20, accent: self.accent)
          Spacer()
          label
            .font(Font.system(size: 12, weight: .medium, design: .default) )
            .bold()
            .monospacedDigit()
            .allowsTightening(true)
            .lineLimit(1)
            .foregroundColor(self.accent)
            .padding(.leading, -15)
      }.frame(minWidth: 70, maxWidth: 70, alignment: .center)
   }
   
}

struct PulseLabelMin: View {
   
   let accent: Color
   let minutes: Text
   
   var body: some View {
      HStack(spacing: 2) {
          Pulse(size: 20, accent: self.accent)
          Spacer()
          minutes
              .font(Font.system(size: 16, weight: .medium, design: .default) )
            .bold()
            .kerning(-0.2)
            .lineLimit(1)
            .foregroundColor(self.accent)
            .padding(.leading, -15)
          Spacer()
              .frame(width:7.5)
          Text("min")
              .font(Font.system(size: 16, weight: .medium, design: .default) )
              .bold()
              .lineLimit(1)
              .foregroundColor(self.accent)
              .kerning(-0.2)
              .allowsTightening(true)
              .padding(.leading, -9)
      }.frame(minWidth: 70, maxWidth: 70, alignment: .center)
   }
   
}



struct Pulse: View {
   
   let speed: Double = 3
   
   let size: CGFloat
   let accent: Color
   
   @State var scale: Double = 0.0
   @State var opacity: Double = 0.8
   
   
   var body: some View {
      ZStack {
         Circle()
            .scale(scale)
            .fill(accent)
            .opacity(opacity)
         Circle()
            .fill(accent)
            .frame(width: size/4, height: size/4, alignment: .center)
      }
      .frame(width: size, height: size, alignment: .center)
      .onAppear {
         withAnimation(.easeOut(duration: speed).repeatForever(autoreverses: false)) {
            scale = 1.0
         }
         withAnimation(.easeIn(duration: speed).repeatForever(autoreverses: false)) {
            opacity = 0.0
         }
      }
   }
   
}
