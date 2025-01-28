//
//  SmartNotificationCustomizationView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 20/03/2024.
//

import SwiftUI

enum ConditionValueType {
    case minutes, meters
}

struct SmartNotificationCustomizationView: View {
    @State private var isAlertPresented = false
    @State private var alertTitle = ""
    @State private var alertMessage = ""
    
    @State private var lineSearchText = ""
    @State private var conditionValueType: ConditionValueType = .minutes
    @State private var conditionValue = 5
    @State private var stopSearchText = ""
    
    @State private var startHour = Date.now
    @State private var endHour = Date.now.addingTimeInterval(3600)
    
    @State private var selectedWeekDays: [Weekday] = []
    
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                VStack(spacing: 0) {
                    Circle()
                        .frame(height: 15)
                        .foregroundStyle(.tertiary)
                    Rectangle()
                        .frame(width: 3, height: 30)
                        .foregroundStyle(.tertiary)
                }
                
                VStack(spacing: 10) {
                    Text("Notificar-me quando um veículo da linha", comment: "Título do primeiro passo na criação de Notificação inteligente")
                        .bold()
                        .opacity(0.7)
                    SearchInput(text: $lineSearchText, placeholder: "Procurar linhas", leadingSystemIcon: "magnifyingglass", trailingSystemIcon: "chevron.right")
                        .padding(.horizontal)
                }
                
                Rectangle()
                    .frame(width: 3, height: 50)
                    .foregroundStyle(.tertiary)
                
                VStack(spacing: 10) {
                    Text("estiver a")
                        .bold()
                        .opacity(0.7)
                    HStack(spacing: 0) {
                        TextField("", value: $conditionValue, format: .number) // TODO: style this accordingly
                            .padding(.vertical, 5)
                            .background(RoundedRectangle(cornerRadius: 10).fill(.gray.opacity(0.2)))
                            .foregroundStyle(.blue)
                            .padding()
                            .multilineTextAlignment(.center)
                        Picker("", selection: $conditionValueType) {
                            Text("Minutos").tag(ConditionValueType.minutes)
                            Text("Metros").tag(ConditionValueType.meters)
                        }
                        .pickerStyle(.segmented)
                        .padding()
                    }
                        .background(.white)
                        .cornerRadius(15.0)
                        .padding(.horizontal)
                }
                
                Rectangle()
                    .frame(width: 3, height: 50)
                    .foregroundStyle(.tertiary)
                
                VStack(spacing: 10) {
                    Text("da paragem", comment: "Título do passo em que se seleciona a paragem na criação de Notificação Inteligente")
                        .bold()
                        .opacity(0.7)
                    SearchInput(text: $lineSearchText, placeholder: "Procurar paragens", leadingSystemIcon: "magnifyingglass", trailingSystemIcon: "chevron.right")
                        .padding(.horizontal)
                }
                
                Rectangle()
                    .frame(width: 3, height: 50)
                    .foregroundStyle(.tertiary)
                
                VStack(spacing: 10) {
                    Text("no período", comment: "Título do passo em que se seleciona o período na criação de Notificação Inteligente")
                        .bold()
                        .opacity(0.7)
                    VStack(alignment: .leading) {
                        DatePicker(String(localized: "Hora de Início", comment: "Na criação de Notificação Inteligente"), selection: $startHour, displayedComponents: .hourAndMinute)
                            .padding(.horizontal)
                        Divider()
                        DatePicker(String(localized: "Hora de Fim", comment: "Na criação de Notificação inteligente"), selection: $endHour, displayedComponents: .hourAndMinute)
                            .padding(.horizontal)
                        Divider()
                        VStack(alignment: .leading) {
                            Text("Dias da semana", comment: "Na criação de Notificação inteligente")
                            HStack {
                                Spacer()
                                WeekdaySelector(selectedDays: $selectedWeekDays)
                                Spacer()
                            }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 5.0)
                    }
                    .padding(.vertical, 10)
                    .background(RoundedRectangle(cornerRadius: 15).fill(.white))
                    .padding(.horizontal)
                    
                }
                
                
                Text("Atenção!\nPor favor teste esta funcionalidade antes de a utilizar com confiança. Poderá ser necessário ajustar os tempos para garantir que chega ao local.", comment: "Na criação de Notificação inteligente")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                
                VStack(spacing: 15.0) {
                    Button {
                        doSubmit()
                    } label: {
                        Text("Guardar")
                            .font(.title2)
                            .bold()
                            .frame(maxWidth: .infinity)
                            .padding(5.0)
                    }
                    .buttonStyle(.borderedProminent)
                    
                    Button {
                        
                    } label: {
                        Text("Eliminar")
                            .font(.title2)
                            .bold()
                            .frame(maxWidth: .infinity)
                            .padding(5.0)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)
                }
                .padding()
                
            }
        }
        .navigationTitle("Nova Notificação")
        .background(Color(uiColor: UIColor.secondarySystemBackground))
        .alert(isPresented: $isAlertPresented) {
            Alert(title: Text(alertTitle), message: Text(alertMessage), dismissButton: .default(Text("OK")))
        }
    }
    
    
    
    private func doSubmit() {
        if (startHour > endHour) {
            alertTitle = "Erro"
            alertMessage = "A hora de início não pode ser inferior à hora de fim."
            isAlertPresented.toggle()
        }
    }
}

enum Weekday: String, CaseIterable {
    case monday = "Seg"
    case tuesday = "Ter"
    case wednesday = "Qua"
    case thursday = "Qui"
    case friday = "Sex"
    case saturday = "Sáb"
    case sunday = "Dom"
}

struct WeekdaySelector: View {
    @Binding var selectedDays: [Weekday]
    var body: some View {
        HStack(spacing: 0) {
            ForEach(Weekday.allCases, id: \.self) { weekDay in
                let isSelected = selectedDays.contains(weekDay)
                
                Text(weekDay.rawValue)
                    .bold()
                    .foregroundStyle(isSelected ? .white : .secondary)
                    .padding(.vertical, 10)
                    .padding(.horizontal, 5)
                    .onTapGesture {
                        if isSelected {
                            selectedDays.remove(at: selectedDays.firstIndex(where: {$0 == weekDay})!)
                        } else {
                            selectedDays.append(weekDay)
                        }
                    }
                
                    .background(isSelected ? .blue : .gray.opacity(0.2))
                    .clipShape(
                        UnevenRoundedRectangle(
                            cornerRadii: .init(
                                topLeading: weekDay == .monday ? 10 : 0,
                                bottomLeading: weekDay == .monday ? 10 : 0,
                                bottomTrailing: weekDay == .sunday ? 10 : 0,
                                topTrailing: weekDay == .sunday ? 10 : 0
                            )
                        )
                    )
                
                if weekDay != .sunday {
                    Divider()
                }
            }
        }
    }
}


#Preview {
    SmartNotificationCustomizationView()
}
