//
//  UserFeedbackForm.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 29/06/2024.
//

import SwiftUI

//enum QuestionType<T> {
enum QuestionType: Equatable {
    case yesOrNo, textInput, select(entries: [String]), stars
}

//struct Question<T> {
struct Question {
    let text: String
    let type: QuestionType
    let onAction: (_ value: Any) -> Void
//    <T>
}


struct UserFeedbackForm: View {
    let title: String
    let description: String
    let questions: [Question]
    
    var body: some View {
        VStack {
            HStack {
                VStack(alignment: .leading, spacing: 5.0) {
                    Text(title)
                        .font(.title3)
                        .bold()
                    Text(description)
                        .font(.callout)
                }
                .foregroundStyle(.white)
                Spacer()
            }
            .padding(.top, 5.0)
            .padding(.bottom, 20.0)
            
            ForEach(questions.indices, id: \.hashValue) { questionIndex in
                let question = questions[questionIndex]
                
                VStack {
                    HStack {
                        Text(question.text)
                            .bold()
                            .foregroundStyle(.white)
                        Spacer()
                        
                        if (question.type == .yesOrNo) {
                            yesNoButton(yes: true, onClick: {question.onAction(true)})
                            yesNoButton(yes: false, onClick: {question.onAction(false)})
                        } else if question.type == .textInput {
                            questionTextInput(onSubmit: { answer in
                                question.onAction(answer)
                            })
                        } else if question.type == .stars {
                            stars(onRate: { rating in
                                question.onAction(rating)
                            })
                        }
                    }
                    .padding(.vertical, 5.0)
                    
                    if (questionIndex != questions.count - 1) {
                        Divider()
                            .frame(minHeight: 1.5)
                            .overlay(.white.opacity(0.5))
                    }
                }
            }
        }
        .padding()
        .background(.cmFormBackground)
    }
    
    
    func yesNoButton(yes: Bool, onClick: @escaping () -> Void) -> some View {
        Button {
            onClick()
        } label: {
            HStack {
                Image(systemName: yes ? "hand.thumbsup.fill" : "hand.thumbsdown.fill")
                Text(yes ? "Sim" : "Não")
                    .bold()
            }
            .foregroundStyle(yes ? .green : .red)
            .padding(10.0)
            .background(RoundedRectangle(cornerRadius: 5.0).fill(.white))
        }
        .buttonStyle(.plain)
    }
    
    
    @State var questionAnswer = ""
    func questionTextInput(onSubmit: @escaping (_ answer: String) -> Void) -> some View {
        return TextField("Resposta", text: $questionAnswer)
            .padding(10.0)
            .padding(.trailing, 50.0)
            .frame(width: 170)
            .background(RoundedRectangle(cornerRadius: 5.0).fill(.white))
            .overlay {
                HStack {
                    Spacer()
                    Button("\(Image(systemName: "paperplane.fill"))") {
                        onSubmit(questionAnswer)
                    }
                }
                .padding(.trailing, 5.0)
                .buttonStyle(.borderedProminent)
            }
    }
    
    @State var rating = 0
    func stars(onRate: @escaping (_ rating: Int) -> Void) -> some View {
        let starSize: CGFloat = 25.0
        return HStack {
            ForEach(0..<5, id: \.self) { i in
                Button {
                    rating = i + 1
                    onRate(rating)
                } label: {
                    Image(systemName: rating >= i + 1 ? "star.fill" : "star")
                        .resizable()
                    .frame(width: starSize, height: starSize)
                }
            }
        }
        .padding(.vertical, 10.0)
    }
}

#Preview {
    UserFeedbackForm(
        title: "Estas informações estão corretas?",
        description: "Ajude-nos a melhorar os transportes para todos.",
        questions: [
            Question(text: "Percursos e Paragens", type: .yesOrNo, onAction: {value in print("User responded with value \(value) to question Percursos e Paragens")}),
            Question(text: "Estimativas de Chegada", type: .yesOrNo, onAction: {value in print("User responded with value \(value) to question Estimativas de Chegada")}),
            Question(text: "Informações no Veículo", type: .yesOrNo, onAction: {value in print("User responded with value \(value) to question Informações no Veículo")}),
            Question(text: "Estado do Piso", type: .textInput, onAction: {value in print("User responded with value \(value) to question Informações no Veículo")}),
            Question(text: "Limpeza do Veículo", type: .stars, onAction: {value in})
        ]
    )
}
