//
//  AllAlertsView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 09/11/2024.
//

// TODO: Move this file somewhere else
import SwiftUI
@preconcurrency import WebKit

struct AllAlertsView: View {
    @Environment(\.presentationMode) var presentationMode
    
    @State private var imageViewerSheetPresented = false
    @State private var imageUrlToBePresented: URL? = nil
    
    var body: some View {
//        NavigationStack {
//            VStack {
//                Text("Alerts")
//            }
//            .navigationTitle("Alertas de serviço")
//        }
        ZStack {
            AlertsWebView(onExternalURLOpen: {url in}, imageUrlToBePresented: $imageUrlToBePresented)
            .padding(.top)
            .background(.cmSystemBackground200)
            
            VStack {
                HStack {
                    Spacer()
                    Button {
                        presentationMode.wrappedValue.dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(Color.secondary)
                            .font(.system(size: 25))
                            .opacity(0.8)
                    }
                }
                Spacer()
            }
            .padding(20)
        }
        .onChange(of: imageUrlToBePresented) {
            if let _ = imageUrlToBePresented {
                imageViewerSheetPresented = true
            }
        }
        .sheet(isPresented: $imageViewerSheetPresented) {
            if let imageUrlToBePresented {
                let imageAttachment = MediaAttachment(
                    id: imageUrlToBePresented.relativePath,
                    type: "image",
                    url: imageUrlToBePresented,
                    previewUrl: nil,
                    description: nil,
                    meta: nil)
                MediaUIView(selectedAttachment: imageAttachment, attachments: [imageAttachment])
                    .presentationDragIndicator(.visible)
            }
        }
    }
}
struct AlertsWebView: UIViewRepresentable {
    let url: URL = URL(string: "https://cmet.pt/app-ios/alerts?locale=\(Locale.current.language.languageCode?.identifier ?? "pt")")!
    let onExternalURLOpen: (_ externalURL : URL) -> Void
    
    @Binding var imageUrlToBePresented: URL?

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        let contentController = WKUserContentController()
        
        contentController.add(context.coordinator, name: "onImageClick")
        configuration.userContentController = contentController
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.underPageBackgroundColor = .clear
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        
        let request = URLRequest(url: url)
        webView.load(request)
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
    }
    
    func setImageUrlToBePresented(imageUrl: URL) {
        print("setting image url to be presented, \(imageUrl)")
        imageUrlToBePresented = imageUrl
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        var parent: AlertsWebView
        
        init(_ parent: AlertsWebView) {
            self.parent = parent
        }
        
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url, url != parent.url {
                self.parent.onExternalURLOpen(url)
                decisionHandler(.cancel)
            } else {
                decisionHandler(.allow)
            }
        }
        
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "onImageClick" {
                if let messageBody = message.body as? String, let imageUrl = URL(string: messageBody) {
                    parent.setImageUrlToBePresented(imageUrl: imageUrl)
                }
            }
        }
    }
}


#Preview {
    VStack {
        Text("Hello")
    }
        .sheet(isPresented: .constant(true)) {
            AllAlertsView()
        }
}
