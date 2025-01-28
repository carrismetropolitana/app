//
//  StopDetailsView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 29/03/2024.
//

import SwiftUI
import MapKit

struct StopDetailsView: View {
    @EnvironmentObject var tabCoordinator: TabCoordinator
    
    @EnvironmentObject var alertsManager: AlertsManager
    @EnvironmentObject var linesManager: LinesManager
    @EnvironmentObject var favoritesManager: FavoritesManager
    
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.presentationMode) var presentationMode
    
    @State private var isAlertsSheetPresented = false
    @State private var isFavoriteCustomizationSheetPresented = false
    
    @GestureState private var zoom = 1.0
    @State var offset: CGSize = .zero
    
    @State private var stopPatterns: [Pattern] = []

    
    let stop: Stop
    
    @Binding var mapFlyToCoords: CLLocationCoordinate2D?
    
   @State private var images: [IMLPicture] = []
    @State private var intermodalAttributionExpanded = false
    @State private var visibleImageId = 0
    
    @State private var stopDestinationsExpanded = false
    
    var body: some View {
        let stopAlerts = alertsManager.alerts.filter {
            var isStopAffected = false
            for informedEntity in $0.alert.informedEntity {
                if let stopId = informedEntity.stopId {
                    if (stopId == stop.id) {
                        isStopAffected = true
                    }
                }
            }
            
            return isStopAffected
        }
        
        ScrollView {
            HStack {
                VStack(alignment: .leading, spacing: 5.0) {
                    let stopLocationDetails = stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)"
                    VStack(alignment: .leading) {
                        HStack {
                            Text(stop.id)
                                .padding(.horizontal, 10)
                                .background(Capsule().stroke(.gray, lineWidth: 2.0))
                            Text(stop.lat)
                            Text(stop.lon)
                        }
                        .font(.custom("Menlo", size: 12.0).monospacedDigit())
                        .bold()
                        .foregroundStyle(.secondary)
                        Text(stop.name)
                            .font(.title2)
                            .bold()
                        Text(stopLocationDetails)
                            .foregroundStyle(.secondary)
                    }
                    .accessibilityHidden(true)
                    .background {
                        Color.clear
                            .accessibilityLabel("Paragem \(stop.ttsName ?? stop.name), localizada em \(stopLocationDetails), número de paragem: \(stop.id), ")
                    }
                    
                    
                    HStack(spacing: 10.0) {
//                        RoundedRectangle(cornerRadius: 15.0)
//                            .fill(.windowBackground)
//                            .overlay {
//                                Image(systemName: "star")
//                                    .foregroundStyle(.yellow)
//                                    .font(.title)
//                            }
//                            .frame(width: 60, height: 60)
//                            .shadow(color: .black.opacity(0.1), radius: 10)
//                            .overlay(
//                                RoundedRectangle(cornerRadius: 15)
//                                    .stroke(colorScheme == .dark ? .gray.opacity(0.3) : .white, lineWidth: 2)
//                            )
                        
                        SquaredButton(
                            action: {
                                isFavoriteCustomizationSheetPresented.toggle()
                            },
                            systemIcon: favoritesManager.isFavorited(itemId: stop.id, itemType: .stop) ? "star.fill" : "star",
                            iconColor: .yellow,
                            badgeValue: 0
                        )
                        .accessibilityElement(children: .ignore)
                        .accessibilityLabel(favoritesManager.isFavorited(itemId: stop.id, itemType: .stop) ? Text("Editar paragem favorita") : Text("Marcar como paragem favorita"))
                        .accessibilityValue(favoritesManager.isFavorited(itemId: stop.id, itemType: .stop) ? Text("Já é favorita") : Text("Não está marcada"))
                        .accessibilityHint(favoritesManager.isFavorited(itemId: stop.id, itemType: .stop) ? Text("Duplo toque abre o pop-up com as configurações desta paragem favorita e permite remover esta paragem favorita."):Text("Duplo toque abre o pop-up para adicionar esta paragem como favorita."))
                        .accessibilityAddTraits(.isButton)
                        
                        SquaredButton(action: {
                            if tabCoordinator.selectedTab == .stops {
                                mapFlyToCoords = stop.coordinate
                                presentationMode.wrappedValue.dismiss()
                            } else {
                                tabCoordinator.selectedTab = .stops
                                tabCoordinator.mapFlyToCoords = stop.coordinate
                                tabCoordinator.flownToStopId = stop.id
                            }
                        }, systemIcon: "map", iconColor: .primary, badgeValue: 0)
                        .accessibilityLabel(Text("Voar para paragem no mapa"))
                        
//                        RoundedRectangle(cornerRadius: 10.0)
//                            .fill(.windowBackground)
//                            .overlay {
//                                Image(systemName: "map")
//                                    .font(.title)
//                            }
//                            .frame(width: 60, height: 60)
////                            .shadow(color: .black.opacity(0.1), radius: 10)
//                            .overlay(
//                                RoundedRectangle(cornerRadius: 15)
//                                    .stroke(colorScheme == .dark ? .gray.opacity(0.3) : .white, lineWidth: 2)
//                            )
                        
//                        RoundedRectangle(cornerRadius: 15.0)
//                            .fill(.windowBackground)
//                            .overlay {
//                                Image(systemName: "exclamationmark.triangle")
//                                    .font(.title)
//                            }
//                            .frame(width: 60, height: 60)
//                            .shadow(color: .black.opacity(0.1), radius: 10)
//                            .overlay(
//                                RoundedRectangle(cornerRadius: 15)
//                                    .stroke(colorScheme == .dark ? .gray.opacity(0.3) : .white, lineWidth: 2)
//                            )
                        SquaredButton(
                            action: {
                                isAlertsSheetPresented.toggle()
                            },
                            systemIcon: "exclamationmark.triangle",
                            iconColor: .primary,
                            badgeValue: stopAlerts.count
                        )
                        .accessibilityElement(children: .ignore)
                        .accessibilityLabel(Text("Alertas"))
                        .accessibilityValue((stopAlerts.count > 0) ? Text("Há \(stopAlerts.count) alertas ativos"):Text("Não há alertas ativos."))
                        .accessibilityHint(Text("Duplo toque abre o pop-up com a lista de alertas ativos nesta paragem."))
                        .accessibilityAddTraits(.isButton)
                    }
                    .padding(.top, 10.0)
                }
                .padding()
                Spacer()
            }
            
            if !images.isEmpty {
                TabView(selection: $visibleImageId) {
                    ForEach(images) { image in
                        AsyncImage(url: URL(string: image.urlFull)) { image in
                            image
                                .resizable()
                                .scaledToFill()
                            //                                .zoomableAndPannable()
                        } placeholder: {
                            ZStack {
                                Color.gray.opacity(0.2)
                                    .containerRelativeFrame(.horizontal)
                                LoadingBar(size: 10)
                            }
                        }
                        .tag(image.id)
                    }
                }
                .frame(height: 250)
                .tabViewStyle(.page)
                .accessibilityLabel("Fotografias da paragem")
                .overlay {
                    VStack {
                        HStack {
                            Spacer()
                            IntermodalAttribution(expanded: intermodalAttributionExpanded)
                                .padding(10.0)
                                .background(
                                    UnevenRoundedRectangle(
                                        cornerRadii: RectangleCornerRadii(
                                            topLeading: 0.0, bottomLeading: 10.0, bottomTrailing: 0.0, topTrailing: 0.0
                                        )
                                    ).fill(.cmSystemBackground100)
                                )
                                .onTapGesture {
                                    withAnimation(.snappy(duration: 0.3)) {
                                        intermodalAttributionExpanded.toggle()
                                    }
                                }
                        }
                        Spacer()
                    }
                }
                .onChange(of: visibleImageId) {
                    withAnimation(.snappy(duration: 0.3)) {
                        intermodalAttributionExpanded = false
                    }
                }
            }
            
            WrappingHStack(alignment: .leading) {
                ForEach(stop.facilities, id: \.self) { facility in
                    if let facilityName = getNameForFacility(facility) { // gotta at least present name lol
                        HStack {
                            if let image = getImageResourceForFacility(facility) {
                                Image(image)
                                    .resizable()
                                    .frame(width: 40.0, height: 40.0)
                            }
                            Text(facilityName)
                                .font(.headline)
                                .bold()
                                .padding(.horizontal, 10.0)
                        }
                        .padding(5.0)
                        .background(Capsule().fill(.cmLaunchBackground).shadow(color: .black.opacity(0.1), radius: 10.0))
                        .accessibilityHidden(true)
                        .background {
                            Color.clear
                                .accessibilityLabel("Esta paragem está próxima de \(facilityName)")
                        }
                    }
                }
            }
            .padding()
            
            
            VStack {
                HStack {
                    Text("Destinos a partir desta paragem")
                        .bold()
                        .font(.title2)
                        .foregroundStyle(.cmSystemText100)
                    Spacer()
                }
                
                if stopPatterns.count > 0 {
                    VStack(spacing: 0) {
                        
                        ForEach(stopDestinationsExpanded ? stopPatterns.indices : stopPatterns.prefix(4).indices, id: \.hashValue) { patternIndex in
                            let pattern = stopPatterns[patternIndex]
                            
                            // TODO: this will lead to a crash if a new line is introduced and the lines in linesManager haven't been updated yet, fix
                            NavigationLink(destination: LineDetailsView(line: linesManager.lines.first(where: { $0.id == pattern.lineId })!, overrideDisplayedPatternId: pattern.id)) {
                                StopPatternEntry(pattern: pattern)
                                    .padding(.horizontal, 10.0)
                                    .padding(.vertical, 5.0)
                                //                            .padding(.vertical, routeIndex == 0 ? nil : 2.0)
//                                    .padding(.top, patternIndex == 0 ? 8.0 : 0.0)
//                                    .padding(.bottom, patternIndex == stopPatterns.count - 1 && stopPatterns.count <= 3 ? 2.0 : 0.0)
                            }
                            .tint(.listPrimary)
                            if patternIndex != stopPatterns.count - 1 {
                                Divider()
                            }
                            
                        }
                        
                        if !stopDestinationsExpanded && stopPatterns.count > 4 {
                            Divider()
                            Button {
                                withAnimation(.snappy) {
                                    stopDestinationsExpanded = true
                                }
                            } label: {
                                HStack {
                                    Text("Ver mais destinos")
                                        .font(.headline)
                                    Spacer()
                                    Image(systemName: "chevron.down")
                                        .foregroundStyle(.secondary)
                                }
                                .padding(.horizontal, 10.0)
                                .padding(.top, 15.0)
                                .padding(.leading, 10.0)
                                .padding(.bottom, 15.0)
                            }
                            .tint(.cmSystemText100)
                        }
                    }
                    .background(RoundedRectangle(cornerRadius: 15.0).fill(.cmLaunchBackground))
                } else {
                    LoadingBar(size: 10)
                }
            }
            .padding()
            
            
//            VStack {
//                HStack {
//                    Text("Sobre esta paragem")
//                        .bold()
//                        .font(.title2)
//                        .foregroundStyle(.windowBackground)
//                        .colorInvert()
//                    Spacer()
//                }
//                
//                VStack {
//                    HStack {
//                       AboutStopItem(title: "Estado do Piso", description: "Desconhecido")
//                    }
//                    .padding(.horizontal, 20.0)
//                    .padding(.top, 12.0)
//                    .padding(.bottom, 5.0)
//                    
//                    Divider()
//                    
//                    HStack {
//                        AboutStopItem(title: "Material do Piso", description: "Desconhecido")
//                    }
//                    .padding(.horizontal, 20.0)
//                    .padding(.vertical, 5.0)
//                    
//                    Divider()
//                    
//                    HStack {
//                        AboutStopItem(title: "Tipo de Acesso à Paragem", description: "Desconhecido")
//                    }
//                    .padding(.horizontal, 20.0)
//                    .padding(.vertical, 5.0)
//                    
//                    Divider()
//                    
//                    HStack {
//                        AboutStopItem(title: "Estado da Passadeira", description: "Desconhecido")
//                    }
//                    .padding(.horizontal, 20.0)
//                    .padding(.vertical, 5.0)
//                    
//                    
//                    Divider()
//                    
//                    HStack {
//                        AboutStopItem(title: "Estacionamento Abusivo", description: "Desconhecido")
//                    }
//                    .padding(.horizontal, 20.0)
//                    .padding(.vertical, 5.0)
//                    
//                    
//                    Divider()
//                    
//                    HStack {
//                        AboutStopItem(title: "Data da Última Verificação de Acessibilidade", description: "Desconhecida")
//                    }
//                    .padding(.horizontal, 20.0)
//                    .padding(.top, 5.0)
//                    .padding(.bottom, 12.0)
//                }
//                .background(RoundedRectangle(cornerRadius: 15.0).fill(.cmLaunchBackground))
//                .blur(radius: 10)
//                .overlay(
//                    Text("Em breve".uppercased())
//                        .foregroundStyle(.white)
//                        .font(.callout)
//                        .fontWeight(.heavy)
//                        .padding(.horizontal, 10.0)
//                        .background(Capsule().fill(.gray))
//                )
//            }
//            .padding()
//            
//            VStack {
//                HStack {
//                   AboutStopItem(title: "Estado do Painel de Informação Real-Time", description: "Desconhecido")
//                }
//                .padding(.horizontal, 20.0)
//                .padding(.top, 12.0)
//                .padding(.bottom, 5.0)
//                
//                Divider()
//                
//                HStack {
//                    AboutStopItem(title: "Estado da Sinalética H20A", description: "Descohecido")
//                }
//                .padding(.horizontal, 20.0)
//                .padding(.vertical, 5.0)
//                
//                Divider()
//                
//                HStack {
//                    AboutStopItem(title: "Disponibilização de Horários", description: "Desconhecido")
//                }
//                .padding(.horizontal, 20.0)
//                .padding(.vertical, 5.0)
//                
//                Divider()
//                
//                HStack {
//                    AboutStopItem(title: "Data da Última Verificação de Horários", description: "Desconhecida")
//                }
//                .padding(.horizontal, 20.0)
//                .padding(.top, 5.0)
//                .padding(.bottom, 12.0)
//            }
//            .background(RoundedRectangle(cornerRadius: 15.0).fill(.cmLaunchBackground))
//            .padding(.horizontal)
//            .padding(.bottom)
//            .blur(radius: 10)
//            .overlay(
//                Text("Em breve".uppercased())
//                    .foregroundStyle(.white)
//                    .font(.callout)
//                    .fontWeight(.heavy)
//                    .padding(.horizontal, 10.0)
//                    .background(Capsule().fill(.gray))
//            )
            
//            UserFeedbackForm(
//                title: "Estas informações estão corretas?",
//                description: "Ajude-nos a melhorar os transportes para todos.",
//                questions: [
//                    Question(text: "Percursos e Paragens", type: .yesOrNo, onAction: {value in print("User responded with value \(value) to question Percursos e Paragens")}),
//                    Question(text: "Estimativas de Chegada", type: .yesOrNo, onAction: {value in print("User responded with value \(value) to question Estimativas de Chegada")}),
//                    Question(text: "Informações no Veículo", type: .yesOrNo, onAction: {value in print("User responded with value \(value) to question Informações no Veículo")})
//                ]
//            )
        }
        .navigationTitle("Paragem")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                ShareLink(item: URL(string: "https://carrismetropolitana.pt/stops/\(stop.id)")!) {
                    Image(systemName: "square.and.arrow.up")
                }
            }
        }
        .background(Color(uiColor: UIColor.secondarySystemBackground)) // mimics list background, apparently cant have specific unstyled items on list wihtout unstyling all (unstyled here is plain style)
        .sheet(isPresented: $isAlertsSheetPresented) {
            // try await AlertsService.fetchNew()
            AlertsSheetView(isSelfPresented: $isAlertsSheetPresented, alerts: stopAlerts, source: .stop) // AlertsService.alerts.find(where: { $0.alert.informedEntities blableblibloblu })
                .presentationDragIndicator(.visible)
        }
        .sheet(isPresented: $isFavoriteCustomizationSheetPresented) {
            NavigationStack {
                FavoriteCustomizationView(type: .stop, isSelfPresented: $isFavoriteCustomizationSheetPresented, overrideItemId: stop.id)
            }
        }
        .onAppear {
            Task {
                let imlStop = try await IMLAPI.shared.getStopByOperatorId(stopId: stop.id)
                
                print("cmet:stop:\(stop.id) -> iml:stop:\(imlStop.id)")
                
                images = await IMLAPI.shared.getStopPictures(imlStop.id)
                
                print("Got \(images.count) IML images for stop.")
                
                visibleImageId = images.first?.id ?? 0
                
                var patterns: [Pattern] = []
                
                if let patternIds = stop.patterns {
                    for patternId in patternIds {
                        let pattern = try await CMAPI.shared.getPattern(patternId)
                        
                        patterns.append(pattern)
                    }
                    
                    stopPatterns = patterns
                }
            }
        }
    }
}

struct AboutStopItem: View {
    let title: String
    let description: String
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(title)
                    .font(.callout)
                    .foregroundStyle(.secondary)
                    .fontWeight(.medium)
                Text(description)
                    .font(.headline)
                    .fontWeight(.medium)
            }
            Spacer()
        }
    }
}

struct StopPatternEntry: View {
    let pattern: Pattern
    var body: some View {
        HStack {
                HStack {
                    Pill(text: pattern.shortName, color: .init(hex: pattern.color), textColor: .init(hex: pattern.textColor))
                        .padding(.horizontal, 5.0)
                    Text(pattern.headsign)
                        .bold()
                        .font(.subheadline)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                    Spacer()
                }
                .frame(height: 40)
                .padding(.vertical, 5)
            Image(systemName: "chevron.right")
                .foregroundStyle(.secondary)
                .padding(.trailing, 3.0)
        }
    }
}

func getNameForFacility(_ facility: Facility) -> String? {
    switch facility {
    case .boat:
        return String(localized: "Barco", comment: "Nome de stop facility")
    case .lightRail:
        return String(localized: "Metro de superfície", comment: "Nome de stop facility")
    case .school:
        return String(localized: "Escola", comment: "Nome de stop facility")
    case .shopping:
        return String(localized: "Centro Comercial", comment: "Nome de stop facility")
    case .subway:
        return String(localized: "Metro", comment: "Nome de stop facility")
    case .train:
        return String(localized: "Comboio", comment: "Nome de stop facility")
    case .transitOffice:
        return String(localized: "Espaço navegante®", comment: "Nome de stop facility")
//    case .bikeSharing:
//        return String(localized: "Bicicletas partilhadas", comment: "Nome de stop facility")
//    case .hospital:
//        return String(localized: "Hospital", comment: "Nome de stop facility")
    default:
        return nil
    }
}

#Preview {
    //        StopDetailsView(stop: Stop(
    //            id: "1234",
    //            name: "Paragem de Teste",
    //            shortName: "PTET",
    //            ttsName: "Paragem de Tesre",
    //            operational_status: "ACTIVE",
    //            lat: "38.9834",
    //            lon: "-9.1342",
    //            locality: "Locality",
    //            parishId: "pid",
    //            parishName: "Parish",
    //            municipalityId: "munid",
    //            municipalityName: "Municipality",
    //            districtId: "did",
    //            districtName: "District",
    //            regionId: "rid",
    //            regionName: "Region",
    //            wheelchairBoarding: "WB",
    //            facilities: [
    //                .boat,
    //                .lightRail,
    //                .school,
    //                .shopping,
    //                .subway,
    //                .train,
    //                .transitOffice,
    //                .bikeSharing
    //            ],
    //            lines: ["1523"],
    //            routes: ["1523_0"],
    //            patterns: ["1523_0_0"]
    //        ))
    
    VStack {
        Spacer()
        VStack {
            HStack {
                Text("Sobre esta paragem")
                    .bold()
                    .font(.title2)
                    .foregroundStyle(.windowBackground)
                    .colorInvert()
                Spacer()
            }
            
            VStack {
                HStack {
                   AboutStopItem(title: "Estado do Piso", description: "Em estado razoável")
                }
                .padding(.horizontal, 20.0)
                .padding(.top, 12.0)
                .padding(.bottom, 5.0)
                Divider()
                HStack {
                    AboutStopItem(title: "Material do Piso", description: "Calçada Portuguesa")
                }
                .padding(.horizontal, 20.0)
                .padding(.vertical, 5.0)
                Divider()
                HStack {
                    AboutStopItem(title: "Tipo de Acesso à Paragem", description: "Acesso nivelado (rampa)")
                }
                .padding(.horizontal, 20.0)
                .padding(.vertical, 5.0)
                
                Divider()
                
                HStack {
                    AboutStopItem(title: "Estado da Passadeira", description: "Existe, em bom estado")
                }
                .padding(.horizontal, 20.0)
                .padding(.top, 5.0)
                .padding(.bottom, 12.0)
            }
            .background(RoundedRectangle(cornerRadius: 15.0).fill(.cmLaunchBackground))
        }
        .padding()
        Spacer()
    }
    .background(.gray.opacity(0.2))
}


// weird animation when going back
// follow this more recent one
// @see https://www.youtube.com/watch?v=Z1_49kXP5U0
// all of this shit could be done in swiftui if they allowed simultaneous mounting of gestureHandlers (simultaneous right now means you can add multiple gestureHandlers but only one can be "active" at a time, maybe not lol, there seems to be a little extra logic invloved :p, add it naitvely to swiftui then apple lol
extension View {
    func zoomableAndPannable() -> some View {
        return ZoomPanContext {
            self
        }
    }
}

struct ZoomPanContext<Content: View> : View {
    var content: Content
    
    init(@ViewBuilder content: @escaping() -> Content) {
        self.content = content()
    }
    
    @State var scale: CGFloat = .zero
    @State var scalePosition: CGPoint = .zero
    
    @State var offset: CGPoint = .zero
    
    var body: some View {
        content
            .offset(x: offset.x, y: offset.y)
            .overlay {
                GeometryReader { geo in
                    ZoomGesture(size: geo.size, scale: $scale, scalePosition: $scalePosition, offset: $offset)
                }
            }
            .scaleEffect(scale + 1, anchor: .init(x: scalePosition.x, y: scalePosition.y))
    }
}

struct ZoomGesture: UIViewRepresentable {
    var size: CGSize
    
    @Binding var scale: CGFloat
    @Binding var scalePosition: CGPoint
    
    @Binding var offset: CGPoint
    
    func makeUIView(context: Context) -> UIView {
        let view = UIView()
        view.backgroundColor = .clear
        
        let pinchGesture = UIPinchGestureRecognizer(target: context.coordinator, action: #selector(context.coordinator.handlePinch(sender:)))
        let panGesture = UIPanGestureRecognizer(target: context.coordinator, action: #selector(context.coordinator.handlePan(sender:)))
        
        panGesture.delegate = context.coordinator
        
        view.addGestureRecognizer(pinchGesture)
        view.addGestureRecognizer(panGesture)
        
        return view
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {
    }
    
    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }
    
    class Coordinator: NSObject, UIGestureRecognizerDelegate {
        var parent: ZoomGesture
        
        init(parent: ZoomGesture) {
            self.parent = parent
        }
        
        func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
            return true
        }
        
        @objc func handlePinch(sender: UIPinchGestureRecognizer) {
            if sender.state == .began || sender.state == .changed {
                parent.scale = sender.scale - 1
                
                let scalePoint = CGPoint(x: sender.location(in: sender.view).x / sender.view!.frame.size.width, y: sender.location(in: sender.view).y / sender.view!.frame.size.height)
                
                parent.scalePosition = parent.scalePosition == .zero ? scalePoint : parent.scalePosition
            } else {
                withAnimation(.easeInOut(duration: 0.3)) {
                    parent.scale = 0
                    parent.scalePosition = .zero
                }
            }
        }
        
        @objc func handlePan(sender: UIPanGestureRecognizer) {
            sender.maximumNumberOfTouches = 2
            
            if (sender.state == .began || sender.state == .changed) && parent.scale > 0 {
                if let view = sender.view {
                    let translation = sender.translation(in: view)
                    
                    parent.offset = translation
                }
                
            } else {
                withAnimation {
                    parent.offset = .zero
                    parent.scalePosition = .zero
                }
            }
        }
    }
}
