//
//  UnregisteredUserView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/03/2024.
//

import SwiftUI
import AVKit

struct UnregisteredUserView: View {
    @State private var player = AVPlayer(url:  URL(string: "https://www.tmlmobilidade.pt/wp-content/uploads/2022/02/Untitled-1.mp4")!)
    
    @State var isSheetOpen = false
    
    @AppStorage("onboarded") var onboarded: Bool = false
    
    
    let onAddFavoritesButtonClick: () -> Void
    
    var body: some View {
        let playerController = VideoPlayerViewController(player: self.player)
        ScrollView {
            VStack(alignment: .center, spacing: 30) {
                Text("A Carris Metropolitana está mais próxima", comment: "Ecrã inicial")
                    .font(.title)
                    .bold()
                    .padding(.horizontal, 20)
                
    //            Image(uiImage: playerController.player.generateThumbnail(time: player.currentTime())!)
    //                .resizable()
    //                .aspectRatio(contentMode: .fit)
    //                .frame(width: 250, height: 150)
                
    //            RoundedRectangle(cornerRadius: 15)
    //                .fill(.cmYellow.gradient)
    //                .frame(width: 250, height: 150)
    //                .overlay {
    //                    
    //                }
                
                    
//                            ZStack {
//    //                            ConditionallyHiddenView(hidden: playerController.player.timeControlStatus != AVPlayer.TimeControlStatus.playing) {
//                                    playerController
//                                    .scaleEffect(1.2)
//                                    //                                .clipShape(RoundedRectangle(cornerRadius: 15))
//                                    //                    .aspectRatio(contentMode: .fill)
//                                    //                                .frame(width: 300, height: 150)
//    //                                    .hidden()// TODO: fixme, if visible will hide status bar, probably something to do with the modal (hidden works)
//    //                            }
//                                
//                                // TODO: the player does not show controls because the zstack has a gesture listener attached, tap never gets to it. smart idea :) looks great and preserves thumbnail
//    //                            Image(uiImage: playerController.player.generateThumbnail(time: CMTime(seconds: 34, preferredTimescale: 60000))!)
//    //                                .resizable()
//    //                                .aspectRatio(contentMode: .fill)
//    ////                                .clipShape(RoundedRectangle(cornerRadius: 15))
//    ////                                .frame(width: 300, height: 150)
//                                    
//                                Circle()
//                                    .padding(45)
//                                    .foregroundStyle(.regularMaterial)
//                                    .overlay {
//                                        Image(systemName: "play.fill")
//                                            .font(.largeTitle)
//                                            .foregroundStyle(.white)
//                                    }
//                            }
//                            .clipShape(RoundedRectangle(cornerRadius: 15))
//                            .frame(width: 300, height: 150)
//                            .shadow(color: .black.opacity(0.1), radius: 20)
//                            .onTapGesture {
//                                do {
//                                    try AVAudioSession.sharedInstance().setCategory(.playback) // this plays the audio as audio from video playback in order to not depend from the ringer status (ringer switch)
//                                } catch {
//                                    print("Error setting AudioSession Category to Playback.")
//                                }
//                                playerController.enterFullscreen()
//                                playerController.player.play()
//                            }
                
                Text("Personalize a app com as suas linhas e paragens favoritas.", comment: "Ecrã inicial")
                    .font(.headline)
                    .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                    .padding(.horizontal, 30)
                Text("Saiba exatamente onde andam todos os autocarros e exatamente quando chegam à sua paragem.", comment: "Ecrã inicial")
                    .font(.callout)
                    .fontWeight(.semibold)
                    .padding(.horizontal, 50)
                Group {
//                    Button {
//                        isSheetOpen.toggle()
//                    } label: {
//                        Text("Login com navegante®")
//                            .font(.title2)
//                            .fontWeight(.semibold)
//                            .foregroundColor(.black)
//                            .padding(.horizontal, 40)
//                            .padding(.vertical, 7)
//                    }
//                    .buttonStyle(.borderedProminent)
//                    .foregroundStyle(.black)
//                    .tint(.cmYellow)
//                    .cornerRadius(15)
//                    .padding(.top, 30)
                    
                    Button {
//                        isSheetOpen.toggle()
                        onAddFavoritesButtonClick()
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                            onboarded = true
                        }
                    } label: {
                        Text("Adicionar favoritos", comment: "Botão no ecrã inicial")
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(.black)
                            .padding(.horizontal, 40)
                            .padding(.vertical, 7)
                    }
                    .buttonStyle(.borderedProminent)
                    .foregroundStyle(.black)
                    .tint(.cmYellow)
                    .cornerRadius(15)
                    .padding(.top, 30)
                    
                    Text("Boas viagens!", comment: "Ecrã inicial")
                        .bold()
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .offset(y: -15)
                        .padding(.horizontal, 20)
                }
                Spacer()
            }
            .multilineTextAlignment(.center)
            .padding(.top, 40)
        }
//        .sheet(isPresented: $isSheetOpen) {
//            LoginSheetView()
//                .presentationDragIndicator(.visible)
//        }
    }
}

struct ConditionallyHiddenView<Content: View>: View {
    let content: Content
    let hidden: Bool

    init(hidden: Bool = false, @ViewBuilder content: () -> Content) {
        self.hidden = hidden
        self.content = content()
    }

    var body: some View {
        hidden ? content.hidden() as! Content : content
    }
}


#Preview {
    UnregisteredUserView(onAddFavoritesButtonClick: {})
}
