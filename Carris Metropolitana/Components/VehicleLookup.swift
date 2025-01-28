//
//  VehicleLookup.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 18/07/2024.
//

import SwiftUI

struct VehicleLookup: View {
    var body: some View {
        VStack(spacing: 0) {
            Text("Pesquisar autocarro")
                .font(.title)
                .bold()
                .padding(.top, 25.0)
            VehicleSearchInput()
                .padding(.vertical, 30.0)
            VStack {
                ForEach(0..<2, id:  \.self) { i in
                    VehicleSearchResult()
                        .padding(.horizontal)
                }
            }
            Spacer()
        }
    }
}

struct VehicleSearchInput: View {
    @State private var busSearchTerm = ""
    var body: some View {
        let placeholder = "1234"
        TextField(placeholder, text: $busSearchTerm)
            .font(.system(size: 50.0))
            .fontWeight(.black)
            .multilineTextAlignment(.center)
            .frame(width: 170, height: 80.0)
            .background(RoundedRectangle(cornerRadius: 25.0).fill(.gray.tertiary))
    }
}

struct VehicleSearchResult: View {
    var body: some View {
        HStack(alignment: .center, spacing: 20.0) {
            Image(systemName: "bus")
                .resizable()
                .frame(width: 30, height: 30)
            VStack(alignment: .leading) {
                Text("Área 4".uppercased())
                    .foregroundStyle(.secondary)
                    .bold()
                    .font(.caption)
                Text("Autocarro \("12691")")
                    .font(.headline)
                    .fontWeight(.heavy)
            }
            Spacer()
            HStack {
                Text("Em viagem")
                    .font(.footnote)
                Image(systemName: "chevron.right")
            }
        }
        .foregroundStyle(.blue)
        .padding(.horizontal)
        .padding(.vertical, 10.0)
        .background(RoundedRectangle(cornerRadius: 10.0).fill(.babyBlue.opacity(0.3)))
    }
}

struct VehicleLookupPreview: View {
    @State private var sheetOpen = true
    var body: some View {
        HStack {
            Spacer()
            VStack {
                Spacer()
                Button("Open sheet") {
                    sheetOpen.toggle()
                }
                Spacer()
            }
            .sheet(isPresented: $sheetOpen) {
                VehicleLookup()
                    .presentationDetents([.fraction(0.45)])
                    .presentationCornerRadius(25.0)
                    .presentationBackgroundInteraction(.enabled(upThrough: .fraction(0.45)))
            }
            Spacer()
        }
    }
}

#Preview {
    VehicleLookupPreview()
        .background(.red)
}
