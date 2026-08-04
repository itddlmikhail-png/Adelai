import SwiftUI

struct AdelaiTextField: View {
    let placeholder: String
    @Binding var text: String
    var axis: Axis = .horizontal
    var icon: String? = nil
    var isSecure: Bool = false

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(alignment: axis == .vertical ? .top : .center, spacing: AdelaiSpacing.sm) {
            if let icon {
                Image(systemName: icon)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(AdelaiColor.secondaryText)
                    .padding(.top, axis == .vertical ? 2 : 0)
            }

            Group {
                if isSecure {
                    SecureField(placeholder, text: $text)
                } else if axis == .vertical {
                    TextField(placeholder, text: $text, axis: .vertical)
                        .lineLimit(3...8)
                } else {
                    TextField(placeholder, text: $text)
                }
            }
            .font(AdelaiFont.body())
            .foregroundStyle(AdelaiColor.primaryText)
            .tint(AdelaiColor.accent)
            .focused($isFocused)
        }
        .padding(.horizontal, AdelaiSpacing.md)
        .padding(.vertical, axis == .vertical ? AdelaiSpacing.md : 0)
        .frame(minHeight: AdelaiSpacing.inputHeight)
        .background(AdelaiColor.inputFill)
        .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadiusSmall, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadiusSmall, style: .continuous)
                .strokeBorder(isFocused ? AdelaiColor.borderStrong : AdelaiColor.border, lineWidth: 1)
        )
        .animation(AdelaiAnimation.quick, value: isFocused)
    }
}

struct AdelaiFAB: View {
    var icon: String = "plus"
    var label: String? = nil
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            HStack(spacing: AdelaiSpacing.xs) {
                Image(systemName: icon)
                    .font(.system(size: 17, weight: .semibold))
                if let label {
                    Text(label)
                        .font(AdelaiFont.callout(.semibold))
                }
            }
            .foregroundStyle(AdelaiColor.primaryBackground)
            .padding(.horizontal, label == nil ? 0 : AdelaiSpacing.lg)
            .frame(width: label == nil ? 56 : nil, height: 56)
            .background(AdelaiColor.accent)
            .clipShape(Capsule(style: .continuous))
            .shadow(color: .black.opacity(0.35), radius: 16, y: 8)
            .scaleEffect(isPressed ? 0.94 : 1)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in withAnimation(AdelaiAnimation.press) { isPressed = true } }
                .onEnded { _ in withAnimation(AdelaiAnimation.press) { isPressed = false } }
        )
        .accessibilityLabel(label ?? "Create")
    }
}

struct AdelaiSectionHeader: View {
    let title: String
    var actionTitle: String? = nil
    var action: (() -> Void)? = nil

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title)
                .font(AdelaiFont.headline())
                .foregroundStyle(AdelaiColor.primaryText)

            Spacer()

            if let actionTitle, let action {
                Button(action: action) {
                    Text(actionTitle)
                        .font(AdelaiFont.caption(.medium))
                        .foregroundStyle(AdelaiColor.secondaryText)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

struct AdelaiEmptyState: View {
    let icon: String
    let title: String
    let message: String
    var actionTitle: String? = nil
    var action: (() -> Void)? = nil

    var body: some View {
        VStack(spacing: AdelaiSpacing.md) {
            Image(systemName: icon)
                .font(.system(size: 36, weight: .light))
                .foregroundStyle(AdelaiColor.tertiaryText)

            VStack(spacing: AdelaiSpacing.xs) {
                Text(title)
                    .font(AdelaiFont.headline())
                    .foregroundStyle(AdelaiColor.primaryText)
                    .multilineTextAlignment(.center)

                Text(message)
                    .font(AdelaiFont.callout())
                    .foregroundStyle(AdelaiColor.secondaryText)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }

            if let actionTitle, let action {
                AdelaiButton(title: actionTitle, style: .secondary, action: action)
                    .frame(maxWidth: 220)
                    .padding(.top, AdelaiSpacing.xs)
            }
        }
        .padding(AdelaiSpacing.xxl)
        .frame(maxWidth: .infinity)
    }
}

struct AdelaiBadge: View {
    let text: String
    var tone: Tone = .neutral

    enum Tone {
        case neutral, success, warning, danger, accent
    }

    var body: some View {
        Text(text)
            .font(AdelaiFont.micro(.semibold))
            .foregroundStyle(foreground)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(background)
            .clipShape(Capsule(style: .continuous))
    }

    private var foreground: Color {
        switch tone {
        case .neutral, .accent: return AdelaiColor.primaryText
        case .success: return AdelaiColor.success
        case .warning: return AdelaiColor.warning
        case .danger: return AdelaiColor.danger
        }
    }

    private var background: Color {
        switch tone {
        case .neutral: return AdelaiColor.whiteOverlay(0.08)
        case .accent: return AdelaiColor.whiteOverlay(0.12)
        case .success: return AdelaiColor.success.opacity(0.14)
        case .warning: return AdelaiColor.warning.opacity(0.14)
        case .danger: return AdelaiColor.danger.opacity(0.14)
        }
    }
}

private extension AdelaiColor {
    static func whiteOverlay(_ opacity: Double) -> Color {
        Color.white.opacity(opacity)
    }
}

struct AdelaiListRow: View {
    let title: String
    var subtitle: String? = nil
    var icon: String? = nil
    var trailing: String? = nil
    var showChevron: Bool = true

    var body: some View {
        HStack(spacing: AdelaiSpacing.md) {
            if let icon {
                ZStack {
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .fill(AdelaiColor.inputFill)
                        .frame(width: 40, height: 40)
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(AdelaiColor.primaryText)
                }
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(AdelaiFont.body(.medium))
                    .foregroundStyle(AdelaiColor.primaryText)
                    .lineLimit(1)

                if let subtitle {
                    Text(subtitle)
                        .font(AdelaiFont.caption())
                        .foregroundStyle(AdelaiColor.secondaryText)
                        .lineLimit(1)
                }
            }

            Spacer(minLength: AdelaiSpacing.sm)

            if let trailing {
                Text(trailing)
                    .font(AdelaiFont.caption())
                    .foregroundStyle(AdelaiColor.tertiaryText)
            }

            if showChevron {
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(AdelaiColor.tertiaryText)
            }
        }
        .padding(.vertical, AdelaiSpacing.sm)
        .contentShape(Rectangle())
    }
}

struct AdelaiDivider: View {
    var body: some View {
        Rectangle()
            .fill(AdelaiColor.separator)
            .frame(height: 1)
    }
}

struct AdelaiAvatar: View {
    let initials: String
    var size: CGFloat = 40

    var body: some View {
        Text(initials)
            .font(.system(size: size * 0.36, weight: .semibold))
            .foregroundStyle(AdelaiColor.primaryBackground)
            .frame(width: size, height: size)
            .background(AdelaiColor.accent)
            .clipShape(Circle())
    }
}
