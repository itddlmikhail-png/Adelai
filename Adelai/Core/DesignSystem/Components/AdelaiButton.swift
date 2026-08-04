import SwiftUI

enum AdelaiButtonStyle {
    case primary
    case secondary
    case ghost
    case danger
    case compact
}

struct AdelaiButton: View {
    let title: String
    var icon: String? = nil
    var style: AdelaiButtonStyle = .primary
    var isLoading: Bool = false
    var isEnabled: Bool = true
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: {
            guard isEnabled, !isLoading else { return }
            action()
        }) {
            HStack(spacing: AdelaiSpacing.xs) {
                if isLoading {
                    ProgressView()
                        .tint(foreground)
                        .scaleEffect(0.85)
                } else {
                    if let icon {
                        Image(systemName: icon)
                            .font(.system(size: iconSize, weight: .semibold))
                    }
                    Text(title)
                        .font(font)
                }
            }
            .foregroundStyle(foreground.opacity(isEnabled ? 1 : 0.4))
            .frame(maxWidth: style == .compact ? nil : .infinity)
            .frame(height: height)
            .padding(.horizontal, style == .compact ? AdelaiSpacing.md : AdelaiSpacing.lg)
            .background(background)
            .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadiusSmall, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadiusSmall, style: .continuous)
                    .strokeBorder(border, lineWidth: 1)
            )
            .scaleEffect(isPressed ? 0.97 : 1)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    withAnimation(AdelaiAnimation.press) { isPressed = true }
                }
                .onEnded { _ in
                    withAnimation(AdelaiAnimation.press) { isPressed = false }
                }
        )
        .disabled(!isEnabled || isLoading)
        .accessibilityLabel(title)
    }

    private var height: CGFloat {
        style == .compact ? 36 : AdelaiSpacing.buttonHeight
    }

    private var font: Font {
        style == .compact ? AdelaiFont.caption(.semibold) : AdelaiFont.body(.semibold)
    }

    private var iconSize: CGFloat {
        style == .compact ? 12 : 15
    }

    private var foreground: Color {
        switch style {
        case .primary: return AdelaiColor.primaryBackground
        case .secondary, .ghost, .compact: return AdelaiColor.primaryText
        case .danger: return AdelaiColor.danger
        }
    }

    private var background: Color {
        switch style {
        case .primary: return AdelaiColor.accent
        case .secondary: return AdelaiColor.card
        case .ghost, .compact: return .clear
        case .danger: return AdelaiColor.danger.opacity(0.12)
        }
    }

    private var border: Color {
        switch style {
        case .primary: return .clear
        case .secondary: return AdelaiColor.border
        case .ghost, .compact: return AdelaiColor.border
        case .danger: return AdelaiColor.danger.opacity(0.25)
        }
    }
}
