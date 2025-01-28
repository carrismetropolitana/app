//
//  ErrorView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 04/07/2024.
//

import SwiftUI

struct ErrorBanner: View {
    let title: String
    let message: String
    var body: some View {
        HStack(spacing: 15.0) {
            Image(systemName: "exclamationmark.triangle.fill")
                .scaleEffect(1.2)
            VStack(alignment: .leading) {
                Text(title.count > 0 ? title : "Ocorreu um erro desconhecido.")
                    .font(.headline)
                if message.count > 0 {
                    Text(message)
                }
            }
            Spacer()
        }
        .foregroundStyle(.black.opacity(0.7))
        .padding()
        .background(.red)
        .cornerRadius(10.0)
    }
}

struct ErrorBannerModifier: ViewModifier {
    @Binding var isPresented: Bool
    @Binding var title: String
    @Binding var message: String
    
    func body(content: Content) -> some View {
        ZStack {
            content
            if isPresented {
                VStack {
                    ErrorBanner(title: title, message: message)
                    Spacer()
                }
                .zIndex(1) // oh my god (https://stackoverflow.com/a/58512696/13329919)
                .padding(.horizontal, 10)
                .animation(.snappy)
                .transition(.move(edge: .top).combined(with: .opacity))
//                .onTapGesture {
//                    withAnimation {
//                        self.isPresented = false
//                    }
//                }
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged({_ in 
                            withAnimation {
                                self.isPresented = false
                            }
                        })
                )
                .onAppear { // TODO: this doesnt get called if isPresented changes before it disappears so simetimes it just stays there and does not go away automatically
                    print("appeared")
                    DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                        withAnimation {
                            self.isPresented = false
                        }
                    }
                }
            }
        }
    }
}


extension View {
    func errorBanner(isPresented: Binding<Bool>, title: Binding<String>, message: Binding<String>) -> some View {
        self.modifier(ErrorBannerModifier(isPresented: isPresented, title: title, message: message))
    }
}

struct ErrorBannerDemo: View {
    @State private var isPresented = false
    @State private var errorTitle = ""
    @State private var errorMessage = ""
    var body: some View {
        VStack {
            Button("Show error") {
                errorTitle = "O veículo não está disponível."
                errorMessage = "Por favor tente mais tarde."
                isPresented = true
            }
        }
        .errorBanner(isPresented: $isPresented, title: $errorTitle, message: $errorMessage)
    }
}


#Preview {
    ErrorBannerDemo()
}
