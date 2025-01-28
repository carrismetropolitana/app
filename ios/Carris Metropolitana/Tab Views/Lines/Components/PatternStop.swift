//
//  PatternStop.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 28/05/2024.
//

import SwiftUI

enum PatternStopPosition {
    case start, middle, end
}

struct PatternStop: View {
//    let stop: Stop
    //    let etas: [RealtimeETA]
    let active: Bool
    let expanded: Bool
    let isNextStop: Bool
    let relativePosition: PatternStopPosition
    let text: String
    
    
    /*
     Constants
     */
    
    let nextStopTopPadding = 20.0
    
    
    /* VIEW */
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(verbatim: "Stop Name \(text)")
                    .fontWeight(expanded ? .heavy : .semibold)
                    .font(.callout)
                    .foregroundStyle(.primary)
                Text(verbatim: "Locality, Municipality")
                    .fontWeight(.semibold)
                    .font(.system(size: 14.0))
                    .foregroundStyle(.secondary)
            }
            .padding(.bottom)
            .padding(.leading, 50.0)
            .padding(.top, isNextStop ? nextStopTopPadding : 0.0)
            .background {
                HStack(alignment: .top, spacing: 2) {
                    UnevenRoundedRectangle(cornerRadii: getCornerRadii(for: relativePosition))
                        .fill(active ? .red : Color(hex: "F0F0FA"))
                        .frame(width: 15.0)
                        .padding(.horizontal)
                        .overlay {
                            VStack {
                                if (relativePosition != .end) {
                                    Circle()
                                        .fill(active ? .white : .gray.opacity(0.5))
                                        .frame(height: 5.0)
                                        .padding(.top, 7)
                                        .padding(.top, isNextStop ? nextStopTopPadding : 0.0)
                                }
                                Spacer()
                                if (relativePosition == .end) {
                                    Circle()
                                        .fill(active ? .white : .gray.opacity(0.5))
                                        .frame(height: 5.0)
                                        .padding(.bottom, 7)
                                        .padding(.top, isNextStop ? nextStopTopPadding : 0.0)
                                }
                            }
                        }
                        .background {
                            VStack {
                                if (relativePosition == .end) {
                                    Spacer()
                                }
                                Text(verbatim: "—")
                                    .bold()
                                    .offset(x: 10)
                                    .frame(height: 6.0)
                                    .padding(.top, relativePosition != .end ? 5.0 : 0.0)
                                    .padding(.bottom, relativePosition == .end ? 10.0 : 0.0)
                                    .padding(.top, isNextStop ? nextStopTopPadding : 0.0)
                                if (relativePosition != .end) {
                                    Spacer()
                                }
                            }
                        }
                        .padding(.top, relativePosition == .start ? 1.0 : 0.0)
                        .padding(.bottom, relativePosition == .end ? 35.0 : 0.0)
                    Spacer()
                }
            }
            Spacer()
        }
    }
    
    /* Helpers */
    private func getCornerRadii(for relativePosition: PatternStopPosition) -> RectangleCornerRadii {
        switch relativePosition {
        case .start:
            RectangleCornerRadii(topLeading: 10.0, topTrailing: 10.0)
        case .end:
            RectangleCornerRadii(bottomLeading: 10.0, bottomTrailing: 10.0)
        case .middle:
            RectangleCornerRadii()
        }
    }
}

struct PatternStopWithInvisibleLeg: View {
    let stop: Stop
    //    let etas: [RealtimeETA]
    let active: Bool
    let expanded: Bool
    let isNextStop: Bool
    let relativePosition: PatternStopPosition
    let text: String
    
    
    /*
     Constants
     */
    
    let nextStopTopPadding = 20.0
    
    
    /* VIEW */
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(stop.name)
                    .fontWeight(expanded ? .heavy : .semibold)
                    .font(.callout)
                    .foregroundStyle(.primary)
                    .lineLimit(1)
                    .accessibilityLabel(Text("Paragem "))
                    .accessibilityValue(Text(stop.ttsName ?? stop.name))
                Text(stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)")
                    .fontWeight(.semibold)
                    .font(.system(size: 14.0))
                    .foregroundStyle(.secondary)
                    .accessibilityLabel(Text("Situada em "))
                    .accessibilityValue(Text(stop.locality == stop.municipalityName || stop.locality == nil ? stop.municipalityName : "\(stop.locality!), \(stop.municipalityName)"))
            }
            .padding(.bottom)
            .padding(.leading, 50.0)
            .padding(.top, isNextStop ? nextStopTopPadding : 0.0)
            .background {
                HStack(alignment: .top, spacing: 2) {
                    UnevenRoundedRectangle(cornerRadii: getCornerRadii(for: relativePosition))
                        .fill(.clear)
                        .frame(width: 15.0)
                        .padding(.horizontal)
                        .overlay {
                            VStack {
                                if (relativePosition != .end) {
                                    Circle()
                                        .fill(active ? .white : .gray.opacity(0.5))
                                        .frame(height: 5.0)
                                        .padding(.top, 7)
                                        .padding(.top, isNextStop ? nextStopTopPadding : 0.0)
                                }
                                Spacer()
                                if (relativePosition == .end) {
                                    Circle()
                                        .fill(active ? .white : .gray.opacity(0.5))
                                        .frame(height: 5.0)
                                        .padding(.bottom, 7)
                                        .padding(.top, isNextStop ? nextStopTopPadding : 0.0)
                                }
                            }
                        }
                        .background {
                            VStack {
                                if (relativePosition == .end) {
                                    Spacer()
                                }
                                Text(verbatim: "—")
                                    .bold()
                                    .offset(x: 12)
                                    .frame(height: 6.0)
                                    .padding(.top, relativePosition != .end ? 5.0 : 0.0)
                                    .padding(.bottom, relativePosition == .end ? 10.0 : 0.0)
                                    .padding(.top, isNextStop ? nextStopTopPadding : 0.0)
                                    .frame(width: 10.0)
                                    .accessibilityLabel(Text("Paragem na espinha da linha"))
                                if (relativePosition != .end) {
                                    Spacer()
                                }
                            }
                        }
                        .padding(.top, relativePosition == .start ? 1.0 : 0.0)
                        .padding(.bottom, relativePosition == .end ? 35.0 : 0.0)
                    Spacer()
                }
            }
            Spacer()
        }
    }
    
    /* Helpers */
    private func getCornerRadii(for relativePosition: PatternStopPosition) -> RectangleCornerRadii {
        switch relativePosition {
        case .start:
            RectangleCornerRadii(topLeading: 10.0, topTrailing: 10.0)
        case .end:
            RectangleCornerRadii(bottomLeading: 10.0, bottomTrailing: 10.0)
        case .middle:
            RectangleCornerRadii()
        }
    }
}

//#Preview {
//    PatternStop(
//        stop: .init(
//            id: "121270",
//            name: "Oeiras (Estação) P8 Entrada Norte",
//            shortName: "a definir",
//            ttsName: "Oeiras ( - Estaçaão ) ( P 8 ) Entrada Norte . ( Há correspondência ) com o combóio",
//            lat: "38.688615",
//            lon: "-9.316617",
//            locality: "Oeiras",
//            parishId: nil,
//            parishName: nil,
//            municipalityId: "1110",
//            municipalityName: "Oeiras",
//            districtId: "11",
//            districtName: "Lisboa",
//            regionId: "PT170",
//            regionName: "AML",
//            wheelchairBoarding: "0",
//            facilities: [.train],
//            lines: ["1523","1604","1614","1615"],
//            routes: ["1523_0","1604_0","1604_1","1604_2","1614_0","1614_1","1615_0","1615_1"],
//            patterns: ["1523_0_1","1523_0_2","1604_0_1","1604_0_2","1604_1_3","1604_2_2","1614_0_1","1614_1_1","1615_0_1","1615_1_1"]
//        ),
//        etas: [
//            .init(
//                lineId: "1523",
//                patternId: "1523_0_1",
//                routeId: "1523_0",
//                tripId: "1523_0_1_1830_1859_0_1_1WVS0",
//                headsign: "Oeiras (Estação Norte)",
//                stopSequence: 37,
//                scheduledArrival: "19:24:00",
//                scheduledArrivalUnix: 1716920640,
//                estimatedArrival: "19:19:13",
//                estimatedArrivalUnix: 1716920353,
//                observedArrival: nil,
//                observedArrivalUnix: nil,
//                vehicleId: "41|1351"
//            )
//        ],
//        expanded: false,
//        relativePosition: .middle
//    )
//}


struct CollapsedPatternStop: View {
//    let stops: [Stop]
    let collapsedStops: Int
    
    var body: some View {
        HStack {
            Text("+\(collapsedStops) paragens escondidas")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .padding(.vertical, 30.0)
                .padding(.leading, 50.0)
                .background {
                    HStack {
                        Rectangle()
                            .fill(Color(hex: "F0F0FA"))
                            .frame(width: 15.0)
                            .padding(.horizontal)
                            .overlay {
                                VStack {
                                    ForEach(0..<3) {_ in
                                        Circle()
                                            .fill(.tertiary)
                                            .frame(height: 5.0)
                                    }
                                }
                            }
                        Spacer()
                    }
                }
            Spacer()
        }
    }
}

enum PatternLegsType {
    case line, vehicle
}

//struct PatternLegsFull: View {
//    let stops: [Stop]
//    let patternType: PatternLegsType
//    
//    
//    var body: some View {
//        ForEach(stops.indices, id: \.hashValue) { stopIndex in
//            let stop = stops[stopIndex]
//            
//            PatternStop(stop: stop, active: true, expanded: false, isNextStop: false, relativePosition: <#T##PatternStopPosition#>)
//        }
//    }
//}

struct TestPreview: View {
    @State private var circlePosition: CGFloat = 0
    @State private var ____test_isRandomStopActive = true
    @State private var stops: [Stop] = []
    @State private var patternLegsHeights: [CGFloat] = []
    
    @State private var isCollapsed = true
    
    @State private var nextStopIndex = 5
    
//    let nextStopIndex = 5
    let circleDistanceFromPathStep: CGFloat = 30.0
    
    var body: some View {
        VStack {
            if (stops.count > 0) {
                VStack {
                    Stepper("Next Stop Index", value: $nextStopIndex.animation(.snappy), in: 1...stops.count-1)
                        .padding()
                    Text(verbatim: "Stops: \(stops.count)")
                    Text(verbatim: "Pattern Legs Heights: \(patternLegsHeights.count)")
                    Text(String(describing: patternLegsHeights))
                }
            }
            ScrollView {
                VStack(spacing: 0) {
        //            Group {
        //                PatternStop(active: false, expanded: false, isNextStop: false, relativePosition: .start)
        //                //            PatternStop(active: false, expanded: false, relativePosition: .middle)
        //                CollapsedPatternStop()
        //                
        //                PatternStop(active: false, expanded: false, isNextStop: false, relativePosition: .middle)
        //                
        //                PatternStop(active: true, expanded: false, isNextStop: false, relativePosition: .middle)
        //                PatternStop(active: true, expanded: false, isNextStop: true, relativePosition: .middle)
        //                    .background(GeometryReader { geometry in
        //                                            Color.clear
        //                                                .onAppear {
        //                                                    withAnimation(.easeInOut(duration: 1.0)) {
        //                                                        circlePosition = geometry.frame(in: .global).midY
        //                                                    }
        //                                                }
        //                                        })
        //                PatternStop(active: ____test_isRandomStopActive, expanded: false, isNextStop: false, relativePosition: .middle)
        //                    .onTapGesture {
        //                        withAnimation {
        //                            ____test_isRandomStopActive.toggle()
        //                        }
        //                    }
        //                
        //                PatternStop(active: true, expanded: false, isNextStop: false, relativePosition: .end)
        //                    
        //                
        //            }
                    ForEach(stops.indices, id: \.hashValue) { stopIndex in
                        if (stopIndex == 1 && nextStopIndex > 3) {
                            CollapsedPatternStop(collapsedStops: nextStopIndex - 1)
                                .background(GeometryReader { geo in
                                    Color.clear
                                        .onAppear { // on collapse, reduce array size and consider the heigth of the collapsed stops
                                            DispatchQueue.main.async {
                                                var newPatternLegsHeights = [patternLegsHeights[0], geo.size.height]
                                                newPatternLegsHeights.append(contentsOf: Array(patternLegsHeights.suffix(from: nextStopIndex - 1)))
                                                patternLegsHeights = newPatternLegsHeights
                                            }
                                        }
                                        .onChange(of: geo.size.height) { // on collapse, reduce array size and consider the heigth of the collapsed stops
                                            DispatchQueue.main.async {
                                                var newPatternLegsHeights = [patternLegsHeights[0], geo.size.height]
                                                newPatternLegsHeights.append(contentsOf: Array(patternLegsHeights.suffix(from: nextStopIndex - 1)))
                                                patternLegsHeights = newPatternLegsHeights
                                            }
                                        }
                                        .overlay {
                                            HStack {
                                                Spacer()
                                                Text(verbatim: "\(geo.size.height)")
                                            }
                                        }
                                })
                        } else if (stopIndex > 1 && stopIndex < nextStopIndex - 1) {
                            EmptyView()
                                .onAppear {
                                    DispatchQueue.main.async {
                                        patternLegsHeights[stopIndex] = 0.0
                                    }
                                }
                        } else {
                            PatternStop(active: stopIndex > nextStopIndex-1, expanded: false, isNextStop: stopIndex == nextStopIndex, relativePosition: stopIndex == 0 ? .start : stopIndex == stops.count - 1 ? .end : .middle, text: "\(stopIndex)")
                                .background(GeometryReader { geo in
                                    Color.clear
                                        .onAppear {
                                            patternLegsHeights.append(geo.size.height)
                                        }
                                        .onChange(of: geo.size.height) { // on collapse, reduce array size and consider the heigth of the collapsed stops
                                            DispatchQueue.main.async {
                                                if patternLegsHeights.count == stops.count {
                                                    print(patternLegsHeights)
                                                    patternLegsHeights[stopIndex] = geo.size.height
                                                }
                                            }
                                        }
                                        .overlay {
                                            HStack {
                                                Spacer()
                                                Text(verbatim: "\(geo.size.height)")
                                            }
                                        }
                                })
                        }
                    }
                }
                .onAppear {
                    Task {
                        stops = Array(await CMAPI.shared.getStops().prefix(upTo: 20))
                        print(stops[0])
                    }
                }
    //            .onChange(of: patternLegsHeights) {
    //                if patternLegsHeights.count < stops.count {
    //                    patternLegsHeights = []
    //                }
    //            }
                .overlay {
                    HStack {
                        VStack {
                            Circle()
                                .fill(.black)
                                .frame(height: 15.0)
                                .overlay {
                                    Image(systemName: "chevron.down")
                                        .foregroundStyle(.white)
                                        .font(.system(size: 10.0))
                                        .bold()
                                }
                                .offset(y: patternLegsHeights.count > 0 ? patternLegsHeights.prefix(upTo: nextStopIndex).reduce(0, +) - circleDistanceFromPathStep : 0.0)
                            Spacer()
                        }
                        Spacer()
                    }
                    .padding(.leading)
                }
            }
        }
    }
}

struct PatternItemBoundsPreferenceKey: PreferenceKey {
    typealias Value = CGFloat?
    static var defaultValue: CGFloat? = nil
    static func reduce(value: inout CGFloat?, nextValue: () -> CGFloat?) {
        if let nextValue = nextValue() {
            value = nextValue
        }
    }
}


enum VehicleStatus {
    case inTransitTo, incomingAt, stoppedAt
}

struct OtherTestPreview: View {
    let stops: [Stop]
    let nextStopIndex: Int
    let vehicleStatus: VehicleStatus?
    let lineColor: Color
    
    @State private var circlePosition: CGFloat = 0
    @State private var ____test_isRandomStopActive = true
//    @State private var stops: [Stop] = []
    @State private var patternLegsHeights: [CGFloat] = []
    
    
    @State private var isCircleAnimating = false
    
    @State private var isCollapsed = true
    
    @State private var activeLegTopPadding = 0.0
    
//    @State private var nextStopIndex = 5
    
    //    let nextStopIndex = 5
    let circleDistanceFromPathStep: CGFloat = 30.0
    
    
    
    @State private var scale: CGFloat = 1.0
    
    
    var body: some View {
        VStack {
//            if (stops.count > 0) {
//                VStack {
//                    Stepper("Active Leg Top Padding", value: $activeLegTopPadding.animation(.snappy), step: 30)
//                        .padding()
//                    Stepper("Next Stop Index", value: $nextStopIndex.animation(.snappy), in: 1...stops.count-1)
//                        .padding()
//                    Text("Stops: \(stops.count)")
//                }
//            }
            VStack(spacing: 0) {
                ForEach(stops.indices, id: \.hashValue) { stopIndex in
                    if (stopIndex == 1 && nextStopIndex > 3 && isCollapsed) {
                        CollapsedPatternStop(collapsedStops: nextStopIndex - 2)
                            .onAppear {
                                print("Some stops are collapsed")
                            }
                            .onDisappear {
                                print("No stops are collapsed")
                            }
                            .onTapGesture {
                                withAnimation {
                                    isCollapsed.toggle()
                                }
                                
                                DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                                    withAnimation {
                                        isCollapsed.toggle()
                                    }
                                }
                            }
                    } else if (stopIndex > 1 && stopIndex < nextStopIndex - 1 && isCollapsed) {
                        EmptyView()
                    } else {
                        PatternStopWithInvisibleLeg(stop: stops[stopIndex], active: stopIndex > nextStopIndex-1, expanded: false, isNextStop: stopIndex == nextStopIndex, relativePosition: stopIndex == 0 ? .start : stopIndex == stops.count - 1 ? .end : .middle, text: "\(stopIndex)")
                            .animation(.snappy, value: stopIndex == nextStopIndex)
                            .accessibilityElement(children: .combine)
                            .accessibilityLabel(stopIndex == nextStopIndex ? "Próxima paragem deste veículo, paragem \(stopIndex+1) de \(stops.count)." : stopIndex > nextStopIndex ? "Paragem futura deste veículo, paragem \(stopIndex+1) de \(stops.count)." : "Paragem anterior deste veículo, paragem \(stopIndex+1) de \(stops.count).")
                            .accessibilityAddTraits(stopIndex == nextStopIndex ? .isSelected : .updatesFrequently)
                    }
                }
            }
            .background {
                HStack {
                    RoundedRectangle(cornerRadius: 10.0)
                        .fill(Color(hex: "F0F0FA"))
                        .frame(width: 15.0)
                        .overlay {
                            RoundedRectangle(cornerRadius: 10.0)
                                .fill(lineColor)
                                .frame(width: 15.0)
                                .padding(.horizontal)
                                .padding(.top, getActiveLegTopPadding())
                                .animation(.default, value: getActiveLegTopPadding())
                            
                        }
                        .padding(.horizontal)
                        .padding(.bottom, 35.0)
                    Spacer()
                }
            }
            .overlay {
                HStack {
                    VStack {
                        Circle()
                            .fill(.black)
                            .frame(height: 15.0)
                            .overlay {
                                Image(systemName: "chevron.down")
                                    .foregroundStyle(.white)
                                    .font(.system(size: 10.0))
                                    .bold()
                                    .accessibilityLabel(Text("O veículo está a chegar em tempo real à paragem seguinte"))
                            }
                            .scaleEffect(scale)
                            .animation(vehicleStatus == .incomingAt ? Animation.easeInOut(duration: 1).repeatForever(autoreverses: true) : .default, value: scale)
                            .animation(.default, value: getActiveLegTopPadding())
                            .onAppear {
                                if vehicleStatus == .incomingAt  {
                                    self.scale = 1.5
                                }
                            }
                            .onChange(of: vehicleStatus) {
                                if vehicleStatus == .incomingAt  {
                                    self.scale = 1.5
                                } else {
                                    self.scale = 1.0
                                }
                            }
                        Spacer()
                    }
                    .padding(.horizontal)
                    .padding(.top, getActiveLegTopPadding())
                    
                    
                    Spacer()
                }
            }
        }
//        .onAppear {
//            Task {
//                stops = Array(await CMAPI.shared.getStops().prefix(upTo: 20))
//                print(stops[0])
//            }
//        }
    }
    
    func getActiveLegTopPadding() -> CGFloat {
        let sum: CGFloat = vehicleStatus == .stoppedAt ? 30.0 : vehicleStatus == .incomingAt ? 15.0 : 0.0
        if (!isCollapsed &&  getStopsCollapsed() > 0) {
            return CGFloat(50 * getStopsCollapsed()) + 70 + sum
        }
        if (getStopsCollapsed() > 0) {
            return 50 + 70 + 50 + sum
        }
        return (CGFloat(nextStopIndex) * 51) - CGFloat(getStopsCollapsed()) * 15 + sum
    }
    
    
    func getStopsCollapsed() -> Int {
        if (nextStopIndex > 3) { // stops collapsed
            return nextStopIndex - 1
        }
        return 0
    }
}


//#Preview {
//    OtherTestPreview()
//}
