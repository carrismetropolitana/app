//
//  CustomerSupportView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 24/06/2024.
//

import SwiftUI

struct CustomerSupportView: View {
    var body: some View {
        VStack {
            Button {
                
            } label: {
                Image(systemName: "phone.fill")
                Text("Contactar a Carris Metropolitana")
            }
            .buttonStyle(.borderedProminent)
            Button {
                
            } label: {
                Text("Contactar operador diretamente")
            }
            
            CustomerSupportForm()
        }
    }
}

struct CustomerSupportForm: View {
    @State private var name: String = ""
    @State private var surname: String = ""
    @State private var email: String = ""
    @State private var naveganteCardNumber: String = ""
    @State private var municipality: String = ""
    @State private var subject: String = ""
    @State private var acceptedTerms: Bool = false
    
    var body: some View {
        VStack {
            TextField("Nome", text: $name)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.bottom, 10)
            
            TextField("Apelido", text: $surname)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.bottom, 10)
            
            TextField("E-mail*", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.bottom, 10)
            
            TextField("Número de Cartão Navegante", text: $naveganteCardNumber)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.bottom, 10)
            
            Picker("Município*", selection: $municipality) {
                Text("Selecionar...").tag("")
                Text("Lisboa").tag("Lisboa")
                Text("Porto").tag("Porto")
                // Add more municipalities as needed
            }
            .pickerStyle(MenuPickerStyle())
            .padding(.bottom, 10)
            
            Picker("Assunto*", selection: $subject) {
                Text("Selecionar...").tag("")
                Text("Assunto 1").tag("Assunto 1")
                Text("Assunto 2").tag("Assunto 2")
                // Add more subjects as needed
            }
            .pickerStyle(MenuPickerStyle())
            .padding(.bottom, 10)
            
            Toggle(isOn: $acceptedTerms) {
                Text("Declaro ter conhecimento e aceitar que os meus dados pessoais sejam tratados pela TML, de acordo com a sua Política de Privacidade para efeitos do tratamento do pedido/sugestão que submeto à sua apreciação.*")
            }
            .padding(.bottom, 20)
            
            HStack {
                Button(action: {
                    // Handle submit action
                }) {
                    Text("Seguinte")
                        .foregroundColor(.white)
                        .padding()
                        .background(acceptedTerms ? Color.blue : Color.gray)
                        .cornerRadius(8)
                }
                .disabled(!acceptedTerms)
                
                Spacer()
                
                Button(action: {
                    // Handle clear action
                    name = ""
                    surname = ""
                    email = ""
                    naveganteCardNumber = ""
                    municipality = ""
                    subject = ""
                    acceptedTerms = false
                }) {
                    Text("Limpar")
                        .foregroundColor(.blue)
                        .padding()
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(8)
                }
            }
            .padding()
        }
        .padding()
    }
}

#Preview {
    CustomerSupportView()
}
