//
//  CMWordpressAPI.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 13/03/2024.
//

import Foundation

class CMWordpressAPI {
    private static let baseUrl = "https://backoffice.carrismetropolitana.pt/wp-json/wp/v2"
    private static let newsUrl = "\(baseUrl)/noticia"
    private static let faqsUrl = "\(baseUrl)/faq"
    private static let mediaUrl = "\(baseUrl)/media"
    
    static let shared = CMWordpressAPI()

    func getNews(count: Int = 10) async throws -> [News] {
        var news: [News]?

        do {
            news = try await NetworkService.makeGETRequest("\(CMWordpressAPI.newsUrl)?per_page=\(count)", responseType: [News].self)
        } catch {
            print("Failed to fetch news!")
            print(error)
        }
        
        guard news != nil else {
            throw CMAPIError.noRouteFound
        }
        
        return news!
    }
    
    func getMediaURL(mediaId: Int) async throws -> URL {
        var mediaUrl: URL?
        
        do {
            let mediaResponse = try await NetworkService.makeGETRequest("\(CMWordpressAPI.mediaUrl)/\(mediaId)", responseType: Media.self)
            mediaUrl = URL(string: mediaResponse.sourceUrl)
        } catch {
            print("Failed to get media \(mediaId)!")
            print(error)
        }
        
        guard mediaUrl != nil else {
            throw CMAPIError.noRouteFound
        }
        
        return mediaUrl!
    }
    
    func getFAQs() async throws -> [FAQ] {
        var faqs: [FAQ]?

        do {
            faqs = try await NetworkService.makeGETRequest(CMWordpressAPI.faqsUrl, responseType: [FAQ].self)
        } catch {
            print("Failed to fetch faqs!")
            print(error)
        }
        
        guard faqs != nil else {
            throw CMAPIError.noRouteFound
        }
        
        return faqs!
    }
}
