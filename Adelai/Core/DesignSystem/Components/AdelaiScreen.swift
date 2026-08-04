import SwiftUI

struct AdelaiScreen<Content: View>: View {
    var showsScrollIndicators: Bool = false
    @ViewBuilder var content: () -> Content

    var body: some View {
        ScrollView(showsIndicators: showsScrollIndicators) {
            content()
                .padding(.horizontal, AdelaiSpacing.screenHorizontal)
                .padding(.top, AdelaiSpacing.sm)
                .padding(.bottom, AdelaiSpacing.tabBarClearance)
        }
        .background(AdelaiColor.primaryBackground.ignoresSafeArea())
    }
}

struct AdelaiNavigationChrome: ViewModifier {
    func body(content: Content) -> some View {
        content
            .toolbarBackground(AdelaiColor.primaryBackground, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
    }
}

extension View {
    func adelaiNavigationChrome() -> some View {
        modifier(AdelaiNavigationChrome())
    }

    func adelaiAppear(_ delay: Double = 0) -> some View {
        modifier(AdelaiAppearModifier(delay: delay))
    }
}

private struct AdelaiAppearModifier: ViewModifier {
    let delay: Double
    @State private var visible = false

    func body(content: Content) -> some View {
        content
            .opacity(visible ? 1 : 0)
            .offset(y: visible ? 0 : 8)
            .onAppear {
                withAnimation(AdelaiAnimation.appear.delay(delay)) {
                    visible = true
                }
            }
    }
}

struct AdelaiContextMenuLabel: View {
    let title: String
    let systemImage: String

    var body: some View {
        Label(title, systemImage: systemImage)
    }
}
