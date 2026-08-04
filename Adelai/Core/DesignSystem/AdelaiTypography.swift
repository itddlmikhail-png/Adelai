import SwiftUI

enum AdelaiFont {
    static func largeTitle(_ weight: Font.Weight = .bold) -> Font {
        .system(size: 34, weight: weight, design: .default)
    }

    static func title(_ weight: Font.Weight = .semibold) -> Font {
        .system(size: 28, weight: weight, design: .default)
    }

    static func headline(_ weight: Font.Weight = .semibold) -> Font {
        .system(size: 20, weight: weight, design: .default)
    }

    static func body(_ weight: Font.Weight = .regular) -> Font {
        .system(size: 17, weight: weight, design: .default)
    }

    static func callout(_ weight: Font.Weight = .medium) -> Font {
        .system(size: 15, weight: weight, design: .default)
    }

    static func caption(_ weight: Font.Weight = .regular) -> Font {
        .system(size: 13, weight: weight, design: .default)
    }

    static func micro(_ weight: Font.Weight = .medium) -> Font {
        .system(size: 11, weight: weight, design: .default)
    }

    static func mono(_ size: CGFloat = 14, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }
}

struct AdelaiTextStyle: ViewModifier {
    enum Style {
        case largeTitle
        case title
        case headline
        case body
        case callout
        case caption
        case secondary
        case tertiary
    }

    let style: Style

    func body(content: Content) -> some View {
        switch style {
        case .largeTitle:
            content.font(AdelaiFont.largeTitle()).foregroundStyle(AdelaiColor.primaryText)
        case .title:
            content.font(AdelaiFont.title()).foregroundStyle(AdelaiColor.primaryText)
        case .headline:
            content.font(AdelaiFont.headline()).foregroundStyle(AdelaiColor.primaryText)
        case .body:
            content.font(AdelaiFont.body()).foregroundStyle(AdelaiColor.primaryText)
        case .callout:
            content.font(AdelaiFont.callout()).foregroundStyle(AdelaiColor.primaryText)
        case .caption:
            content.font(AdelaiFont.caption()).foregroundStyle(AdelaiColor.secondaryText)
        case .secondary:
            content.font(AdelaiFont.body()).foregroundStyle(AdelaiColor.secondaryText)
        case .tertiary:
            content.font(AdelaiFont.caption()).foregroundStyle(AdelaiColor.tertiaryText)
        }
    }
}

extension View {
    func adelaiText(_ style: AdelaiTextStyle.Style) -> some View {
        modifier(AdelaiTextStyle(style: style))
    }
}
