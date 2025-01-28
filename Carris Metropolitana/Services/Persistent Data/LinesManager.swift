//
//  LinesManager.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 15/06/2024.
//

import Foundation

class LinesManager: ObservableObject {
    @Published var lines: [Line] = []


    init() {
        print("LinesManager got instantiated!")
        fetchLines()
        setupAutoRefresh()
        print("Lines: \(lines.count)")
    }

    func fetchLines() {
        Task {
            let newLines = await CMAPI.shared.getLines()
            DispatchQueue.main.async {
                self.lines = newLines
                print("Got \(newLines.count) new lines!")
            }
        }
    }

    private func setupAutoRefresh() {
        Timer.scheduledTimer(withTimeInterval: 60*5, repeats: true) { _ in
            self.fetchLines()
        }
    }
}
