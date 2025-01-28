//
//  NotificationService.swift
//  NotificationServiceExtension
//
//  Created by João Pereira on 18/07/2024.
//

import UserNotifications
import FirebaseMessaging

class NotificationService: UNNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
        
        if let bestAttemptContent = bestAttemptContent {
            Messaging.serviceExtension().populateNotificationContent(bestAttemptContent, withContentHandler: contentHandler)
            
            if let groupUserDefaults = UserDefaults(suiteName: "group.pt.carrismetropolitana.app") {
                let currentBadgeCount = groupUserDefaults.integer(forKey: "badgeCount")
                
                if let remoteBadgeCount = bestAttemptContent.badge {
                    groupUserDefaults.set(Int(truncating: remoteBadgeCount), forKey: "badgeCount")
                    // will be handled automatically and will override any value set by the app so no point in setting the badge ourselves
                } else if currentBadgeCount > 0 {
                    groupUserDefaults.set(currentBadgeCount + 1, forKey: "badgeCount")
                    UNUserNotificationCenter.current().setBadgeCount(currentBadgeCount + 1)
                } else {
                    groupUserDefaults.set(1, forKey: "badgeCount")
                    UNUserNotificationCenter.current().setBadgeCount(1)
                }
            }
        }
    }
    
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }

}
