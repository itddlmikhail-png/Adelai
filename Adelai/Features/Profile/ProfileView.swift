import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @State private var showSubscription = false
    @State private var isSyncing = false

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                HStack(spacing: AdelaiSpacing.md) {
                    AdelaiAvatar(initials: String(store.profile.name.prefix(1)).uppercased(), size: 64)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(store.profile.name)
                            .font(AdelaiFont.title(.bold))
                            .foregroundStyle(AdelaiColor.primaryText)
                        Text(store.profile.email)
                            .font(AdelaiFont.callout())
                            .foregroundStyle(AdelaiColor.secondaryText)
                        AdelaiBadge(text: store.profile.plan.title, tone: .accent)
                    }
                }
                .padding(.top, AdelaiSpacing.sm)

                AdelaiCard {
                    VStack(alignment: .leading, spacing: AdelaiSpacing.md) {
                        AdelaiListRow(
                            title: "Subscription",
                            subtitle: "\(store.profile.plan.title) plan",
                            icon: "creditcard",
                            showChevron: true
                        )
                        .padding(.vertical, -AdelaiSpacing.sm)
                        .contentShape(Rectangle())
                        .onTapGesture { showSubscription = true }

                        AdelaiDivider()

                        AdelaiListRow(
                            title: "Cloud Sync",
                            subtitle: store.isOnline ? "Online · CloudKit ready" : "Offline cache active",
                            icon: "icloud",
                            trailing: isSyncing ? "Syncing" : "Ready",
                            showChevron: false
                        )
                        .padding(.vertical, -AdelaiSpacing.sm)

                        AdelaiDivider()

                        AdelaiListRow(
                            title: "Projects",
                            subtitle: "\(store.projects.count) total",
                            icon: "square.stack.3d.up",
                            showChevron: false
                        )
                        .padding(.vertical, -AdelaiSpacing.sm)
                    }
                }

                VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                    AdelaiSectionHeader(title: "Preferences")
                    AdelaiCard {
                        VStack(spacing: 0) {
                            preference("Appearance", "Dark")
                            AdelaiDivider()
                            preference("Voice Input", "Ready")
                            AdelaiDivider()
                            preference("Offline Cache", "Enabled")
                            AdelaiDivider()
                            preference("Priority Models", store.profile.plan == .free ? "Pro" : "On")
                        }
                    }
                }

                AdelaiButton(
                    title: isSyncing ? "Syncing…" : "Sync Now",
                    icon: "arrow.triangle.2.circlepath",
                    style: .secondary,
                    isLoading: isSyncing
                ) {
                    Task {
                        isSyncing = true
                        try? await dependencies.sync.sync()
                        isSyncing = false
                    }
                }

                AdelaiButton(title: "Manage Subscription", icon: "sparkles") {
                    showSubscription = true
                }
            }
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showSubscription) {
            SubscriptionView()
        }
    }

    private func preference(_ title: String, _ value: String) -> some View {
        HStack {
            Text(title)
                .font(AdelaiFont.body())
                .foregroundStyle(AdelaiColor.primaryText)
            Spacer()
            Text(value)
                .font(AdelaiFont.callout())
                .foregroundStyle(AdelaiColor.secondaryText)
        }
        .padding(.vertical, AdelaiSpacing.sm)
    }
}
