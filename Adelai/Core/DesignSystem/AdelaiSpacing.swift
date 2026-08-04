import SwiftUI

enum AdelaiSpacing {
    static let xxxs: CGFloat = 2
    static let xxs: CGFloat = 4
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 20
    static let xl: CGFloat = 24
    static let xxl: CGFloat = 32
    static let xxxl: CGFloat = 48
    static let huge: CGFloat = 64

    static let screenHorizontal: CGFloat = 20
    static let cardPadding: CGFloat = 16
    static let sectionGap: CGFloat = 28
    static let listRowGap: CGFloat = 10
    static let cornerRadius: CGFloat = 14
    static let cornerRadiusSmall: CGFloat = 10
    static let cornerRadiusLarge: CGFloat = 20
    static let buttonHeight: CGFloat = 52
    static let inputHeight: CGFloat = 48
    static let tabBarClearance: CGFloat = 88
}

enum AdelaiAnimation {
    static let quick = Animation.spring(response: 0.22, dampingFraction: 0.86)
    static let standard = Animation.spring(response: 0.28, dampingFraction: 0.84)
    static let gentle = Animation.spring(response: 0.36, dampingFraction: 0.88)
    static let press = Animation.spring(response: 0.18, dampingFraction: 0.72)
    static let appear = Animation.spring(response: 0.32, dampingFraction: 0.90)
}
