//
//  WebView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 31/05/2024.
//

import SwiftUI
import WebKit

struct WebViewRedirectableToNative: Equatable {
    let type: WebViewRedirectablesToNative
    let id: String
    
    enum WebViewRedirectablesToNative {
        case line, alert, stop
    }
}

// Delegate
class WebViewCoordinator: NSObject, WKNavigationDelegate, UIScrollViewDelegate {
    var parent: UKWebView
    
    init(parent: UKWebView) {
        self.parent = parent
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Handle successful load
//        webView.evaluateJavaScript("document.documentElement.scrollHeight", completionHandler: { (height, error) in
//            DispatchQueue.main.async {
//                self.parent.dynamicHeight = height as! CGFloat
//            }
//        })
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        // Handle navigation failure
        DispatchQueue.main.async {
            self.parent.isLoadingSuccessful = false
        }
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        // Handle provisional navigation failure
        DispatchQueue.main.async {
            self.parent.isLoadingSuccessful = false
        }
    }
    
    // avoid conflict with function which would have same selector by supplying selector manually
    @objc(webView:decidePolicyForNavigationResponse:decisionHandler:)
    func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        if let response = navigationResponse.response as? HTTPURLResponse {
            if response.statusCode != 200 {
                // Handle HTTP error codes
                DispatchQueue.main.async {
                    self.parent.isLoadingSuccessful = false
                }
            } else {
                DispatchQueue.main.async {
                    self.parent.isLoadingSuccessful = true
                }
            }
        }
        decisionHandler(.allow)
    }
    
    // avoid conflict with function which would have same selector by supplying selector manually
    @objc(webView:decidePolicyForNavigationAction:decisionHandler:)
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
          guard let urlString = navigationAction.request.url?.absoluteString.lowercased() else {
              return
          }
        
        print(urlString)
        if navigationAction.navigationType == .linkActivated {
            if (urlString.hasPrefix("https://www.carrismetropolitana.pt/alert/")) {
                let parts = urlString.components(separatedBy: "/alert/")
                
                if let lastPart = parts.last {
                    let alertId = lastPart.replacingOccurrences(of: "[^0-9]", with: "", options: .regularExpression)
                    print("Would natively display alert \(alertId)")
                    
                    self.parent.redirectsTo = WebViewRedirectableToNative(type: .alert, id: alertId)
                } else {
                    print("No forward slash found in the string")
                }
                decisionHandler(.cancel)
            } else if let url =  navigationAction.request.url {
                // TODO: open SFSafariView or just open url in browser
                    decisionHandler(.cancel)
                self.parent.externalUrlToOpen = url
            }
        } else {
            decisionHandler(.allow)
        }
     }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        parent.scrollOffset = scrollView.contentOffset
    }
}

struct UKWebView: UIViewRepresentable {
    let url: URL
//    @Binding var dynamicHeight: CGFloat
    @Binding var scrollOffset: CGPoint
    @Binding var isLoadingSuccessful: Bool
    @Binding var redirectsTo: WebViewRedirectableToNative?
    @Binding var externalUrlToOpen: URL?
    
    func makeCoordinator() -> WebViewCoordinator {
        WebViewCoordinator(parent: self)
    }

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.isOpaque = false
        webView.navigationDelegate = context.coordinator
        webView.scrollView.delegate = context.coordinator
        
        
        let request = URLRequest(url: url)
        webView.load(request)
            
        if (self.url.absoluteString.contains("carrismetropolitana.pt")) {
            // JavaScript to remove elements with the class "main-header"
            let script = """
               var headerElement = document.getElementsByClassName('main-header')[0];
               if (headerElement) {
                    headerElement.parentNode.removeChild(headerElement);
                }
               // Remove the element with the id "site-footer"
               var footerElement = document.getElementById('site-footer');
               if (footerElement) {
                   footerElement.parentNode.removeChild(footerElement);
               }
            
            
            var titleElement = document.getElementsByTagName('h1')[0];
            if (titleElement) {
                titleElement.parentNode.removeChild(titleElement);
            }
            """
            
            // Create a user script with the above JavaScript
            let userScript = WKUserScript(source: script, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
            
            // Add the user script to the web view's user content controller
            webView.configuration.userContentController.addUserScript(userScript)
            
        }
            return webView
        }
    
    func updateUIView(_ webView: WKWebView, context: Context) { // gets called on render, binding change was obviously triggering it and as such, a refresh
    }
}

struct WebView: View {
    @Environment(\.openURL) private var openURL
    
    let url: URL
    let onLoadFailureErrorMessage: String
    let onRedirectToNative: (_ redirect: WebViewRedirectableToNative) -> Void
    @State private var isLoadingSuccessful = true
    @State private var webViewRedirectsTo: WebViewRedirectableToNative? = nil
    @Binding var scrollOffset: CGPoint
    @State private var externalUrlToOpen: URL? = nil
//    @State private var webViewHeight: CGFloat = .zero
    
    var body: some View {
        VStack {
            if isLoadingSuccessful {
                UKWebView(url: url, scrollOffset: $scrollOffset, isLoadingSuccessful: $isLoadingSuccessful, redirectsTo: $webViewRedirectsTo, externalUrlToOpen: $externalUrlToOpen)
//                    .frame(height: webViewHeight)
                    .edgesIgnoringSafeArea(.all)
            } else {
                Text(onLoadFailureErrorMessage) // TODO: Beautify
                    .foregroundColor(.red)
                    .padding()
            }
        }
        .onChange(of: webViewRedirectsTo) {
            if let redirect = webViewRedirectsTo {
                onRedirectToNative(redirect)
                print("Received req to redirect to native, type: \(redirect.type), id: \(redirect.id)")
            }
        }
        .onChange(of: externalUrlToOpen) {
            if let url = externalUrlToOpen {
                openURL(url)
            }
        }
    }
}


#Preview {
    WebView(url: URL.init(string: "https://httpstat.us/520")!, onLoadFailureErrorMessage: "Ocorreu um erro ao carregar a notícia.", onRedirectToNative: {redirect in print(redirect)}, scrollOffset: .constant(.zero))
}
