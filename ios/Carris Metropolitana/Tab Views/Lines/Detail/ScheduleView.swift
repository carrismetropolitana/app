//
//  ScheduleView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 27/03/2024.
//

import SwiftUI

struct ScheduleColumn {
    let hour: Int
    var minutes: [Int]
}

struct ScheduleView: View {
    let scheduleColumns: [ScheduleColumn]
    
    var body: some View {
        WrappingHStack(alignment: .topLeading, horizontalSpacing: 0.0) {
            VStack {
                ColumnHeading(text: Text("Hora", comment: "Na primeira coluna dos horários na paragem")
                    .foregroundStyle(.white), cornerRadii: .init(topLeading: 25.0, bottomLeading: 25.0), width: 50.0)
                    .accessibilityHidden(true)
                Text(verbatim: "Min")
                    .accessibilityHidden(true)
            }
            ForEach(scheduleColumns.indices, id: \.self) { colIdx in
                let isFirst = colIdx == 0
                let isLast = colIdx == scheduleColumns.count - 1
                let col = scheduleColumns[colIdx]
                let nextColumnIsConsecutiveHour = !isLast /* last column has no next one */ && (col.hour == scheduleColumns[colIdx + 1].hour - 1)
                VStack {
                    ColumnHeading(
                        text: Text(
                            String(col.hour)
                                .paddedWithLeadingZeros(minLength: 2)
                        )
                        .foregroundStyle(.white),
                        cornerRadii: .init(bottomTrailing: isLast ? 25.0 : 0, topTrailing: isLast ? 25.0 : 0),
                        width: 30.0
                    )
                    .accessibilityHidden(true)
                    ForEach(col.minutes, id: \.self) { minute in
                        Text(String(minute).paddedWithLeadingZeros(minLength: 2))
                            .accessibilityLabel("\(col.hour) horas e \(minute) minutos")
                    }
                }
                if !nextColumnIsConsecutiveHour {
                    Spacer()
                        .frame(width: 3.0)
                }
            }
        }
    }
}


struct ColumnHeading: View {
    let text: Text
    let cornerRadii: RectangleCornerRadii
    let width: CGFloat
    
    var body: some View {
        UnevenRoundedRectangle(cornerRadii: cornerRadii).fill(.black).frame(width: width, height: 20.0)
            .overlay {
                text
            }
    }
}

extension String {
    func paddedWithLeadingZeros(minLength: Int) -> String {
        let paddingCount = max(0, minLength - self.count)
        return String(repeating: "0", count: paddingCount) + self
    }
}


#Preview {
    ScheduleView(scheduleColumns: [
        .init(hour: 6, minutes: [45]),
        .init(hour: 7, minutes: [10, 35]),
        .init(hour: 8, minutes: [0, 20, 40]),
        .init(hour: 9, minutes: [0, 30]),
        .init(hour: 10, minutes: [0, 30]),
        .init(hour: 11, minutes: [15]),
        .init(hour: 12, minutes: [0]),
        .init(hour: 13, minutes: [0, 45]),
        .init(hour: 14, minutes: [30]),
        .init(hour: 15, minutes: [30]),
        .init(hour: 16, minutes: [30]),
        .init(hour: 17, minutes: [0, 30]),
        .init(hour: 18, minutes: [0, 20, 40]),
        .init(hour: 19, minutes: [0, 30]),
        .init(hour: 20, minutes: [15]),
        .init(hour: 21, minutes: [0, 45]),
        .init(hour: 22, minutes: [30])
    ])
}
