import SwiftUI

enum AdelaiColor {
    static let primaryBackground = Color(hex: 0x09090B)
    static let secondaryBackground = Color(hex: 0x111214)
    static let card = Color(hex: 0x18181B)
    static let elevated = Color(hex: 0x1C1C1F)
    static let border = Color.white.opacity(0.06)
    static let borderStrong = Color.white.opacity(0.10)
    static let primaryText = Color.white
    static let secondaryText = Color(hex: 0x8A8A8F)
    static let tertiaryText = Color(hex: 0x5C5C61)
    static let accent = Color.white
    static let danger = Color(hex: 0xEF4444)
    static let success = Color(hex: 0x22C55E)
    static let warning = Color(hex: 0xF59E0B)
    static let overlay = Color.black.opacity(0.55)
    static let inputFill = Color.white.opacity(0.04)
    static let separator = Color.white.opacity(0.06)
}

extension Color {
    init(hex: UInt, alpha: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: alpha
        )
    }
}
