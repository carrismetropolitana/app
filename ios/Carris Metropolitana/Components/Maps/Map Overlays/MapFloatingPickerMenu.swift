//
//  MapFloatingPickerMenu.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 25/08/2024.
//

import SwiftUI


struct MapFloatingPickerMenu<SelectionValue>: View where SelectionValue: Hashable {
    let systemImage: String
    @Binding var selection: SelectionValue
    let options: [SelectionValue]
    let labelForOption: (SelectionValue) -> String
    
    init(systemImage: String,
         selection: Binding<SelectionValue>,
         options: [SelectionValue],
         labelForOption: @escaping (SelectionValue) -> String) {
        self.systemImage = systemImage
        self._selection = selection
        self.options = options
        self.labelForOption = labelForOption
    }

    var body: some View {
        Menu {
            Picker("", selection: $selection) {
                ForEach(options, id: \.self) { option in
                    Text(labelForOption(option)).tag(option)
                }
            }
        } label: {
            ZStack {
                RoundedRectangle(cornerRadius: 15.0)
                    .fill(Color.cmListItemBackground)
                    .frame(width: 60, height: 60)
                    .shadow(color: .black.opacity(0.2), radius: 10)
                Image(systemName: systemImage)
                    .resizable()
                    .foregroundColor(.blue)
                    .frame(width: 30, height: 30)
            }
        }
        .buttonStyle(.plain)
    }
}



//#Preview {
//    MapFloatingPickerMenu()
//}
