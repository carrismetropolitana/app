//
//  FacilityIconsPreviewView.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 17/03/2024.
//

import SwiftUI

struct FacilityIconsPreviewView: View {
    var body: some View {
        VStack(spacing: 25.0) {
            Image(.cmFacilityBoat)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100)
            
            Image(.cmFacilityLightRail)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100)
            
            Image(.cmFacilitySchool)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100)
            
            Image(.cmFacilityShopping)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100)
            
            Image(.cmFacilitySubway)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100)
            
            Image(.cmFacilityTrain)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100)
            
            Image(.cmFacilityTransitOffice)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100)
        }
    }
}

#Preview {
    FacilityIconsPreviewView()
}
