//
//  FAQView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 16/03/2024.
//

import SwiftUI

struct FAQView: View {
    @State private var faqs: [FAQ] = []
    
    var body: some View {
        List {                
            ForEach(faqs.reversed()) { faq in
                let accordions = try! HTMLParser.parseAccordions(accordionsHtml: faq.content.rendered)
                    
                   
                Section(header: Text(faq.title.rendered).bold().font(.title2).foregroundStyle(.listPrimary).offset(x: -15)) {
                        ForEach(accordions, id: \.self.title) { accordion in
                            DisclosureGroup(accordion.title) {
                                Text(accordion.content)
                            }
                        }
                    }
                .textCase(nil)
                }
        }
        .navigationTitle("Perguntas frequentes")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            let wpapi = CMWordpressAPI()
            Task {
                faqs = try await wpapi.getFAQs()
            }
        }
    }
}

#Preview {
    FAQView()
}
