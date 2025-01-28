//
//  Loading.swift
//  Carris Metropolitana
//
//  Created by João Pereira on 10/05/2024.
//

import SwiftUI

//struct CMLoadingAnimation: View {
//    @State private var animating = false
//      let streamBlue = Color(#colorLiteral(red: 0, green: 0.3725490196, blue: 1, alpha: 1))
//      let streamRed = Color(#colorLiteral(red: 1, green: 0, blue: 0, alpha: 1))
//    var body: some View {
//        CMLogo()
//            .stroke(style: StrokeStyle(lineWidth: 4, lineCap: .round, lineJoin: .round, miterLimit: 0, dash: [5, 4], dashPhase: 100))
//                        .frame(width: 64, height: 64)
//                        .foregroundStyle(
//                            .gray.secondary
//                        )
//                        .phaseAnimator([false, true]) { openPart, moveAround in
//                            CMLogo()
//                                .stroke(style: StrokeStyle(
//                                    lineWidth: 2,
//                                    lineCap: .round,
//                                    lineJoin: .round,
//                                    miterLimit: 0, dash: [5, 4], dashPhase: moveAround ? -100 : 225))
//                                .frame(width: 64, height: 64)
//                                .foregroundStyle(
//                                    .gray.secondary
//                                )
//                                .scaleEffect(2)
//                        } animation: { moveAround in
//                                .linear.speed(0.02).repeatForever(autoreverses: false)
//                        }
//    }
//}

struct CMLoadingAnimation: View {
    @State private var moveAround = false

    let streamBlue = Color(#colorLiteral(red: 0, green: 0.3725490196, blue: 1, alpha: 1))
    let streamRed = Color(#colorLiteral(red: 1, green: 0, blue: 0, alpha: 1))

    var body: some View {
        CMLogo()
            .stroke(style: StrokeStyle(
                lineWidth: 2,
                lineCap: .round,
                lineJoin: .round,
                miterLimit: 0, dash: [5, 4], dashPhase: moveAround ? -100 : 225))
            .frame(width: 64, height: 64)
            .foregroundStyle(.gray.secondary)
            .scaleEffect(2)
            .onAppear {
                DispatchQueue.main.async {
                    withAnimation(Animation.linear(duration: 25).repeatForever(autoreverses: false)) {
                        self.moveAround.toggle()
                    }
                }
            }
    }
}

struct CMLogo: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let width = rect.size.width
        let height = rect.size.height
        path.move(to: CGPoint(x: 0.93419*width, y: 0.39288*height))
        path.addCurve(to: CGPoint(x: 0.95408*width, y: 0.45374*height), control1: CGPoint(x: 0.94447*width, y: 0.41179*height), control2: CGPoint(x: 0.95121*width, y: 0.43242*height))
        path.addCurve(to: CGPoint(x: 0.95546*width, y: 0.49032*height), control1: CGPoint(x: 0.95559*width, y: 0.46587*height), control2: CGPoint(x: 0.95605*width, y: 0.47811*height))
        path.addCurve(to: CGPoint(x: 0.95511*width, y: 0.49604*height), control1: CGPoint(x: 0.95538*width, y: 0.49222*height), control2: CGPoint(x: 0.95527*width, y: 0.49414*height))
        path.addCurve(to: CGPoint(x: 0.94721*width, y: 0.52189*height), control1: CGPoint(x: 0.95507*width, y: 0.50525*height), control2: CGPoint(x: 0.95232*width, y: 0.51424*height))
        path.addCurve(to: CGPoint(x: 0.92614*width, y: 0.53918*height), control1: CGPoint(x: 0.94205*width, y: 0.52961*height), control2: CGPoint(x: 0.93472*width, y: 0.53563*height))
        path.addCurve(to: CGPoint(x: 0.89902*width, y: 0.54186*height), control1: CGPoint(x: 0.91757*width, y: 0.54274*height), control2: CGPoint(x: 0.90813*width, y: 0.54367*height))
        path.addCurve(to: CGPoint(x: 0.87499*width, y: 0.52901*height), control1: CGPoint(x: 0.88992*width, y: 0.54005*height), control2: CGPoint(x: 0.88155*width, y: 0.53557*height))
        path.addCurve(to: CGPoint(x: 0.86214*width, y: 0.50497*height), control1: CGPoint(x: 0.86842*width, y: 0.52244*height), control2: CGPoint(x: 0.86395*width, y: 0.51408*height))
        path.addCurve(to: CGPoint(x: 0.86124*width, y: 0.49513*height), control1: CGPoint(x: 0.86149*width, y: 0.50172*height), control2: CGPoint(x: 0.8612*width, y: 0.49842*height))
        path.addCurve(to: CGPoint(x: 0.86146*width, y: 0.48384*height), control1: CGPoint(x: 0.86115*width, y: 0.49143*height), control2: CGPoint(x: 0.8613*width, y: 0.48772*height))
        path.addLine(to: CGPoint(x: 0.86157*width, y: 0.48101*height))
        path.addCurve(to: CGPoint(x: 0.84088*width, y: 0.42212*height), control1: CGPoint(x: 0.86244*width, y: 0.45946*height), control2: CGPoint(x: 0.85504*width, y: 0.43839*height))
        path.addCurve(to: CGPoint(x: 0.78543*width, y: 0.39347*height), control1: CGPoint(x: 0.82673*width, y: 0.40585*height), control2: CGPoint(x: 0.80689*width, y: 0.3956*height))
        path.addCurve(to: CGPoint(x: 0.72473*width, y: 0.41238*height), control1: CGPoint(x: 0.76353*width, y: 0.3918*height), control2: CGPoint(x: 0.74181*width, y: 0.39856*height))
        path.addCurve(to: CGPoint(x: 0.69357*width, y: 0.46779*height), control1: CGPoint(x: 0.70765*width, y: 0.42619*height), control2: CGPoint(x: 0.6965*width, y: 0.44602*height))
        path.addCurve(to: CGPoint(x: 0.67986*width, y: 0.49879*height), control1: CGPoint(x: 0.69274*width, y: 0.4794*height), control2: CGPoint(x: 0.68789*width, y: 0.49036*height))
        path.addCurve(to: CGPoint(x: 0.6638*width, y: 0.50924*height), control1: CGPoint(x: 0.67529*width, y: 0.50335*height), control2: CGPoint(x: 0.66982*width, y: 0.50691*height))
        path.addCurve(to: CGPoint(x: 0.6449*width, y: 0.51234*height), control1: CGPoint(x: 0.65779*width, y: 0.51157*height), control2: CGPoint(x: 0.65135*width, y: 0.51262*height))
        path.addCurve(to: CGPoint(x: 0.62635*width, y: 0.50757*height), control1: CGPoint(x: 0.63846*width, y: 0.51205*height), control2: CGPoint(x: 0.63214*width, y: 0.51042*height))
        path.addCurve(to: CGPoint(x: 0.61129*width, y: 0.49573*height), control1: CGPoint(x: 0.62057*width, y: 0.50471*height), control2: CGPoint(x: 0.61544*width, y: 0.50068*height))
        path.addCurve(to: CGPoint(x: 0.59992*width, y: 0.46452*height), control1: CGPoint(x: 0.60455*width, y: 0.48666*height), control2: CGPoint(x: 0.60059*width, y: 0.47581*height))
        path.addCurve(to: CGPoint(x: 0.57882*width, y: 0.42047*height), control1: CGPoint(x: 0.5974*width, y: 0.44807*height), control2: CGPoint(x: 0.59005*width, y: 0.43274*height))
        path.addCurve(to: CGPoint(x: 0.53679*width, y: 0.39557*height), control1: CGPoint(x: 0.56758*width, y: 0.40819*height), control2: CGPoint(x: 0.55295*width, y: 0.39953*height))
        path.addCurve(to: CGPoint(x: 0.48801*width, y: 0.39823*height), control1: CGPoint(x: 0.52062*width, y: 0.39161*height), control2: CGPoint(x: 0.50365*width, y: 0.39254*height))
        path.addCurve(to: CGPoint(x: 0.44895*width, y: 0.42756*height), control1: CGPoint(x: 0.47238*width, y: 0.40393*height), control2: CGPoint(x: 0.45878*width, y: 0.41413*height))
        path.addCurve(to: CGPoint(x: 0.4346*width, y: 0.45964*height), control1: CGPoint(x: 0.44193*width, y: 0.43711*height), control2: CGPoint(x: 0.43704*width, y: 0.44805*height))
        path.addCurve(to: CGPoint(x: 0.43087*width, y: 0.47936*height), control1: CGPoint(x: 0.4337*width, y: 0.46627*height), control2: CGPoint(x: 0.43245*width, y: 0.47286*height))
        path.addCurve(to: CGPoint(x: 0.41605*width, y: 0.50175*height), control1: CGPoint(x: 0.42825*width, y: 0.48812*height), control2: CGPoint(x: 0.42309*width, y: 0.49591*height))
        path.addCurve(to: CGPoint(x: 0.3913*width, y: 0.51216*height), control1: CGPoint(x: 0.409*width, y: 0.50758*height), control2: CGPoint(x: 0.40039*width, y: 0.5112*height))
        path.addCurve(to: CGPoint(x: 0.36493*width, y: 0.5071*height), control1: CGPoint(x: 0.3822*width, y: 0.51311*height), control2: CGPoint(x: 0.37303*width, y: 0.51135*height))
        path.addCurve(to: CGPoint(x: 0.34579*width, y: 0.48827*height), control1: CGPoint(x: 0.35683*width, y: 0.50285*height), control2: CGPoint(x: 0.35017*width, y: 0.4963*height))
        path.addCurve(to: CGPoint(x: 0.33914*width, y: 0.47068*height), control1: CGPoint(x: 0.34317*width, y: 0.48257*height), control2: CGPoint(x: 0.34094*width, y: 0.47669*height))
        path.addCurve(to: CGPoint(x: 0.33081*width, y: 0.45356*height), control1: CGPoint(x: 0.33686*width, y: 0.46474*height), control2: CGPoint(x: 0.33407*width, y: 0.45902*height))
        path.addCurve(to: CGPoint(x: 0.27492*width, y: 0.402*height), control1: CGPoint(x: 0.31787*width, y: 0.43108*height), control2: CGPoint(x: 0.29837*width, y: 0.41309*height))
        path.addCurve(to: CGPoint(x: 0.20513*width, y: 0.39684*height), control1: CGPoint(x: 0.25292*width, y: 0.39242*height), control2: CGPoint(x: 0.22831*width, y: 0.3906*height))
        path.addCurve(to: CGPoint(x: 0.14104*width, y: 0.4445*height), control1: CGPoint(x: 0.17838*width, y: 0.4038*height), control2: CGPoint(x: 0.1554*width, y: 0.42089*height))
        path.addCurve(to: CGPoint(x: 0.1282*width, y: 0.52333*height), control1: CGPoint(x: 0.12668*width, y: 0.46811*height), control2: CGPoint(x: 0.12207*width, y: 0.49639*height))
        path.addCurve(to: CGPoint(x: 0.17387*width, y: 0.58886*height), control1: CGPoint(x: 0.13433*width, y: 0.55028*height), control2: CGPoint(x: 0.15071*width, y: 0.57378*height))
        path.addCurve(to: CGPoint(x: 0.25227*width, y: 0.60411*height), control1: CGPoint(x: 0.19703*width, y: 0.60394*height), control2: CGPoint(x: 0.22514*width, y: 0.60941*height))
        path.addCurve(to: CGPoint(x: 0.2587*width, y: 0.60283*height), control1: CGPoint(x: 0.25445*width, y: 0.60371*height), control2: CGPoint(x: 0.25659*width, y: 0.60327*height))
        path.addCurve(to: CGPoint(x: 0.26771*width, y: 0.60112*height), control1: CGPoint(x: 0.26175*width, y: 0.60221*height), control2: CGPoint(x: 0.26473*width, y: 0.60159*height))
        path.addCurve(to: CGPoint(x: 0.27771*width, y: 0.60003*height), control1: CGPoint(x: 0.27098*width, y: 0.6004*height), control2: CGPoint(x: 0.27433*width, y: 0.60003*height))
        path.addCurve(to: CGPoint(x: 0.3107*width, y: 0.61375*height), control1: CGPoint(x: 0.29009*width, y: 0.60003*height), control2: CGPoint(x: 0.30195*width, y: 0.60497*height))
        path.addCurve(to: CGPoint(x: 0.32437*width, y: 0.64687*height), control1: CGPoint(x: 0.31946*width, y: 0.62253*height), control2: CGPoint(x: 0.32437*width, y: 0.63444*height))
        path.addCurve(to: CGPoint(x: 0.31651*width, y: 0.67289*height), control1: CGPoint(x: 0.32437*width, y: 0.65613*height), control2: CGPoint(x: 0.32164*width, y: 0.66518*height))
        path.addCurve(to: CGPoint(x: 0.29557*width, y: 0.69013*height), control1: CGPoint(x: 0.31138*width, y: 0.68059*height), control2: CGPoint(x: 0.30409*width, y: 0.68659*height))
        path.addCurve(to: CGPoint(x: 0.29024*width, y: 0.69198*height), control1: CGPoint(x: 0.29382*width, y: 0.69086*height), control2: CGPoint(x: 0.29205*width, y: 0.69147*height))
        path.addCurve(to: CGPoint(x: 0.28225*width, y: 0.69434*height), control1: CGPoint(x: 0.28762*width, y: 0.69289*height), control2: CGPoint(x: 0.28495*width, y: 0.69368*height))
        path.addCurve(to: CGPoint(x: 0.23651*width, y: 0.69997*height), control1: CGPoint(x: 0.26727*width, y: 0.69795*height), control2: CGPoint(x: 0.25192*width, y: 0.69984*height))
        path.addCurve(to: CGPoint(x: 0.14068*width, y: 0.67738*height), control1: CGPoint(x: 0.20318*width, y: 0.70056*height), control2: CGPoint(x: 0.17023*width, y: 0.69279*height))
        path.addCurve(to: CGPoint(x: 0.06729*width, y: 0.61173*height), control1: CGPoint(x: 0.11112*width, y: 0.66197*height), control2: CGPoint(x: 0.08589*width, y: 0.6394*height))
        path.addCurve(to: CGPoint(x: 0.03421*width, y: 0.519*height), control1: CGPoint(x: 0.0487*width, y: 0.58407*height), control2: CGPoint(x: 0.03732*width, y: 0.55219*height))
        path.addCurve(to: CGPoint(x: 0.04946*width, y: 0.42173*height), control1: CGPoint(x: 0.03109*width, y: 0.48582*height), control2: CGPoint(x: 0.03634*width, y: 0.45238*height))
        path.addCurve(to: CGPoint(x: 0.10934*width, y: 0.34358*height), control1: CGPoint(x: 0.06258*width, y: 0.39109*height), control2: CGPoint(x: 0.08317*width, y: 0.36423*height))
        path.addCurve(to: CGPoint(x: 0.1993*width, y: 0.30355*height), control1: CGPoint(x: 0.13552*width, y: 0.32294*height), control2: CGPoint(x: 0.16644*width, y: 0.30918*height))
        path.addCurve(to: CGPoint(x: 0.29744*width, y: 0.31138*height), control1: CGPoint(x: 0.23215*width, y: 0.29793*height), control2: CGPoint(x: 0.26589*width, y: 0.30062*height))
        path.addCurve(to: CGPoint(x: 0.37992*width, y: 0.36516*height), control1: CGPoint(x: 0.32899*width, y: 0.32214*height), control2: CGPoint(x: 0.35735*width, y: 0.34063*height))
        path.addCurve(to: CGPoint(x: 0.43888*width, y: 0.31829*height), control1: CGPoint(x: 0.39598*width, y: 0.34549*height), control2: CGPoint(x: 0.41609*width, y: 0.32951*height))
        path.addCurve(to: CGPoint(x: 0.51199*width, y: 0.30018*height), control1: CGPoint(x: 0.46167*width, y: 0.30708*height), control2: CGPoint(x: 0.4866*width, y: 0.3009*height))
        path.addCurve(to: CGPoint(x: 0.58601*width, y: 0.31409*height), control1: CGPoint(x: 0.53737*width, y: 0.29945*height), control2: CGPoint(x: 0.56262*width, y: 0.3042*height))
        path.addCurve(to: CGPoint(x: 0.64755*width, y: 0.35751*height), control1: CGPoint(x: 0.6094*width, y: 0.32398*height), control2: CGPoint(x: 0.63039*width, y: 0.33879*height))
        path.addCurve(to: CGPoint(x: 0.73694*width, y: 0.30488*height), control1: CGPoint(x: 0.67143*width, y: 0.33145*height), control2: CGPoint(x: 0.70256*width, y: 0.31312*height))
        path.addCurve(to: CGPoint(x: 0.84047*width, y: 0.31128*height), control1: CGPoint(x: 0.77132*width, y: 0.29664*height), control2: CGPoint(x: 0.80737*width, y: 0.29887*height))
        path.addCurve(to: CGPoint(x: 0.93419*width, y: 0.39288*height), control1: CGPoint(x: 0.88044*width, y: 0.32644*height), control2: CGPoint(x: 0.91368*width, y: 0.35538*height))
        path.closeSubpath()
        return path
    }
}


#Preview {
    VStack {
        CMLoadingAnimation()
    }
}

