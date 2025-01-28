//
//  Models.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/03/2024.
//

import Foundation

struct HasRenderedValue: Codable {
    let rendered: String
}

struct News: Codable, Identifiable, Equatable {
    static func == (lhs: News, rhs: News) -> Bool {
        lhs.id == rhs.id
    }
    
    let id: Int
    let date: String
    let dateGmt: String
    let modified: String
    let modifiedGmt: String
    let slug: String
    let status: String
    let type: String
    let link: String
    let title: HasRenderedValue
//    let content: Content
//    let author: Int
    let featuredMedia: Int
//    let menuOrder: Int
//    let template: String
//    let meta: Meta
//    let acf: [String: String]
//    let links: Links
}

struct Media: Codable {
    let id: Int
    let guid: HasRenderedValue
    let sourceUrl: String
}

struct FAQ: Codable, Identifiable { // cache this and then periodically fetch with If-Modified-Since (apparently not supported by default on WP...)
    let id: Int
    let date: String
    let dateGmt: String
    let guid: HasRenderedValue
    let status: String
    let type: String
    let link: String
    let title: HasRenderedValue
    let content: HasRenderedValue
    
//    enum CodingKeys: String, CodingKey {
//        case id, date, dateGmt, guid, status, type, link, title, content
//    }
}
