//
//  MediaUIAttachmentImageView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 11/10/2024.
//


import SwiftUI

public struct MediaUIAttachmentImageView: View {
  public let url: URL

  @GestureState private var zoom = 1.0

  public var body: some View {
    MediaUIZoomableContainer {
      AsyncImage(url: url) { image in
              image
                  .resizable()
                  .clipShape(RoundedRectangle(cornerRadius: 8))
                  .scaledToFit()
                  .padding(.horizontal, 8)
                  .padding(.top, 44)
                  .padding(.bottom, 32)
                  .scaleEffect(zoom)
      } placeholder: {
          ProgressView()
              .progressViewStyle(.circular)
      }
      .draggable(MediaUIImageTransferable(url: url))
      .contextMenu {
        MediaUIShareLink(url: url, type: .image)
        Button {
          Task {
            let transferable = MediaUIImageTransferable(url: url)
            UIPasteboard.general.image = UIImage(data: await transferable.fetchData())
          }
        } label: {
          Label("Copiar", systemImage: "doc.on.doc")
        }
        Button {
          UIPasteboard.general.url = url
        } label: {
          Label("Copiar link", systemImage: "link")
        }
      }
    }
  }
}
