//
//  ImageViewer.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 24/06/2024.
//

import SwiftUI

struct ImageViewerModifier: ViewModifier {
    @Binding var isPresented: Bool
    var image: Image

    func body(content: Content) -> some View {
        content
            .onTapGesture {
                withAnimation {
                    isPresented = true
                }
            }
            .fullScreenCover(isPresented: $isPresented) {
                ImageViewer(image: image, isPresented: $isPresented)
            }
    }
}

extension View {
    func imageViewer(isPresented: Binding<Bool>, image: Image) -> some View {
        self.modifier(ImageViewerModifier(isPresented: isPresented, image: image))
    }
}

struct ImageViewer: View {
    var image: Image
    @Binding var isPresented: Bool
    
    @State private var scale: CGFloat = 1.0
    @State private var offset: CGSize = .zero
    
    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)
            
            image
                .resizable()
                .aspectRatio(contentMode: .fit)
                .scaleEffect(scale)
                .offset(offset)
                .gesture(MagnificationGesture()
                            .onChanged { value in
                                scale = value.magnitude
                            }
                            .onEnded { value in
                                withAnimation(.spring()) {
                                    scale = 1.0
                                }
                            }
                )
                .gesture(DragGesture()
                            .onChanged { value in
                                offset = value.translation
                            }
                            .onEnded { value in
                                if abs(value.translation.height) > 100 {
                                    withAnimation {
                                        isPresented = false
                                    }
                                } else {
                                    withAnimation(.spring()) {
                                        offset = .zero
                                    }
                                }
                            }
                )
        }
        .onTapGesture {
            withAnimation {
                isPresented = false
            }
        }
    }
}

struct TestView: View {
    @State private var isImageViewerPresented = false
    var body: some View {
        VStack {
            Image(.cmLogoWhite)
                .resizable()
                .scaledToFit()
                .frame(width: 200, height: 200)
                .imageViewer(isPresented: $isImageViewerPresented, image: Image(.cmLogoWhite))
        }
    }
}

#Preview {
    VStack {
        TestView()
    }
}
