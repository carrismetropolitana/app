//
//  ENCMView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 16/03/2024.
//

import SwiftUI
import WebKit

struct ENCMView: View {
    @Environment(\.openURL) private var openURL
    
    var body: some View {
        ENCMWebView(onExternalURLOpen: { url in
            openURL(url)
        })
        .background(.cmSystemBackground200)
        .navigationTitle("Espaços navegante®")
        .navigationBarTitleDisplayMode(.inline)
    }
}


#Preview {
    ENCMView()
}


struct ENCMWebView: UIViewRepresentable {
    let url: URL = URL(string: "https://cmet.pt/app-ios/stores?locale=\(Locale.current.language.languageCode?.identifier ?? "pt")")!
    let onExternalURLOpen: (_ externalURL : URL) -> Void

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.underPageBackgroundColor = .clear
        
        let request = URLRequest(url: url)
        webView.load(request)
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: ENCMWebView
        
        init(_ parent: ENCMWebView) {
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
    }
}
