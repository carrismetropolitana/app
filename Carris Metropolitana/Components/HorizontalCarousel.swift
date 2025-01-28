//
//  HorizontalCarousel.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 23/09/2024.
//

import SwiftUI

enum ContentType {
    case news, alert
}
struct CarouselItem {
    let contentId: Int
    let contentType: ContentType
    let contentTitle: String?
    let imageURL: URL
}

struct HorizontalCarousel: View {
    let items: [CarouselItem]
    let onItemClick: (_ item: CarouselItem) -> Void
    
    @State private var scrollPosition: Int? = 0
    
    @State private var timer: Timer?
    @State private var autoPlayDebounceTimer: Timer?
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(items.indices, id: \.self) { itemIndex in
                    let item = items[itemIndex]
                    AsyncImage(url: item.imageURL) {
                        image in image.resizable().aspectRatio(contentMode: .fit)
                    } placeholder: {
                        RoundedRectangle(cornerRadius: 15.0)
                            .fill(.quaternary)
                            .frame(height: 200)
                            .blinking()
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 15.0))
                    .onTapGesture {
                        onItemClick(item)
                    }
                    .containerRelativeFrame(.horizontal)
                    .accessibilityLabel(Text("Notícia \(itemIndex+1) de \(items.count)."))
                    .accessibilityValue(Text("Título da notícia: \(item.contentTitle ?? "sem título")"))
                    .accessibilityHint("Passe com um dedo para a direita para ver a notícia seguinte. Toque duplo para abrir a notícia.")
                    .accessibilityHidden(false)
                }
            }
            .scrollTargetLayout()
        }
//        .accessibilityScrollAction({ edge in
//            switch edge {
//            case .leading:
//                scrollPosition = max(0, scrollPosition! - 1)
//            case .trailing:
//                scrollPosition = min(scrollPosition! + 1, items.count - 1)
//            default:
//                ""
//            }
//        })
        
        // iOS 18 modifier...
//        .onScrollPhaseChange { oldPhase, newPhase in
//            if newPhase == .interacting {
//
//            } else if newPhase == .idle {
//                
//            }
//        }
        
        .scrollPosition(id: $scrollPosition)
        .scrollTargetBehavior(.viewAligned)
        .safeAreaPadding(.horizontal)
        // For now, disable auto play on the carousel
//        .onAppear {
//            timer = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { _ in
//                print("will scroll to \(scrollPosition! + 1)")
//                if (scrollPosition! + 1 < items.count) {
//                    withAnimation {
//                        scrollPosition! += 1
//                    }
//                } else {
//                    withAnimation {
//                        scrollPosition = 0
//                    }
//                }
//            }
//        }
//        .onDisappear {
//            timer?.invalidate()
//            timer = nil
//        }
    }
}


let dummyCarouselItems = [
    CarouselItem(contentId: 0, contentType: .news, contentTitle: "", imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/06/AF-Inquerito-Noticia-_-Banner.png")!),
    CarouselItem(contentId: 1, contentType: .news, contentTitle: "", imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/06/Linhas-Mar_Banner.png")!),
    CarouselItem(contentId: 2, contentType: .news, contentTitle: "", imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/05/AF-_-Santo-Antonio_Banner-1.png")!),
    CarouselItem(contentId: 3, contentType: .news, contentTitle: "", imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/05/Banner-Mini-Passageiros.png")!)
]

#Preview {
    HorizontalCarousel(items: dummyCarouselItems, onItemClick: {item in })
}
