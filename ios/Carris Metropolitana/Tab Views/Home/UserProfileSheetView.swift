//
//  UserProfileSheetView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 10/05/2024.
//

import SwiftUI

struct UserProfileSheetView: View {
    @AppStorage("____dev_isLoggedIn") var ____dev_isLoggedIn: Bool = false
    @State private var nameSurname = "John Doe"
    @State private var birthDate = ""
    @State private var fiscalNumber = "999999999"
    
    var body: some View {
        NavigationStack{
            Form {
                Section {
                    TextField("Nome e Apelido", text: $nameSurname)
                    TextField("Data de Nascimento", text: $birthDate)
                    TextField("Número de Contribuinte", text: $fiscalNumber)
                } header: {
                    VStack(alignment: .leading) {
                        Text("Dados pessoais")
                            .font(.headline)
                            .bold()
                            .foregroundStyle(.primary)
                        Text(verbatim: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget mauris accumsan, ornare tortor non, tristique osdlio.")
                    }
                    .textCase(nil)
                    .listRowInsets(EdgeInsets(top: 20, leading: 0, bottom: 10, trailing: 0))
                }
                
                Section {
                    VStack(spacing: 10) {
                        Text("Saiba a importância dos dados para gerir a rede da Carris Metropolitana.")
                            .font(.headline)
                            .padding(.horizontal, 5)
                        Text("Saiba exatamente onde andam todos os autocarros e exatamente quando chegam à sua paragem.")
                            .font(.subheadline)
                            .padding(.horizontal)
                        RoundedRectangle(cornerRadius: 15.0)
                            .fill(.white)
                            .shadow(color: .gray.opacity(0.2), radius: 7)
                            .frame(width: 250, height: 150)
                            .padding(.top)
                    }
                    .padding(.vertical)
                    .multilineTextAlignment(.center)
                } footer: {
                    Button {
                        
                    } label: {
                        Text("Guardar")
                            .font(.title2)
                            .bold()
                            .frame(maxWidth: .infinity)
                            .padding(5.0)
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding(.vertical)
            }
            .navigationTitle("Perfil")
            .toolbar {
                ToolbarItem(placement: .destructiveAction) {
                    Button {
                        ____dev_isLoggedIn.toggle()
                    } label: {
                        Text("Logout")
                    }
                    .tint(.red)
                }
            }
        }
    }
}

#Preview {
    UserProfileSheetView()
}
