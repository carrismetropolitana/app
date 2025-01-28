//
//  Helpers.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/03/2024.
//

import Foundation
import SwiftSoup

struct Accordion {
    let title: String
    let content: String
}

class HTMLParser {
    let shared = HTMLParser()
    
    static func parseAccordions(accordionsHtml: String) throws -> [Accordion] {
        // .c-accordion__title
        // .c-accordion__content
        
        let doc: Document = try SwiftSoup.parse(accordionsHtml.replacingOccurrences(of: "\n", with: "<br>")) // TODO: figure out how to get \n's to the actual final render
        
        let accordions = try doc.select(".c-accordion__item")
        
        var accordionsToReturn: [Accordion] = []
        
        for accordion in accordions {
            let accordionTitle = try accordion.select(".c-accordion__title").text().trimmingCharacters(in: .whitespacesAndNewlines)
            let accordionContent = try accordion.select(".c-accordion__content").text().trimmingCharacters(in: .whitespacesAndNewlines)
            
            accordionsToReturn.append(.init(title: accordionTitle, content: accordionContent))
        }
        
        return accordionsToReturn
        
    }
}
