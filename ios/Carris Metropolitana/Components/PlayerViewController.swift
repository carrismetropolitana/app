//
//  PlayerViewController.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/03/2024.
//

import AVKit
import SwiftUI

class CustomAVPlayerViewController: AVPlayerViewController { // status bar disappears like i thought because os video playback being preferrably full screen, override those properties here
    override var prefersStatusBarHidden: Bool {
        return false
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .darkContent
    }
}

struct VideoPlayerViewController: UIViewControllerRepresentable {
//    var videoURL: URL?
    var player: AVPlayer

//    private var player: AVPlayer {
//        return AVPlayer(url: videoURL!)
//    }
    
    
    private let controller = CustomAVPlayerViewController()

    func makeUIViewController(context: Context) -> AVPlayerViewController {
//        controller.modalPresentationStyle = .automatic
        
        controller.entersFullScreenWhenPlaybackBegins = true
        controller.exitsFullScreenWhenPlaybackEnds = true
//        controller.showsPlaybackControls = false
        
//        controller.enterFullscreen()
        
        controller.player = player
//        controller.player?.play()
        
        return controller
    }

    func updateUIViewController(_ playerController: AVPlayerViewController, context: Context) {}
    
    func play() {
        controller.player?.play()
    }
    
    func enterFullscreen() {
        controller.enterFullscreen()
    }
}

extension AVPlayer {
    func generateThumbnail(time: CMTime) -> UIImage? {
        guard let asset = currentItem?.asset else { return nil }
        let imageGenerator = AVAssetImageGenerator(asset: asset)
        
        do {
            let cgImage = try imageGenerator.copyCGImage(at: time, actualTime: nil)
            return UIImage(cgImage: cgImage)
        } catch {
            print(error.localizedDescription)
        }
        
        return nil
    }
}

extension AVPlayerViewController {
    func enterFullscreen() {
        let selectorName: String = {
            if #available(iOS 11.3, *) {
//                return String(data: Data(base64Encoded: "X3RyYW5zaXRpb25Ub0Z1bGxTY3JlZW5BbmltYXRlZDppbnRlcmFjdGl2ZTpjb21wbGV0aW9uSGFuZGxlcjo=")!, encoding: .utf8)
                return "_transitionToFullScreenAnimated:interactive:completionHandler:" // X3RyYW5zaXRpb25Ub0Z1bGxTY3JlZW5BbmltYXRlZDppbnRlcmFjdGl2ZTpjb21wbGV0aW9uSGFuZGxlcjo=
            } else if #available(iOS 11, *) {
//                return String(data: Data(base64Encoded: "X3RyYW5zaXRpb25Ub0Z1bGxTY3JlZW5BbmltYXRlZDpjb21wbGV0aW9uSGFuZGxlcjo=")!, encoding: .utf8)
                return "_transitionToFullScreenAnimated:completionHandler:" // X3RyYW5zaXRpb25Ub0Z1bGxTY3JlZW5BbmltYXRlZDpjb21wbGV0aW9uSGFuZGxlcjo=
            } else {
//                return String(data: Data(base64Encoded: "X3RyYW5zaXRpb25Ub0Z1bGxTY3JlZW5WaWV3Q29udHJvbGxlckFuaW1hdGVkOmNvbXBsZXRpb25IYW5kbGVyOg==")!, encoding: .utf8)
                return "_transitionToFullScreenViewControllerAnimated:completionHandler:" // X3RyYW5zaXRpb25Ub0Z1bGxTY3JlZW5WaWV3Q29udHJvbGxlckFuaW1hdGVkOmNvbXBsZXRpb25IYW5kbGVyOg==
            }
        }()
        let selectorToForceFullScreenMode = NSSelectorFromString(selectorName)

        if self.responds(to: selectorToForceFullScreenMode) {
            self.perform(selectorToForceFullScreenMode, with: true, with: nil)
        }
    }
}
