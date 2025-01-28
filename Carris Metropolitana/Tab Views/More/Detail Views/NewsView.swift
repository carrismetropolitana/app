//
//  NewsView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 31/05/2024.
//

import SwiftUI
import UIKit

// TODO: work on the header constraints -- stuff is moving where it shouldnt on smaller devices. fix (literally) header btns position
struct NewsView: View {
    @EnvironmentObject var alertsManager: AlertsManager
    
    // ios15 and up @Environment(\.dismiss) private var dismiss // this is really fucking cool
    @Environment(\.presentationMode) var presentationMode
    @State private var webViewScrollOffset: CGPoint = .zero
    
    let news: News
    let newsImageURL: URL
    
    let headerStartingHeight: CGFloat = 350
    let headerMininumHeight: CGFloat = 250
    
    var drag: some Gesture {
            DragGesture()
            .onChanged({gesture in
                    if gesture.startLocation.x < CGFloat(100.0) {
                        print("edge pan, offset \(gesture.translation.width), \(gesture.translation.height)")
                    }
                 })
        }
    
    var body: some View {
        ZStack(alignment: .top) {
            Rectangle()
                .fill(.cmYellow.gradient)
                .edgesIgnoringSafeArea(.top)
                .frame(height: getHeaderHeightForWebViewScrollOffset(offset: webViewScrollOffset.y))
                .overlay {
                    VStack(spacing: 5.0) {
                        HStack {
                            Button {
                                presentationMode.wrappedValue.dismiss()
                            } label: {
                                RoundHeaderButtonView(imageSystemName: "chevron.left")
                                    .frame(width: 32, height: 32)
                            }
                            .buttonStyle(.plain)
                            Spacer()
                            
                            ShareLink(item: URL(string: news.link)!) {
                                RoundHeaderButtonView(imageSystemName: "square.and.arrow.up")
                                    .frame(width: 32, height: 32)
                            }
                            .buttonStyle(.plain)
                        }
                        .padding(.horizontal)
                        Spacer()
                        AsyncImage(url: newsImageURL) { image in
                            image
                                .image?.resizable()
                                .scaledToFit()
                                .clipShape(RoundedRectangle(cornerRadius: 15.0))
                                .shadow(color: .black.opacity(0.1), radius: 10.0)
                        }
                        .padding(.horizontal, 20.0)
                        .padding(.bottom, getBottomPaddingForWebViewScrollOffset(offset: webViewScrollOffset.y))
                        Text(news.title.rendered)
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .bold()
//                            .padding(.top, 30.0)
                            .padding(.horizontal, 10.0)
                        if let formattedDate = formatDateString(news.dateGmt) {
                            Text(formattedDate)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.bottom)
                }
                .zIndex(1)
            WebView(url: URL.init(string: news.link)!, onLoadFailureErrorMessage: "Ocorreu um erro ao carregar a notícia.", onRedirectToNative: { redirect in
                if redirect.type == .alert && alertsManager.alerts.contains(where: {$0.id == redirect.id}) {
                    print("Would natively display alert \(redirect.id) because it exists in current feed")
                }
            }, scrollOffset: $webViewScrollOffset)
            .offset(y: getHeaderHeightForWebViewScrollOffset(offset: webViewScrollOffset.y))
            .padding(.bottom, 100)
            .handleOpenURLInApp()
        }
        .navigationBarBackButtonHidden(true)
//        .gesture(drag)
    }
    
    func getHeaderHeightForWebViewScrollOffset(offset: CGFloat) -> CGFloat {
        if (offset >= headerMininumHeight) {
            return headerStartingHeight - headerMininumHeight
        }
        
        print("HS-HM", headerStartingHeight - headerMininumHeight)
        
        print("HS-OF", headerStartingHeight - offset)
        
        return headerStartingHeight - offset
    }
    
    func getBottomPaddingForWebViewScrollOffset(offset: CGFloat) -> CGFloat {
        return getHeaderHeightForWebViewScrollOffset(offset: offset) / 15
    }
}

struct RoundHeaderButtonView: View {
    @Environment(\.colorScheme) var colorScheme
    let imageSystemName: String
    
    var body: some View {
        ZStack {
            Circle()
                .fill(Color(white: colorScheme == .dark ? 0.19 : 0.93))
                .opacity(0.5)
            Image(systemName: imageSystemName)
                .resizable()
                .scaledToFit()
                .font(Font.body.weight(.bold))
                .scaleEffect(0.416)
                .foregroundColor(Color(white: colorScheme == .dark ? 0.62 : 0.51))
        }
    }
}

//struct DraggableCardModifier: ViewModifier {
//    @State private var offset = CGSize.zero
//    @State private var isDragging = false
//    var dismissDragThreshold: CGFloat
//
//    func body(content: Content) -> some View {
//        let rotationAngle = Angle(degrees: Double(offset.width / 10)) // Adjust the divisor for sensitivity
//        
//        return content
//            .offset(x: offset.width, y: offset.height)
//            .rotationEffect(rotationAngle)
//            .animation(.interactiveSpring(), value: offset)
//            .gesture(
//                DragGesture()
//                    .onChanged { gesture in
//                        offset = gesture.translation
//                        isDragging = true
//                    }
//                    .onEnded { gesture in
//                        if abs(offset.width) > dismissDragThreshold || abs(offset.height) > dismissDragThreshold {
//                            // Dismiss the view
//                            withAnimation {
//                                offset = CGSize(width: gesture.translation.width * 5, height: gesture.translation.height * 5)
//                            }
//                        } else {
//                            // Return to original position
//                            withAnimation {
//                                offset = .zero
//                            }
//                        }
//                        isDragging = false
//                    }
//            )
//    }
//}

struct DraggableCardModifier: ViewModifier {
    @State private var offset = CGSize.zero
    @State private var isDragging = false
    var dismissDragThreshold: CGFloat
    var velocityThreshold: CGFloat
    var onDismiss: () -> Void

    func body(content: Content) -> some View {
        let rotationAngle = Angle(degrees: Double(offset.width / 10)) // Adjust the divisor for sensitivity

        return content
            .offset(x: offset.width, y: offset.height)
            .rotationEffect(rotationAngle)
            .animation(.interactiveSpring(), value: offset)
            .gesture(
                DragGesture()
                    .onChanged { gesture in
                        offset = gesture.translation
                        isDragging = true
                    }
                    .onEnded { gesture in
                        let dragVelocity = gesture.predictedEndLocation.distance(to: gesture.location) / gesture.time.timeIntervalSinceNow.magnitude
                        let screenSize = UIScreen.main.bounds.size
                        
                        if abs(offset.width) > dismissDragThreshold ||
                            abs(offset.height) > dismissDragThreshold ||
                            dragVelocity > velocityThreshold {
                            // Dismiss the view with animation
                            withAnimation(.easeOut(duration: 0.5)) {
                                offset = CGSize(
                                    width: gesture.translation.width > 0 ? screenSize.width : -screenSize.width,
                                    height: gesture.translation.height > 0 ? screenSize.height : -screenSize.height
                                )
                            }
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                                onDismiss()
                            }
                        } else {
                            // Return to original position
                            withAnimation(.easeOut) {
                                offset = .zero
                            }
                        }
                        isDragging = false
                    }
            )
    }
}

extension View {
    func draggableCard(dismissDragThreshold: CGFloat, velocityThreshold: CGFloat, onDismiss: @escaping () -> Void) -> some View {
        self.modifier(DraggableCardModifier(dismissDragThreshold: dismissDragThreshold, velocityThreshold: velocityThreshold, onDismiss: onDismiss))
    }
}

extension CGPoint {
    func distance(to point: CGPoint) -> CGFloat {
        let dx = point.x - x
        let dy = point.y - y
        return sqrt(dx*dx + dy*dy)
    }
}


//struct TestStaticCollapsedHeader: View {
//    var body: some View {
//        VStack {
//            Rectangle()
//                .fill(.cmYellow.gradient)
//                .edgesIgnoringSafeArea(.top)
//                .frame(height: 80)
//                .overlay {
//                    HStack {
//                        BackButtonView()
//                            .frame(width: 32, height: 32)
////                        AsyncImage(url: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/02/Artes-_-3028-Circular-Lazarim_Banner.png")) { image in
////                            image
////                                .image?.resizable()
////                                .scaledToFit()
////                                .clipShape(RoundedRectangle(cornerRadius: 15.0))
////                                .shadow(color: .black.opacity(0.1), radius: 10.0)
////                        }
////                        .padding(.horizontal)
////                        .frame(height: 50)
//                        Text("Almada: Nova linha circular 3028 Lazarim | Circular a partir do dia 1 de março")
//                            .frame(height: 50.0)
//                            .bold()
//                        Spacer()
//                    }
//                    .padding(.horizontal)
//                }
//            Spacer()
//        }
//    }
//}

#Preview {
    NewsView(news: News(id: 1, date: "2024-06-10T10:40:09", dateGmt: "2024-06-10T11:40:09", modified: "", modifiedGmt: "", slug: "", status: "", type: "", link: "https://www.carrismetropolitana.pt/noticias/area-3-novo-percurso-e-reforco-de-horario-em-duas-linhas-de-almada/", title: HasRenderedValue(rendered: "Área 3 | Novo percurso e reforço de horário em duas linhas de Almada"), featuredMedia: 2), newsImageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/03/3004-e-3702-_-Abr24_banner.png")!)
//    TestStaticCollapsedHeader()
}


func formatDateString(_ dateString: String) -> String? {
    let dateFormatterGet = DateFormatter()
    dateFormatterGet.dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
    
    let dateFormatterPrint = DateFormatter()
    dateFormatterPrint.dateFormat = "dd-MM-yyyy 'às' HH:mm"
    
    if let date = dateFormatterGet.date(from: dateString) {
        return dateFormatterPrint.string(from: date)
    } else {
        return nil
    }
}
