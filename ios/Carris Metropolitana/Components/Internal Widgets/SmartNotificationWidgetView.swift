//
//  SmartNotificationWidgetView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/03/2024.
//

import SwiftUI

struct SmartNotificationSchedule {
    let weekdays: [Weekday]
    let startHour: DateComponents
    let endHour: DateComponents
}

struct SmartNotificationConfiguration {
    let line: Line // or route/pattern??
    let stop: Stop
    let schedule: SmartNotificationSchedule
    let conditionType: ConditionValueType
    let conditionValue: Int
}

struct SmartNotificationWidgetView: View {
//    let config: SmartNotificationConfiguration
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                VStack(alignment: .leading) {
                    Text(verbatim: "Hospital (Elvas)")
                        .bold()
                    HStack {
                        Text(verbatim: "Cova da Piedade, Almada")
                            .foregroundStyle(.secondary)
                        Text(verbatim: "020497")
                            .font(.custom("Menlo", size: 12.0).monospacedDigit())
//                                    .font(.footnote)
                            .bold()
                            .foregroundStyle(.gray)
                            .padding(.horizontal, 10)
                            .background(Capsule().stroke(.gray, lineWidth: 2.0))
                    }
                }
                Spacer()
                Image(systemName: "bell.badge.fill")
                    .foregroundStyle(.white)
                    .padding()
                    .background {
                        ZStack {
                            Circle()
                                .fill(Color(hex: "0C807E"))
                                .frame(height: 35)
                            Circle()
                                .fill(Color(hex: "0C807E"))
                                .opacity(0.1)
                        }
                    }
            }
            .padding(.leading, 15)
            .padding(.trailing, 5)
            .padding(.vertical, 10)
            
            Rectangle()
                .fill(.gray.opacity(0.1))
                .frame(height: 3.0)
            
            HStack {
                Text(verbatim: "\(Image(systemName: "bell.badge")) 7:30 \(Image(systemName: "arrow.right")) 8:30")
                    .foregroundStyle(Color(hex:"5f5f5f"))
                    .bold()
                    .padding(5.0)
                    .background(RoundedRectangle(cornerRadius: 5.0).fill(.quinary))
                
                Text(verbatim: "S  T  Q  Q  S  S  D")
                    .foregroundStyle(Color(hex:"5f5f5f"))
                    .bold()
                    .padding(5.0)
                    .background(RoundedRectangle(cornerRadius: 5.0).fill(.quinary))
                
                Spacer()
            }
            .padding(10)
            
            Rectangle()
                .fill(.gray.opacity(0.1))
                .frame(height: 3.0)
            
            Spacer()
                .frame(height: 300)
        }
        .background(
            RoundedRectangle(cornerRadius: 15.0)
                .fill(.white)
        )
    }
}

#Preview {
    SmartNotificationWidgetView()
        .shadow(color: .gray.opacity(0.3), radius: 20)
        .padding()
}
