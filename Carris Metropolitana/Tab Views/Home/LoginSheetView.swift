//
//  LoginSheetView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 26/04/2024.
//

import SwiftUI

struct LoginSheetView: View {
    @AppStorage("____dev_isLoggedIn") var ____dev_isLoggedIn: Bool = false
    var body: some View {
        VStack {
            Image(.cmLogoWhite)
                .padding(.vertical, 30)
            Divider()
            
            Text("Tudo o que precisa é o seu e-mail")
                .bold()
                .font(.title)
                .multilineTextAlignment(.center)
                .padding(30)
            Text(verbatim: "Logged in: \(____dev_isLoggedIn ? "Yes" : "No")")
            Button {
                ____dev_isLoggedIn.toggle()
            } label: {
                Text(verbatim: "Toggle isLoggedIn")
            }
            
            Spacer()
        }
        .background(.cmYellow)
    }
}

#Preview {
    LoginSheetView()
}
