import SwiftUI

struct AdelaiSearchBar: View {
    @Binding var text: String
    var placeholder: String = "Search"
    var onSubmit: (() -> Void)? = nil

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: AdelaiSpacing.sm) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(AdelaiColor.secondaryText)

            TextField(placeholder, text: $text)
                .font(AdelaiFont.body())
                .foregroundStyle(AdelaiColor.primaryText)
                .tint(AdelaiColor.accent)
                .focused($isFocused)
                .submitLabel(.search)
                .onSubmit { onSubmit?() }

            if !text.isEmpty {
                Button {
                    withAnimation(AdelaiAnimation.quick) { text = "" }
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 16))
                        .foregroundStyle(AdelaiColor.tertiaryText)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, AdelaiSpacing.md)
        .frame(height: AdelaiSpacing.inputHeight)
        .background(AdelaiColor.inputFill)
        .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadiusSmall, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadiusSmall, style: .continuous)
                .strokeBorder(isFocused ? AdelaiColor.borderStrong : AdelaiColor.border, lineWidth: 1)
        )
        .animation(AdelaiAnimation.quick, value: isFocused)
    }
}
