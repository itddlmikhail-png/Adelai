import SwiftUI

struct AdelaiCard<Content: View>: View {
    var padding: CGFloat = AdelaiSpacing.cardPadding
    var showBorder: Bool = true
    @ViewBuilder var content: () -> Content

    var body: some View {
        content()
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(AdelaiColor.card)
            .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous))
            .overlay {
                if showBorder {
                    RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous)
                        .strokeBorder(AdelaiColor.border, lineWidth: 1)
                }
            }
    }
}

struct AdelaiPressableCard<Content: View>: View {
    let action: () -> Void
    var padding: CGFloat = AdelaiSpacing.cardPadding
    @ViewBuilder var content: () -> Content

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            AdelaiCard(padding: padding, content: content)
                .scaleEffect(isPressed ? 0.985 : 1)
                .opacity(isPressed ? 0.92 : 1)
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
    }
}
