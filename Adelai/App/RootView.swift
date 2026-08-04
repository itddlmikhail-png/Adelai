import SwiftUI

struct RootView: View {
    @EnvironmentObject private var store: AppStore

    var body: some View {
        Group {
            if store.hasCompletedOnboarding {
                MainTabView()
                    .transition(.opacity)
            } else {
                OnboardingView()
                    .transition(.opacity)
            }
        }
        .animation(AdelaiAnimation.gentle, value: store.hasCompletedOnboarding)
        .background(AdelaiColor.primaryBackground.ignoresSafeArea())
    }
}
