//
//  ImagePixelColorPredominanceTest.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 22/06/2024.
//
import SwiftUI
import Combine
import UIKit

struct AsyncImageThemedBackground: View {
    let imageURL: URL
    @State private var predominantColor: Color = .clear
    @State private var image: UIImage? = nil

    var body: some View {
        ZStack {
            if let image = image {
                Rectangle()
                    .fill(predominantColor.gradient)
                    .ignoresSafeArea()

                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .background(Color.clear)
                    .clipShape(RoundedRectangle(cornerRadius: 15.0))
                    .padding()
            } else {
                ProgressView()
            }
        }
        .onAppear {
            fetchImage()
        }
    }

    private func fetchImage() {
        URLSession.shared.dataTask(with: imageURL) { data, response, error in
            guard let data = data, let uiImage = UIImage(data: data) else {
                return
            }
            DispatchQueue.main.async {
                self.image = uiImage
                self.predominantColor = calculatePredominantColor(uiImage: uiImage)
            }
        }.resume()
    }

    private func calculatePredominantColor(uiImage: UIImage) -> Color {
        guard let cgImage = uiImage.cgImage else {
            return .clear
        }

        let width = cgImage.width
        let height = cgImage.height
        let bitmapData = UnsafeMutablePointer<UInt8>.allocate(capacity: width * height * 4)
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        let context = CGContext(data: bitmapData,
                                width: width,
                                height: height,
                                bitsPerComponent: 8,
                                bytesPerRow: width * 4,
                                space: colorSpace,
                                bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!

        context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))

        var colorCounts: [UIColor: Int] = [:]
        for x in 0..<width {
            for y in 0..<height {
                let offset = 4 * (y * width + x)
                let alpha = bitmapData[offset + 3]
                guard alpha > 0 else { continue }  // skip transparent pixels

                let red = bitmapData[offset]
                let green = bitmapData[offset + 1]
                let blue = bitmapData[offset + 2]

                // skip close to b&w
                if (red < 20 && green < 20 && blue < 20) || (red > 235 && green > 235 && blue > 235) {
                    continue
                }

                let color = UIColor(red: CGFloat(red) / 255.0,
                                    green: CGFloat(green) / 255.0,
                                    blue: CGFloat(blue) / 255.0,
                                    alpha: 1.0)

                colorCounts[color, default: 0] += 1
            }
        }

        bitmapData.deallocate()

        let predominantUIColor = colorCounts.max { a, b in a.value < b.value }?.key ?? UIColor.clear
        return Color(predominantUIColor)
    }
}

#Preview {
    AsyncImageThemedBackground(imageURL: URL(string: "https://www.carrismetropolitana.pt/wp-content/uploads/2024/03/15512_CampVamosTodos_F_BANNER_1440x810_AF-01.png")!)
}
