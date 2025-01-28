//
//  SelectFavoriteLineView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 01/07/2024.
//

import SwiftUI

struct SelectFavoriteLineView: View {
    @Environment(\.presentationMode) var presentationMode
    
    @EnvironmentObject var linesManager: LinesManager
    
    @State private var searchTerm = ""
    
    @Binding var selectedLineId: String?
    
    var body: some View {
        VStack {
            LinesListView(lines: linesManager.lines, searchTerm: $searchTerm, onClickOverride: { lineId in
                selectedLineId = lineId
                presentationMode.wrappedValue.dismiss()
            })
            
        }
        .navigationTitle("Selecionar linha")
        .searchable(text: $searchTerm, placement: .navigationBarDrawer(displayMode: .always), prompt: "Nome ou número da linha")
    }
}

#Preview {
    SelectFavoriteLineView(selectedLineId: .constant("1523"))
}
