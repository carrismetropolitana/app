//
//  StopsSearchBar.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 14/09/2024.
//

import SwiftUI

struct StopsSearchBar: View {
    @Binding var searchTerm: String
    @Binding var isSearching: Bool
    @FocusState private var isSearchFieldFocused: Bool

    var body: some View {
        HStack(alignment: .center) {
            if !isSearching {
                Image(systemName: "magnifyingglass")
                    .foregroundStyle(.secondary)
                    .bold()
                    .padding(.vertical, 18)
                    .padding(.leading, 18)
                    .onTapGesture {
                        isSearchFieldFocused = true
                    }
            }
            TextField("", text: $searchTerm, prompt: Text("Nome ou número da paragem").foregroundColor(.gray).fontWeight(.semibold))
                .padding(.leading, isSearching ? 18 : 0)
                .frame(height: 50)
                .focused($isSearchFieldFocused)
            
            if isSearching {
                Button {
                    isSearchFieldFocused = false
                } label: {
                    Image(systemName: "xmark")
                        .foregroundStyle(.secondary)
                        .bold()
                }
                .buttonStyle(.plain)
                .padding(.vertical, 18)
                .padding(.trailing, 18)
            }
        }
        .background(RoundedRectangle(cornerRadius: 15.0).fill(.cmListItemBackground))
        .onChange(of: isSearchFieldFocused) { newValue in
            withAnimation(.smooth(duration: 0.3)) {
                isSearching = newValue
            }
        }
    }
}

//#Preview {
//    StopsSearchBar()
//}
