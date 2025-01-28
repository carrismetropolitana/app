//
//  VehicleLivePatternLiveActivity.swift
//  VehicleLivePattern
//
//  Created by João Pereira on 22/08/2024.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct VehicleLivePatternAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var nextStopName: String
        var nextStopIndex: Int
        var etaMinutesToSubscribedStop: Int
    }

    // Fixed non-changing properties about your activity go here!
    var patternHeadsign: String
    var lineShortName: String
    var lineColor: String
    var patternStopsCount: Int
    var vehicleId: String
}

struct VehicleLivePatternLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: VehicleLivePatternAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                VStack {
                    Text("Próxima paragem".uppercased())
                        .bold().font(.caption)
                }
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Capsule()
                        .fill(Color(hex: context.attributes.lineColor))
                        .frame(width: 60, height: 25)
                        .overlay {
                            Text(context.attributes.lineShortName)
                                .fontWeight(.heavy)
                        }
                        .padding(.leading)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    HStack(alignment: .lastTextBaseline, spacing: 4) {
                        Text(verbatim: "\(context.state.etaMinutesToSubscribedStop)")
                            .font(.system(size: 20, design: .rounded))
                            .fontWeight(.heavy)
                            .foregroundStyle(.green)
                        Text(verbatim: "min")
                            .font(.system(size: 14, design: .rounded))
                            .fontWeight(.heavy)
                            .foregroundStyle(.green)
                    }.padding(.trailing)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    HStack {
                        VStack(alignment: .leading) {
//                            HStack {
//                                Image(systemName: "arrow.right")
//                                    .bold()
//                                    .foregroundStyle(.secondary)
//                                Text("\(context.attributes.patternHeadsign)")
//                                    .fontWeight(.heavy)
//                            }
                            VStack(alignment: .leading) {
                                Text("Próxima paragem".uppercased())
                                    .fontWeight(.heavy)
                                    .foregroundStyle(.secondary)
                                    .font(.footnote)
                                
                                Text(context.state.nextStopName)
                                    .font(.title3)
                                    .fontWeight(.black)
                                    .lineLimit(1)
                            }
                            .padding(.horizontal)
                            
                            
                            BusTrack(stopsCount: context.attributes.patternStopsCount, nextStopIndex: context.state.nextStopIndex)
                                .offset(y: 10)
                        }
                    }
                    .padding(.top, 2.0)
                }
            } compactLeading: {
                Capsule()
                    .fill(Color(hex: context.attributes.lineColor))
                    .frame(minWidth: 50)
                    .overlay {
                        Text(context.attributes.lineShortName)
                            .fontWeight(.heavy)
                    }
            } compactTrailing: {
                HStack(alignment: .lastTextBaseline, spacing: 4) {
                    Text(verbatim: "\(context.state.etaMinutesToSubscribedStop)")
                        .font(.system(size: 20, design: .rounded))
                        .fontWeight(.heavy)
                        .foregroundStyle(.green)
                    Text(verbatim: "min")
                        .font(.system(size: 14, design: .rounded))
                        .fontWeight(.heavy)
                        .foregroundStyle(.green)
                }
            } minimal: {
                Text(verbatim: "\(context.state.etaMinutesToSubscribedStop)")
                    .font(.system(size: 18, design: .rounded))
                    .fontWeight(.heavy)
                    .foregroundStyle(.cmYellow)
//                Text("🚌")
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension VehicleLivePatternAttributes {
    fileprivate static var preview: VehicleLivePatternAttributes {
        VehicleLivePatternAttributes(patternHeadsign: "Colégio Militar", lineShortName: "1523", lineColor: "#C61D23", patternStopsCount: 30, vehicleId: "42|1234")
    }
}

extension VehicleLivePatternAttributes.ContentState {
    fileprivate static var preview: VehicleLivePatternAttributes.ContentState {
        VehicleLivePatternAttributes.ContentState(nextStopName: "Rua Edgar Marmota", nextStopIndex: 4, etaMinutesToSubscribedStop: 15)
     }
//     
//     fileprivate static var starEyes: VehicleLivePatternAttributes.ContentState {
//         VehicleLivePatternAttributes.ContentState(
//     }
}

#Preview("LockScreen", as: .content, using: VehicleLivePatternAttributes.preview) {
   VehicleLivePatternLiveActivity()
} contentStates: {
    VehicleLivePatternAttributes.ContentState.preview
//    VehicleLivePatternAttributes.ContentState.starEyes
}

#Preview("DynamicIslandCompact", as: .dynamicIsland(.compact), using: VehicleLivePatternAttributes.preview) {
    VehicleLivePatternLiveActivity()
} contentStates: {
    VehicleLivePatternAttributes.ContentState.preview
}

#Preview("DynamicIslandExpanded", as: .dynamicIsland(.expanded), using: VehicleLivePatternAttributes.preview) {
    VehicleLivePatternLiveActivity()
} contentStates: {
    VehicleLivePatternAttributes.ContentState.preview
}

#Preview("DynamicIslandMinimal", as: .dynamicIsland(.minimal), using: VehicleLivePatternAttributes.preview) {
    VehicleLivePatternLiveActivity()
} contentStates: {
    VehicleLivePatternAttributes.ContentState.preview
}

extension Color {
    init(hex: String) {
        var cleanHexCode = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        cleanHexCode = cleanHexCode.replacingOccurrences(of: "#", with: "")
//        print(cleanHexCode)
        var rgb: UInt64 = 0
        
        Scanner(string: cleanHexCode).scanHexInt64(&rgb)
        
        let redValue = Double((rgb >> 16) & 0xFF) / 255.0
        let greenValue = Double((rgb >> 8) & 0xFF) / 255.0
        let blueValue = Double(rgb & 0xFF) / 255.0
        self.init(red: redValue, green: greenValue, blue: blueValue)
    }
}

struct BusTrack: View {
    let stopsCount: Int
    let nextStopIndex: Int
    
    var body: some View {
        GeometryReader { geo in
            ZStack {
                Capsule()
                    .fill(.gray.opacity(0.3))
                    .frame(height: 14)
                    .padding(.horizontal, 5.0)
//                    .overlay {
//                        HStack(spacing: 3.0) {
//                            ForEach(1...stopsCount - nextStopIndex, id: \.self) { stopIndex in
//                                Circle()
//                                    .frame(height: 6.0)
//                            }
//                        }
//                        .padding(.leading, geo.size.width - ((geo.size.width - 10.0) / 1.4))
//                    }
                Capsule()
                    .fill(.green)
                    .frame(height: 14)
                    .overlay {
                        HStack {
                            Spacer()
                            Circle()
                                .fill(.white)
                                .frame(width: 5.0)
                        }
                        .padding(.trailing, 5.0)
                    }
                    .padding(.horizontal, 5.0)
                    .padding(.trailing, (geo.size.width - 10.0) / 1.4)
                    
                Circle()
                    .fill(.white)
                    .frame(width: 25.0)
                    .shadow(color: .black.opacity(0.2) ,radius: 10)
                    .overlay {
                        Circle()
                            .fill(.blue)
                            .padding(5.0)
                    }
                    .offset(x: 50)
            }
        }
    }
}
