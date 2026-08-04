import SwiftUI

struct SubscriptionView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @Environment(\.dismiss) private var dismiss
    @State private var selected: SubscriptionPlan

    init() {
        _selected = State(initialValue: .pro)
    }

    var body: some View {
        NavigationStack {
            AdelaiScreen {
                VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Adelai")
                            .font(AdelaiFont.largeTitle(.bold))
                            .foregroundStyle(AdelaiColor.primaryText)
                        Text("Choose the workspace that matches how you build.")
                            .font(AdelaiFont.body())
                            .foregroundStyle(AdelaiColor.secondaryText)
                    }
                    .padding(.top, AdelaiSpacing.sm)

                    ForEach(SubscriptionPlan.allCases, id: \.self) { plan in
                        Button {
                            withAnimation(AdelaiAnimation.quick) { selected = plan }
                        } label: {
                            VStack(alignment: .leading, spacing: AdelaiSpacing.md) {
                                HStack(alignment: .firstTextBaseline) {
                                    Text(plan.title)
                                        .font(AdelaiFont.headline())
                                        .foregroundStyle(AdelaiColor.primaryText)
                                    Spacer()
                                    HStack(alignment: .firstTextBaseline, spacing: 2) {
                                        Text(plan.priceLabel)
                                            .font(AdelaiFont.title(.bold))
                                            .foregroundStyle(AdelaiColor.primaryText)
                                        if !plan.periodLabel.isEmpty {
                                            Text(plan.periodLabel)
                                                .font(AdelaiFont.caption())
                                                .foregroundStyle(AdelaiColor.secondaryText)
                                        }
                                    }
                                }

                                VStack(alignment: .leading, spacing: AdelaiSpacing.xs) {
                                    ForEach(plan.features, id: \.self) { feature in
                                        HStack(spacing: AdelaiSpacing.sm) {
                                            Image(systemName: "checkmark")
                                                .font(.system(size: 11, weight: .bold))
                                                .foregroundStyle(AdelaiColor.primaryText)
                                            Text(feature)
                                                .font(AdelaiFont.callout())
                                                .foregroundStyle(AdelaiColor.secondaryText)
                                        }
                                    }
                                }

                                if store.profile.plan == plan {
                                    AdelaiBadge(text: "Current plan", tone: .success)
                                }
                            }
                            .padding(AdelaiSpacing.md)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(AdelaiColor.card)
                            .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous))
                            .overlay(
                                RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous)
                                    .strokeBorder(
                                        selected == plan ? AdelaiColor.accent.opacity(0.6) : AdelaiColor.border,
                                        lineWidth: 1
                                    )
                            )
                        }
                        .buttonStyle(.plain)
                    }

                    AdelaiButton(title: ctaTitle) {
                        Task {
                            await dependencies.subscription.upgrade(to: selected)
                            dismiss()
                        }
                    }
                }
            }
            .navigationTitle("Subscription")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Close") { dismiss() }
                        .foregroundStyle(AdelaiColor.secondaryText)
                }
            }
            .adelaiNavigationChrome()
            .onAppear { selected = store.profile.plan == .free ? .pro : store.profile.plan }
        }
    }

    private var ctaTitle: String {
        if selected == store.profile.plan { return "Current Plan" }
        return selected == .free ? "Switch to Free" : "Upgrade to \(selected.title)"
    }
}
