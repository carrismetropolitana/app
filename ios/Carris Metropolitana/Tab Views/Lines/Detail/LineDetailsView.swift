//
//  RouteDetailsView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/03/2024.
//

import SwiftUI
import MapKit
import AmplitudeSwift


struct LineDetailsView: View {
    @State private var timer: Timer?
    let line: Line
    let overrideDisplayedPatternId: String?
    
    @State private var isAlertsSheetPresented = false
    @State private var isFavoriteCustomizationSheetPresented = false
    
    @State private var selectedPattern: Pattern?
    @State private var selectedStop: Stop?
    @State private var routes: [Route] = []
    @State private var patterns: [Pattern] = []
    @State private var currentPatternEtas: [String: [PatternRealtimeETA]]? = nil
    @State private var unfilteredVehicles: [Vehicle] = []
    @State private var vehicles: [Vehicle] = []
    @State private var shape: CMShape?
    
    @State private var mapHeight: CGFloat = 200
    @State private var hasMapHeightChangedOnce = false
    
    @State private var isMapExpanded = false
    
    @State private var lineAlerts: [GtfsRtAlertEntity] = []
    
//    @State private var _______tempForUiDemoPurposes_isFavorited = false
    
    var body: some View {
        GeometryReader { geo in
            ScrollView {
                VStack(alignment: .leading) {
                    if let selectedPattern = selectedPattern {
                        VStack(alignment: .leading) {
                            
                            VStack(alignment: .leading, spacing: 10) {
                                Pill(text: line.shortName, color: Color(hex: line.color), textColor: Color(hex: line.textColor), size: .large)
                                    .padding(.top, 10)
                                    .padding(.horizontal)
                                
                                
                                Text(line.longName)
                                    .font(.system(size: 22.0))
                                    .bold()
                                    .padding(.horizontal)
                            }
                            
                            
                            LineDetailsSquaredButtonsRow(
                                line: line,
                                lineAlerts: $lineAlerts,
                                onFavoriteCustomizationSheetPresent: {
                                    isFavoriteCustomizationSheetPresented = true
                                }, onAlertsSheetPresent: {
                                    isAlertsSheetPresented = true
                                }
                            )
                                .padding(.horizontal)
                                .padding(.vertical, 10.0)
                            
                            
                            Divider()
                            
                            
                            Group {
                                Text("Selecionar destino")
                                Picker("Selecionar destino", selection: $selectedPattern) {
                                    ForEach(patterns, id: \.id) { pattern in 
                                        let route = routes.first { $0.patterns.contains(pattern.id) }
                                        Button {} label: {
                                            Text(pattern.headsign)
                                            if let route {
                                                Text(route.longName)
                                            }
                                        }
                                        .tag(pattern as Pattern?) // https://stackoverflow.com/questions/59348093/picker-for-optional-data-type-in-swiftui/59348094#59348094
                                    }
                                }
                                .frame(maxWidth: .infinity)
                                .clipped()
                                .background(RoundedRectangle(cornerRadius: 10.0).fill(.gray.quinary))
                                .pickerStyle(.menu)
                            }
                            .padding(.horizontal)
                        }
                        .padding(.vertical)
                        
                        LiveVehiclesAndEtasByPatternView(line: line, pattern: selectedPattern, shape: shape, selectedStop: $selectedStop)
                        
                    } else {
                        VStack {
                            CMLoadingAnimation()
                        }
                        .frame(width: geo.size.width)
                        .frame(minHeight: geo.size.height)
                    }
                }
            }
                .background(.cmSystemBackground200)
        }
        .navigationTitle("Linha")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                ShareLink(item: URL(string: "https://carrismetropolitana.pt/lines/\(line.id)")!) {
                    Image(systemName: "square.and.arrow.up")
                }
            }
        }
        .sheet(isPresented: $isAlertsSheetPresented) {
            // try await AlertsService.fetchNew()
            AlertsSheetView(isSelfPresented: $isAlertsSheetPresented, alerts: lineAlerts, source: .line) // AlertsService.alerts.find(where: { $0.alert.informedEntities blableblibloblu })
                .presentationDragIndicator(.visible)
        }
        .sheet(isPresented: $isFavoriteCustomizationSheetPresented) {
            NavigationStack {
                FavoriteCustomizationView(type: .line, isSelfPresented: $isFavoriteCustomizationSheetPresented, overrideItemId: line.id)
            }
        }
        .onAppear {
            Amplitude.shared.track(eventType: "LINE_VIEWED", eventProperties: [
                "entityId": line.id
            ])
            LinesSearchHistoryManager.shared.addSearchResult(line.id)
            if patterns.count == 0 {
                Task {
                    for routeId in line.routes {
                        let route: Route = try await CMAPI.shared.getRoute(routeId)
                        routes.append(route)
                        
                        for patternId in route.patterns {
                            let pattern: Pattern = try await CMAPI.shared.getPattern(patternId)
                            patterns.append(pattern)
                        }
                    }
                    
                    
                    if let _ = overrideDisplayedPatternId {
                        selectedPattern = patterns.first {
                            $0.id == overrideDisplayedPatternId
                        }
                    } else {
                        selectedPattern = patterns.first
                    }
                    
                    if selectedPattern != nil {
                        shape = (try await CMAPI.shared.getShape(selectedPattern!.shapeId))
                    }
                }
            }
        }
        .onChange(of: selectedPattern) {
            vehicles = []
            Task {
                if let pattern = selectedPattern {
                    shape = (try await CMAPI.shared.getShape(pattern.shapeId))
                }
            }
        }
    }
}

private struct LineDetailsSquaredButtonsRow: View {
    @EnvironmentObject var alertsManager: AlertsManager
    @EnvironmentObject var favoritesManager: FavoritesManager
    
    let line: Line
    @Binding var lineAlerts: [GtfsRtAlertEntity]
    
    let onFavoriteCustomizationSheetPresent: () -> Void
    let onAlertsSheetPresent: () -> Void
    
    var body: some View {
        HStack(spacing: 10.0) {
            SquaredButton(
                action: {
                    onFavoriteCustomizationSheetPresent()
                },
                systemIcon: favoritesManager.isFavorited(itemId: line.id, itemType: .pattern) ? "star.fill" : "star",
                //imageResourceIcon: nil, // FavoritesService.isFavorite(lineId: line.id) ? "star.fill" : "star"
                iconColor: .yellow,
                badgeValue: 0
            )
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(favoritesManager.isFavorited(itemId: line.id, itemType: .pattern) ? Text("Editar linha favorita") : Text("Marcar como linha favorita"))
            .accessibilityValue(favoritesManager.isFavorited(itemId: line.id, itemType: .pattern) ? Text("Já é favorita") : Text("Não está marcada"))
            .accessibilityHint(favoritesManager.isFavorited(itemId: line.id, itemType: .pattern) ? Text("Duplo toque abre o pop-up com as configurações desta linha favorita e permite remover esta linha favorita."):Text("Duplo toque abre o pop-up para adicionar esta linha como favorita."))
            .accessibilityAddTraits(.isButton)
            SquaredButton(
                action: {
                    onAlertsSheetPresent()
                },
                systemIcon: "exclamationmark.triangle",
                //                                    systemIcon: nil,
                //                                    imageResourceIcon: .exclamationMarkTriangleFilled,
                iconColor: .primary,
                badgeValue: lineAlerts.count
            )
            .accessibilityElement(children:.ignore)
            .accessibilityLabel(Text("Alertas"))
            .accessibilityValue((lineAlerts.count > 0) ? (lineAlerts.count > 1) ? Text("Há \(lineAlerts.count) alertas ativos."):Text("Há \(lineAlerts.count) alerta ativo."):Text("Não há alertas ativos."))
            .accessibilityHint(Text("Duplo toque abre o pop-up com a lista de alertas ativos nesta linha."))
            .accessibilityAddTraits(.isButton)
        }
        .onAppear {
            filterAlerts()
        }
        .onChange(of: alertsManager.alerts) {
            filterAlerts()
        }
    }
    
    private func filterAlerts() {
        lineAlerts = alertsManager.alerts.filter {
            var isLineAffected = false
            for informedEntity in $0.alert.informedEntity {
                if let routeId = informedEntity.routeId {
                    if (line.routes.contains(routeId)) {
                        isLineAffected = true
                    }
                }
                
                // show only line alerts or stops in line alerts too??
//                if let stopId = informedEntity.stopId {
//                    if (line.patterns.)
//                }
            }
            
            return isLineAffected
        }

    }
}

private struct LiveVehiclesAndEtasByPatternView: View {
    @EnvironmentObject var vehiclesManager: VehiclesManager
    
    let line: Line
    let pattern: Pattern?
    let shape: CMShape?
    
    @State private var timer: Timer?
    @State private var currentPatternEtas: [String: [PatternRealtimeETA]]? = nil
    @Binding var selectedStop: Stop?
    
    @State private var shouldPresentVehicleDetailsView: Bool = false
    @State private var vehicleIdToBePresented: String? = nil
    
    var body: some View {
        VStack {
            if let shape, let pattern {
                let filteredVehicles = vehiclesManager.vehicles.filter {$0.patternId == pattern.id}
                ShapeAndVehiclesMapView(
                    stops: pattern.path.compactMap {$0.stop},
                    vehicles: filteredVehicles,
                    shape: shape,
                    lineColor: Color(hex: line.color),
                    showPopupOnVehicleSelect: true,
                    onVehicleCalloutTap: { vehicleId in
                        vehicleIdToBePresented = vehicleId
                        shouldPresentVehicleDetailsView = true
                    }
                )
                .frame(height: 300)
                .overlay {
                    VStack {
                        Spacer()
                        HStack {
                            CirculatingVehiclesIndicator(vehiclesCount: filteredVehicles.count)
                                .padding()
                            Spacer()
                        }
                    }
                }
            }
            
            
            if let pattern {
                PatternLegs(pattern: pattern, selectedStop: $selectedStop, etasWithStopIds: currentPatternEtas)
                    .padding(.vertical)
            }
        }
        .onChange(of: pattern) {
            currentPatternEtas = nil
            stopFetchingTimer()
            fetchEtas()
            startFetchingTimer()
        }
        .onAppear {
            vehiclesManager.startFetching()
            
            fetchEtas()
            
            startFetchingTimer()
        }
        .onDisappear {
            stopFetchingTimer()
        }
        .navigationDestination(isPresented: $shouldPresentVehicleDetailsView) {
            if let vehicleId = vehicleIdToBePresented {
                VehicleDetailsView(vehicleId: vehicleId)
                    .onDisappear { vehicleIdToBePresented = nil }
            }
        }
    }
    
    private func fetchEtas() {
        Task {
            if let pattern {
                print("[FUNCTION::LiveVehiclesAndEtasByPatternView::fetchEtas] — Fetching ETAs for pattern id: \(pattern.id)")
                let etasForPattern = try await CMAPI.shared.getETAs(patternId: pattern.id)
                
                currentPatternEtas = arrangeByStopIds(etasForPattern)
                
                print("Got \(currentPatternEtas?.count ?? 0) ETAS for pattern \(pattern.id)")
            }
        }
    }
    
    private func startFetchingTimer() {
        // Create a timer to trigger fetching every 5 seconds
        timer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { timer in
            fetchEtas()
        }
    }
    
    private func stopFetchingTimer() {
        // Invalidate the timer to stop fetching
        timer?.invalidate()
        timer = nil
    }
}

private struct EtaEntryWithStopId {
    let stopId: String
    let etas: [RealtimeETA]
}

struct PatternLegs: View {
    @EnvironmentObject var stopsManager: StopsManager
    
    @State private var sheetHeight: CGFloat = .zero
    
    let pattern: Pattern
    @State private var isSheetPresented = false
    @State private var selectedSchedulesDate = Date()
    @Binding var selectedStop: Stop? // would be ok to just keep state inside this component but maybe in the future we may need to access from parent so lets keep it this way
    @State private var selectedStopIndex: Int = 0
    let etasWithStopIds: [String: [PatternRealtimeETA]]?
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0)  {
            ForEach(pattern.path.indices, id: \.hashValue) { pathStepIdx in
                let isFirst = pathStepIdx == 0
                let isLast = pathStepIdx == pattern.path.count - 1
                
                let pathStep = pattern.path[pathStepIdx]
                let pathCount = pattern.path.count
                let isSelected = selectedStop?.id == pathStep.stop.id // TODO: deprecate this as somethimes stops repeat in a pattern
                let isSelectedByIndex = selectedStopIndex == pathStepIdx
                
//                let etas = etasWithStopIds.first(where: {$0.stopId == pathStep.stop.id})?.etas
                
                HStack {
                    HStack {
                        ZStack {
                            VStack {
                                Text(verbatim: "—")
                                    .bold()
                                    .offset(x: 10, y: -2)
                                    .padding(.top, isSelectedByIndex ? 10 : 0)
                                    .accessibilityLabel(isSelectedByIndex ? "Paragem selecionada, paragem \(pathStepIdx+1) de \(pathCount)" : "Paragem \(pathStepIdx+1) de \(pathCount), não selecionada")
                                    .accessibilityHint("Passar o dedo para a direita para detalhes desta paragem")
                                Spacer()
                            }
                            VStack {
                                UnevenRoundedRectangle(cornerRadii: .init(topLeading: isFirst ? 10 : 0, bottomLeading: isLast ? 10 : 0, bottomTrailing: isLast ? 10 : 0, topTrailing: isFirst ? 10 : 0))
                                    .fill(Color(hex: pattern.color))
                                    .frame(width: 15, height: isLast && isSelectedByIndex ? 30 : isLast ? 20 : nil)
                                    .padding(.top, (isFirst && isSelectedByIndex) ? 10 : 0)
                                    .overlay {
                                        VStack {
                                            if isLast {Spacer()}
                                            Circle()
                                                .fill(.white)
                                                .padding(isLast ? 3.5 : 5)
                                                .padding(.top, isLast ? 0 : 2)
                                                .offset(y : isLast ? -4 : 0)
                                                .padding(.top, isSelectedByIndex ? 10 : 0)
                                            if !isLast {Spacer()}
                                        }
                                    }
                                if isLast {Spacer()}
                            }
                            .padding(.leading, 5)
                        }
                        VStack(alignment: .leading) {
                            VStack(alignment: .leading) {
                                Text(pathStep.stop.name)
                                    .font(isSelectedByIndex ? .headline : .subheadline)
                                    .fontWeight(isSelectedByIndex ? .bold : .semibold)
                                    .accessibilityLabel(pathStep.stop.ttsName ?? pathStep.stop.name)
                                Text(pathStep.stop.locality == pathStep.stop.municipalityName || pathStep.stop.locality == nil ? pathStep.stop.municipalityName : "\(pathStep.stop.locality!), \(pathStep.stop.municipalityName)")
                                    .foregroundStyle(.secondary)
                                if isSelectedByIndex {
                                    if pathStep.stop.facilities.count > 0 {
                                        HStack {
                                            ForEach(pathStep.stop.facilities, id: \.self) { facility in
                                                let imageResource = getImageResourceForFacility(facility)
                                                if let imageResource = imageResource {
                                                    Image(imageResource)
                                                        .resizable()
                                                        .aspectRatio(contentMode: .fit)
                                                        .frame(width: 30.0)
                                                        .accessibilityLabel(
                                                            imageResource == .cmFacilityTransitOffice ? Text("Perto do Espaço navegante, Ponto de atendimento ao passageiro") : imageResource == .cmFacilitySubway ? Text("Perto do Metro") : imageResource == .cmFacilityTrain ? Text("Perto do comboio") : imageResource == .cmFacilityLightRail ? Text("Perto do Metro Ligeiro") : imageResource == .cmFacilityBoat ? Text("Perto do Barco") : imageResource == .cmFacilitySchool ? Text("Perto da Escola") : imageResource == .cmFacilityShopping ? Text("Perto do centro comercial") : Text(""))
                                                }
                                            }
                                        }
                                        .padding(.vertical, 5)
                                    } else {
                                        Spacer()
                                            .frame(height: 30)
                                    }
                                }
                                
                                if let etas = etasWithStopIds?[pathStep.stop.id] {
                                    let nextEtas = filterAndSortCurrentAndFuturePatternETAs(etas)
                                    HStack(spacing: 20.0) {
                                        if let nextEtaEstimatedArrival = nextEtas.first?.estimatedArrivalUnix {
                                            HStack {
                                                let minutesToArrival = getRoundedMinuteDifferenceFromNow(nextEtaEstimatedArrival)
                                                
                                                
                                                PulseLabel(accent: .green, label: Text(minutesToArrival <= 1 ? "A chegar" : "\(String(minutesToArrival)) min"))
                                            }
                                        }
                                        if isSelectedByIndex {
                                            if nextEtas.count > 1 {
                                                NextEtasView(nextEtas: Array(nextEtas.first?.estimatedArrivalUnix != nil ? nextEtas.dropFirst().prefix(3) : nextEtas.prefix(3)))
                                            } else {
                                                Text("Sem próximas passagens.")
                                                    .font(.subheadline)
                                                    .italic()
                                                    .foregroundStyle(.secondary)
                                            }
                                        }
                                    }
                                } else {
                                    if isSelectedByIndex {
                                        LoadingBar(size: 10)
                                    }
                                }
                                
                                
                                
                                
                                if isSelectedByIndex {
                                    WrappingHStack(alignment: .leading) {
                                        Button {
                                            isSheetPresented.toggle()
                                        } label: {
                                            HStack {
                                                Image(systemName: "clock.badge")
                                                Text("Horários")
                                            }
                                        }
                                        .buttonStyle(StopOptionsButtonStyle())
                                        
                                        
                                        NavigationLink(destination: StopDetailsView(stop: stopsManager.stops.first(where: { $0.id == pathStep.stop.id })!, mapFlyToCoords: .constant(nil))) {
                                            HStack {
                                                Image(systemName: "mappin.and.ellipse")
                                                Text("Sobre a Paragem")
                                            }
                                        }.buttonStyle(StopOptionsButtonStyle())
                                        
//                                        Button {
//                                            
//                                        } label: {
//                                            HStack {
//                                                Image(systemName: "mappin.and.ellipse")
//                                                Text("Sobre a Paragem")
//                                            }
//                                        }
//                                        .buttonStyle(StopOptionsButtonStyle())
                                    }
                                }
                            }
                            .padding(.bottom, 10)
                        }
                        .padding(.leading, 10)
                        .padding(.vertical, isSelectedByIndex ? 10 : 0)
                        
                        Spacer() // extend to the edge of the screen
                    }
                    .padding(.horizontal)
                }
                .background(.cmSystemBackground200)
                .clipped()
                .shadow(color: .black.opacity(0.1), radius: isSelectedByIndex ? 20 : 0)
                .zIndex((isSelected || isSelectedByIndex) ? 1 : 0)
                .onTapGesture {
                    selectedStop = pathStep.stop
                    selectedStopIndex = pathStepIdx
                    
                }
            }
        }
        .onChange(of: pattern) {
            selectedStop = pattern.path.first?.stop // sunset this param;; selction is handled by index in pattern and NOT stop id as they might repeat
            selectedStopIndex = 0
        }
        .sheet(isPresented: $isSheetPresented) {
            VStack {
                HStack {
                    Text("Horários")
                        .font(.title2)
                        .bold()
                    Spacer()
                }
                .padding()
                
                HStack {
                    DatePicker("Selecione uma data",
                       selection: $selectedSchedulesDate,
                       displayedComponents: [.date]
                    )
                    .labelsHidden()
                    Spacer()
                }
                .padding(.horizontal)
                
                let scheduleColumns = schedulizeTripsForDateAndStop(stopId: pattern.path[selectedStopIndex].stop.id, trips: pattern.trips, date: selectedSchedulesDate)
                if scheduleColumns.count > 0 {
                    ScheduleView(scheduleColumns: scheduleColumns)
                        .padding()
                } else {
                    ContentUnavailableView("Sem horários para a data selecionada", systemImage: "calendar.badge.exclamationmark", description: Text("Experimente selecionar uma data mais próxima da atual.")) // TODO: need to make this manually for older OSes (only available on iOS 17)
                }
                Spacer()
            }
            .readHeight()
            .onPreferenceChange(HeightPreferenceKey.self) { height in
                if let height {
                    sheetHeight = height
                }
            }
            .presentationDetents([.height(sheetHeight)])
        }
    }
}

struct NextEtasView: View {
    let nextEtas: [PatternRealtimeETA]
    var body: some View {
        Image(systemName: "clock")
        ForEach(nextEtas, id: \.self) { eta in
            if let estimatedArrival = eta.estimatedArrival {
                let timeComponents = estimatedArrival.components(separatedBy: ":")
                Text(verbatim: "\(timeComponents[0]):\(timeComponents[1])")
                    .foregroundStyle(.green)
            } else if let scheduledArrival = eta.scheduledArrival {
                let timeComponents = scheduledArrival.components(separatedBy: ":")
                let arrivalWithoutSeconds = "\(timeComponents[0]):\(timeComponents[1])"
                let adjustedArrival = adjustTimeFormat(time: arrivalWithoutSeconds)
                Text(verbatim: adjustedArrival ?? arrivalWithoutSeconds)
            }
        }
    }
}

struct StopOptionsButtonStyle: ButtonStyle {
    func makeBody(configuration: ButtonStyleConfiguration) -> some View {
        configuration.label
            .padding(10)
            .foregroundColor(.secondary)
            .background(.quinary)
            .cornerRadius(10)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0) // Optional: Add a scale effect when pressed
            .animation(.easeInOut(duration: 0.1)) // Optional: Add animation for a smooth transition
    }
}

func getImageResourceForFacility(_ facility: Facility) -> ImageResource? {
    switch facility {
    case .boat:
        return .cmFacilityBoat
    case .lightRail:
        return .cmFacilityLightRail
    case .school:
        return .cmFacilitySchool
    case .shopping:
        return .cmFacilityShopping
    case .subway:
        return .cmFacilitySubway
    case .train:
        return .cmFacilityTrain
    case .transitOffice:
        return .cmFacilityTransitOffice
    default:
        return nil
    }
}

func schedulizeTripsForDateAndStop(stopId: String, trips: [Trip], date: Date) -> [ScheduleColumn] {
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyyMMdd"

    let formattedDate = dateFormatter.string(from: date)
    
    
    var schedules: [ScheduleColumn] = []
    
    for trip in trips {
        if trip.dates.contains(formattedDate) {
            for tripStep in trip.schedule {
                if tripStep.stopId == stopId {
                    let timeComponents = tripStep.arrivalTime.components(separatedBy: ":")
                    if let scheduleIdx = schedules.firstIndex(where: {$0.hour == Int(timeComponents[0])}) {
                        schedules[scheduleIdx].minutes.append(Int(timeComponents[1])!)
                    } else {
                        schedules.append(.init(hour: Int(timeComponents[0])!, minutes: [
                            Int(timeComponents[1])!
                        ]))
                    }
//                    rawSchedules.append(tripStep.arrivalTime)
                }
            }
        }
    }
    
    let sortedSchedules = schedules.sorted {
        $0.hour < $1.hour
    }
    
    return sortedSchedules
}


//#Preview {
//    
//    let route = RouteAPI(
//        id: "3536_0",
//        lineId: "3536",
//        shortName: "3536",
//        longName: "Cacilhas (Terminal) - Sesimbra (Terminal)",
//        color: "#C61D23",
//        textColor: "#FFFFFF",
//        patterns: [
//            "3536_0_1",
//            "3536_0_2"
//        ],
//        municipalities: [
//            "1503",
//            "1510",
//            "1511"
//        ],
//        localities: [
//            "Cacilhas",
//            "Cova da Piedade",
//            "Laranjeiro",
//            "Corroios",
//            "Sta. Marta do Pinhal",
//            "Sta. Marta de Corroios",
//            "Muxito",
//            "Seixal",
//            "Cruz de Pau",
//            "Foros de Amora",
//            "Paivas",
//            "Marco Severino",
//            "Fogueteiro",
//            "Fernão Ferro",
//            "Sesimbra",
//            "Carrasqueira",
//            "Quintinhas",
//            "Cotovia",
//            "Santana"
//        ],
//        facilities: []
//    )
//    
//    let pattern = Pattern(
//        id: "3536_0_1",
//        lineId: "3536",
//        routeId: "3536_0",
//        shortName: "3536",
//        direction: 0,
//        headsign: "Sesimbra (Terminal)",
//        color: "#C61D23",
//        textColor: "#FFFFFF",
//        validOn: [
//            "20230911",
//            "20230912",
//            "20230913",
//            "20230914",
//            "20230915",
//            "20230918",
//            "20230919",
//            "20230920",
//            "20230921",
//            "20230922",
//            "20230925",
//            "20230926",
//            "20230927",
//            "20230928",
//            "20230929",
//            "20231002",
//            "20231003",
//            "20231004",
//            "20231006",
//            "20231009",
//            "20231010",
//            "20231011",
//            "20231012",
//            "20231013",
//            "20231016",
//            "20231017",
//            "20231018",
//            "20231019",
//            "20231020",
//            "20231023",
//            "20231024",
//            "20231025",
//            "20231026",
//            "20231027",
//            "20231030",
//            "20231031",
//            "20231102",
//            "20231103",
//            "20231106",
//            "20231107",
//            "20231108",
//            "20231109",
//            "20231110",
//            "20231113",
//            "20231114",
//            "20231115",
//            "20231116",
//            "20231117",
//            "20231120",
//            "20231121",
//            "20231122",
//            "20231123",
//            "20231124",
//            "20231127",
//            "20231128",
//            "20231129",
//            "20231130",
//            "20231204",
//            "20231205",
//            "20231206",
//            "20231207",
//            "20231211",
//            "20231212",
//            "20231213",
//            "20231214",
//            "20231215",
//            "20231218",
//            "20231219",
//            "20231220",
//            "20231221",
//            "20231222",
//            "20240103",
//            "20240104",
//            "20240105",
//            "20240108",
//            "20240109",
//            "20240110",
//            "20240111",
//            "20240112",
//            "20240115",
//            "20240116",
//            "20240117",
//            "20240118",
//            "20240119",
//            "20240122",
//            "20240123",
//            "20240124",
//            "20240125",
//            "20240126",
//            "20240129",
//            "20240130",
//            "20240131",
//            "20240201",
//            "20240202",
//            "20240205",
//            "20240206",
//            "20240207",
//            "20240208",
//            "20240209",
//            "20240215",
//            "20240216",
//            "20240219",
//            "20240220",
//            "20240221",
//            "20240222",
//            "20240223",
//            "20240226",
//            "20240227",
//            "20240228",
//            "20240229",
//            "20240301",
//            "20240304",
//            "20240305",
//            "20240306",
//            "20240307",
//            "20240308",
//            "20240311",
//            "20240312",
//            "20240313",
//            "20240314",
//            "20240315",
//            "20240318",
//            "20240319",
//            "20240320",
//            "20240321",
//            "20240322",
//            "20240401",
//            "20240402",
//            "20240403",
//            "20240404",
//            "20240405",
//            "20240408",
//            "20240409",
//            "20240410",
//            "20240411",
//            "20240412",
//            "20240415",
//            "20240416",
//            "20240417",
//            "20240418",
//            "20240419",
//            "20240422",
//            "20240423",
//            "20240424",
//            "20240426",
//            "20240429",
//            "20240430",
//            "20240502",
//            "20240503",
//            "20240506",
//            "20240507",
//            "20240508",
//            "20240509",
//            "20240510",
//            "20240513",
//            "20240514",
//            "20240515",
//            "20240516",
//            "20240517",
//            "20240520",
//            "20240521",
//            "20240522",
//            "20240523",
//            "20240524",
//            "20240527",
//            "20240528",
//            "20240529",
//            "20240531",
//            "20240603",
//            "20240604",
//            "20240605",
//            "20240606",
//            "20240607",
//            "20240611",
//            "20240612",
//            "20240613",
//            "20240614",
//            "20240617",
//            "20240618",
//            "20240619",
//            "20240620",
//            "20240621",
//            "20240624",
//            "20240625",
//            "20240626",
//            "20240627",
//            "20240628",
//            "20230901",
//            "20230904",
//            "20230905",
//            "20230906",
//            "20230907",
//            "20230908",
//            "20231226",
//            "20231227",
//            "20231228",
//            "20231229",
//            "20240102",
//            "20240212",
//            "20240214",
//            "20240325",
//            "20240326",
//            "20240327",
//            "20240328",
//            "20230703",
//            "20230704",
//            "20230705",
//            "20230706",
//            "20230707",
//            "20230710",
//            "20230711",
//            "20230712",
//            "20230713",
//            "20230714",
//            "20230717",
//            "20230718",
//            "20230719",
//            "20230720",
//            "20230721",
//            "20230724",
//            "20230725",
//            "20230726",
//            "20230727",
//            "20230728",
//            "20230731",
//            "20230801",
//            "20230802",
//            "20230803",
//            "20230804",
//            "20230807",
//            "20230808",
//            "20230809",
//            "20230810",
//            "20230811",
//            "20230814",
//            "20230816",
//            "20230817",
//            "20230818",
//            "20230821",
//            "20230822",
//            "20230823",
//            "20230824",
//            "20230825",
//            "20230828",
//            "20230829",
//            "20230830",
//            "20230831",
//            "20230916",
//            "20230923",
//            "20230930",
//            "20231007",
//            "20231014",
//            "20231021",
//            "20231028",
//            "20231104",
//            "20231111",
//            "20231118",
//            "20231125",
//            "20231202",
//            "20231209",
//            "20231216",
//            "20240106",
//            "20240113",
//            "20240120",
//            "20240127",
//            "20240203",
//            "20240210",
//            "20240217",
//            "20240224",
//            "20240302",
//            "20240309",
//            "20240316",
//            "20240406",
//            "20240413",
//            "20240420",
//            "20240427",
//            "20240504",
//            "20240511",
//            "20240518",
//            "20240525",
//            "20240601",
//            "20240608",
//            "20240615",
//            "20240622",
//            "20240629",
//            "20230902",
//            "20230909",
//            "20231223",
//            "20231230",
//            "20240213",
//            "20240323",
//            "20240330",
//            "20230701",
//            "20230708",
//            "20230715",
//            "20230722",
//            "20230729",
//            "20230805",
//            "20230812",
//            "20230819",
//            "20230826",
//            "20230917",
//            "20230924",
//            "20231001",
//            "20231005",
//            "20231008",
//            "20231015",
//            "20231022",
//            "20231029",
//            "20231101",
//            "20231105",
//            "20231112",
//            "20231119",
//            "20231126",
//            "20231201",
//            "20231203",
//            "20231208",
//            "20231210",
//            "20231217",
//            "20240107",
//            "20240114",
//            "20240121",
//            "20240128",
//            "20240204",
//            "20240211",
//            "20240218",
//            "20240225",
//            "20240303",
//            "20240310",
//            "20240317",
//            "20240407",
//            "20240414",
//            "20240421",
//            "20240425",
//            "20240428",
//            "20240501",
//            "20240505",
//            "20240512",
//            "20240519",
//            "20240526",
//            "20240530",
//            "20240602",
//            "20240609",
//            "20240610",
//            "20240616",
//            "20240623",
//            "20240630",
//            "20230903",
//            "20230910",
//            "20240324",
//            "20240329",
//            "20240331",
//            "20230702",
//            "20230709",
//            "20230716",
//            "20230723",
//            "20230730",
//            "20230806",
//            "20230813",
//            "20230815",
//            "20230820",
//            "20230827"
//        ],
//        municipalities: [
//            "1503",
//            "1510",
//            "1511"
//        ],
//        localities: [
//            "Cacilhas",
//            "Cova da Piedade",
//            "Laranjeiro",
//            "Corroios",
//            "Sta. Marta do Pinhal",
//            "Sta. Marta de Corroios",
//            "Muxito",
//            "Seixal",
//            "Cruz de Pau",
//            "Foros de Amora",
//            "Paivas",
//            "Marco Severino",
//            "Fogueteiro",
//            "Fernão Ferro",
//            "Sesimbra",
//            "Carrasqueira",
//            "Quintinhas",
//            "Cotovia",
//            "Santana"
//        ],
//        facilities: [],
//        shapeId: "p2_3536_0_1",
//        path: [],
//        trips: []
//    )
//    
//    
//    RouteDetailsView(route: route)
//}
