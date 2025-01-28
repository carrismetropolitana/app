//
//  SearchInput.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 20/03/2024.
//

import SwiftUI

struct SearchInput: View {
    @Binding var text: String
    let placeholder: String
    let leadingSystemIcon: String?
    let trailingSystemIcon: String?
    
    var body: some View {
//        TextField("", text: $text, prompt: Text(placeholder).foregroundColor(.gray).fontWeight(.semibold))
//            .padding(18)
//            .background(.white)
//            .cornerRadius(15)
        
        VStack(alignment: .center) {
            HStack{
                if leadingSystemIcon != nil {
                    Image(systemName: leadingSystemIcon!)
                        .foregroundStyle(.gray)
                        .padding(.leading, 20)
                        .padding(.trailing, 10)
                }
                
                TextField("", text: $text, prompt: Text(placeholder).foregroundColor(.gray).fontWeight(.semibold))
                    .padding(.vertical, 18)
                
                if trailingSystemIcon != nil {
                    Spacer()
                    Image(systemName: trailingSystemIcon!)
                        .foregroundStyle(.gray)
                        .padding(.trailing, 10)
                }
            }
            .background(Color.white.opacity(0.7))
            .cornerRadius(15)
        }
    }
}

//#Preview {
//    SearchInput()
//}
