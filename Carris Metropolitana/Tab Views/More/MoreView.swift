//
//  MoreView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/03/2024.
//

import SwiftUI

struct MoreView: View {
    @EnvironmentObject var vehiclesManager: VehiclesManager
    @State private var news: [News] = []
    @State private var carouselItems: [CarouselItem] = []
    let dummyCarouselItems = [
        CarouselItem(contentId: 0, contentType: .news, contentTitle: "Inquérito", imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/06/AF-Inquerito-Noticia-_-Banner.png")!),
        CarouselItem(contentId: 1, contentType: .news, contentTitle: "Linhas Mar", imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/06/Linhas-Mar_Banner.png")!),
        CarouselItem(contentId: 2, contentType: .news, contentTitle: "Santo António", imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/05/AF-_-Santo-Antonio_Banner-1.png")!),
        CarouselItem(contentId: 3, contentType: .news, contentTitle: "Mini Passageiros Carris Metropolitana", imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/05/Banner-Mini-Passageiros.png")!)
    ]
    
    @State private var isCarouselDetailPresented = false
    @State private var selectedNews: News? = nil
    @State private var selectedNewsImageURL: URL? = nil
    
    var body: some View {
        NavigationStack {
             VStack {
                 NavigationLink(destination: selectedNews != nil ? AnyView(NewsView(news: selectedNews!, newsImageURL: selectedNewsImageURL!)) : AnyView(EmptyView()), isActive: $isCarouselDetailPresented) {
                     EmptyView()
                }
                ScrollView {
                    VStack(spacing: 20.0) {
                        if (carouselItems.count > 0) {
                            HorizontalCarousel(items: carouselItems, onItemClick: { item in
                                selectedNews = news.first { $0.id == item.contentId }
                                selectedNewsImageURL = item.imageURL
                                isCarouselDetailPresented.toggle()
                            })
                            .padding(.vertical)
                            .accessibilityLabel("Carrossel de notícias")
                            .accessibilityHidden(false)
                        } else {
                            RoundedRectangle(cornerRadius: 15.0)
                                .fill(.quaternary)
                                .frame(height: 200)
                                .padding(.horizontal)
                                .padding(.vertical)
//                                .overlay {
//                                    LoadingBar(size: 10)
//                                    CMLoadingAnimation()
//                                }
                                .blinking()
                        }
                        VStack (spacing: 40.0){
                            VStack(alignment: .leading, spacing: 15.0) {
                                Section(header: Text("Informar").bold().font(.title2).foregroundStyle(.windowBackground).colorInvert()) {
                                    NavigationLink(destination: ENCMView()) {
                                        EntryRectangleWithIcon(
                                            icon: Image(systemName: "house.fill"),
                                            color: .purple,
                                            text: "Espaços navegante®",
                                            externalLink: false
                                        )
                                    }
                                    NavigationLink(destination: FAQView()) {
                                        EntryRectangleWithIcon(
                                            icon: Image(systemName: "questionmark.diamond.fill"),
                                            color: .orange,
                                            text: "Perguntas Frequentes",
                                            externalLink: false
                                        )
                                    }
                                    Link(destination: URL(string: "https://www.carrismetropolitana.pt/apoio/")!) {
                                        EntryRectangleWithIcon(
                                            icon: Image(systemName: "ellipsis.bubble.fill"),
                                            color: .blue,
                                            text: "Apoio ao Cliente",
                                            externalLink: true
                                        )
                                    }
                                }
                                .textCase(nil)
                            }
                            
                            VStack(alignment: .leading, spacing: 15.0) {
                                Section(header: Text("Viajar").bold().font(.title2).foregroundStyle(.windowBackground).colorInvert()) {
//                                    EntryRectangleWithIcon(systemImage: "creditcard.fill", color: .pink, text: "Carregar o Passe", externalLink: false)
//                                    EntryRectangleWithIcon(systemImage: "bolt.fill", color: .pink, text: "Cartões e Descontos", externalLink: false)
                                    Link(destination: URL(string: "https://www.carrismetropolitana.pt/tarifarios/")!) {
                                        EntryRectangleWithIcon(
                                            icon: Image(systemName: "eurosign.circle.fill"),
                                            color: .pink,
                                            text: "Tarifários",
                                            externalLink: true
                                        )
                                    }
                                    Link(destination: URL(string: "https://www.navegante.pt/")!) {
                                        EntryRectangleWithIcon(
                                            icon: Image(.naveganteCardIcon),
                                            color: .cmYellow,
                                            text: "navegante®",
                                            externalLink: true
                                        )
                                    }
                                }
                                .textCase(nil)
                            }
                            
                            VStack(alignment: .leading, spacing: 15.0) {
                                Section(header: Text("Carris Metropolitana").bold().font(.title2).foregroundStyle(.windowBackground).colorInvert()) {
                                    Link(destination: URL(string: "https://www.carrismetropolitana.pt/motoristas/")!) {
                                        EntryRectangleWithIcon(
                                            icon: Image(systemName: "person.badge.shield.checkmark.fill"),
                                            color: .yellow,
                                            text: "Recrutamento",
                                            externalLink: true
                                        )
                                    }
                                    Link(destination: URL(string: "https://www.carrismetropolitana.pt/opendata/")!) {
                                        EntryRectangleWithIcon(
                                            icon: Image(systemName: "wand.and.stars.inverse"),
                                            color: .blue,
                                            text: "Dados Abertos",
                                            externalLink: true
                                        )
                                    }
                                    Link(destination: URL(string: "https://www.carrismetropolitana.pt/politica-de-privacidade/")!) {
                                        EntryRectangleWithIcon(
                                            icon: Image(systemName: "lock.square.fill"),
                                            color: .blue,
                                            text: "Privacidade",
                                            externalLink: true // is false in mockup
                                        )
                                    }
                                    Link(destination: URL(string: "https://www.carrismetropolitana.pt/aviso-legal/")!) {
                                        EntryRectangleWithIcon(
                                            icon: Image(systemName: "checkmark.seal.fill"),
                                            color: .blue,
                                            text: "Aviso Legal",
                                            externalLink: true // is false in mockup
                                        )
                                    }
                                }
                                .textCase(nil)
                            }
                        }
                        .padding(.horizontal)
                        .padding(.bottom)
                        .handleOpenURLInApp()
                        
                        if let releaseVersionNumber = Bundle.main.releaseVersionNumber,
                           let buildVersionNumber = Bundle.main.buildVersionNumber {
                            Text("Versão \(releaseVersionNumber) (\(buildVersionNumber))")
                                .foregroundStyle(.cmSystemText300)
                                .bold()
                                .padding(.bottom, 30.0)
                        }
                    }
                }
                .navigationTitle("Novidades")
                .background(.cmSystemBackground200)
            }
            .onAppear {
                Task {
                    news = try await CMWordpressAPI.shared.getNews()
                }
                vehiclesManager.stopFetching()
            }
            .onChange(of: news) {
                Task {
                    carouselItems = await generateCarouselItems(from: news) ?? []
                    print(carouselItems)
                }
            }
        }
    }
    
    func generateCarouselItems(from news: [News]) async -> [CarouselItem]? {
        guard news.count > 0 else {
            return nil
        }
        
        var carouselItems: [CarouselItem] = []
        
        for newsItem in news {
            do {
                let imageURL = try await CMWordpressAPI.shared.getMediaURL(mediaId: newsItem.featuredMedia)
                let carouselItem = CarouselItem(contentId: newsItem.id, contentType: .news, contentTitle: newsItem.title.rendered, imageURL: imageURL)
                carouselItems.append(carouselItem)
            } catch {
                print("Failed to fetch media URL for news item with ID \(newsItem.id): \(error)")
                return nil
            }
        }
        
        return carouselItems
    }
}

#Preview {
    MoreView()
}

struct EntryRectangleWithIcon: View {
    @Environment(\.colorScheme) var colorScheme

    let icon: Image
    let color: Color
    let text: String
    let externalLink: Bool
    let url: URL? = nil
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 20.0)
                .fill(.cmSystemBackground100)
                .frame(height: 80)
                .shadow(color: .black.opacity(0.05), radius: 10)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(.cmSystemBorder100, lineWidth: 1)
                )
                .accessibilityHint(externalLink ? "Abre ligação externa" : "")
                .accessibilityAddTraits(externalLink ? .isLink : .init([]))

//            Button {
//                
//            } label: {
                HStack {
                    icon
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .foregroundColor(color)
                        .frame(width: 40)
                        .frame(maxHeight: 40)
                    Spacer()
                        .frame(width: 20)
                    Text(text)
                        .font(.title3)
                        .bold()
                        .foregroundStyle(.windowBackground)
                        .colorInvert()
                    Spacer()
                    Image(systemName: externalLink ? "arrow.up.forward.square" : "chevron.right")
                        .font(.title2)
                        .foregroundStyle(.gray.secondary)
                }
//            }
            
            .padding()
            .padding(.leading, 10)
        }
    }
}


struct BlinkViewModifier: ViewModifier {
    let duration: Double
    @State private var blinking: Bool = false

    func body(content: Content) -> some View {
        content
            .opacity(blinking ? 0.3 : 1)
            .animation(.easeInOut(duration: duration).repeatForever(), value: blinking)
            .onAppear {
                DispatchQueue.main.async {
                    blinking.toggle()
                }
            }
    }
}

extension View {
    func blinking(duration: Double = 1) -> some View {
        modifier(BlinkViewModifier(duration: duration))
    }
}
