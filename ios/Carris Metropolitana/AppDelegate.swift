//
//  AppDelegate.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 18/07/2024.
//

import SwiftUI
import FirebaseCore
import FirebaseMessaging
import UserNotifications

import React
import React_RCTAppDelegate

class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        FirebaseApp.configure()
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
        }
        
        UNUserNotificationCenter.current().delegate = self
        Messaging.messaging().delegate = self
        
        self.automaticallyLoadReactNativeWindow = false
        
        super.application(application, didFinishLaunchingWithOptions: launchOptions)
        
        return true
    }
    
    override func sourceURL(for bridge: RCTBridge) -> URL? {
        self.bundleURL()
    }
    
    override func bundleURL() -> URL? {
        #if DEBUG
            RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
            Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
    
    
    override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let tokenString = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        print("Device push notification (APNs) token: \(tokenString)")
        
    }
    
    override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed to register for remote notifications: \(error)")
    }
    
    @objc func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("Received FCM token: \(String(describing: fcmToken))")
        messaging.subscribe(toTopic: "cm.everyone") // general topic for broadcasting messages to every user
    }
    
    // Show native notification with app open
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.alert, .sound, .badge])
    }
    
//    private func setupNetworkMonitoring() {
//       NotificationCenter.default.addObserver(self, selector: #selector(networkStatusChanged), name: .networkStatusChanged, object: nil)
//   }
//    
//    @objc private func networkStatusChanged() {
//        if NetworkMonitor.shared.isConnected {
//            print("Back up online")
//        } else {
//            print("Went offline")
//        }
//    }
       
}
