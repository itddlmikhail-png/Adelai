import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @State private var page = 0
    @State private var showCreateProject = false

    private let pages: [(title: String, message: String, icon: String)] = [
        (
            "Think in projects",
            "Every idea lives inside a Project — with its own memory, files, and AI partner.",
            "square.stack.3d.up"
        ),
        (
            "AI that remembers",
            "Adelai understands your notes, tasks, documents, and decisions. Context is never lost.",
            "brain.head.profile"
        ),
        (
            "A calm workspace",
            "Beautiful, focused, and fast. Create your first project in seconds.",
            "sparkles"
        )
    ]

    var body: some View {
        VStack(spacing: 0) {
            Spacer(minLength: AdelaiSpacing.xxl)

            TabView(selection: $page) {
                ForEach(Array(pages.enumerated()), id: \.offset) { index, item in
                    VStack(spacing: AdelaiSpacing.xl) {
                        ZStack {
                            Circle()
                                .stroke(AdelaiColor.border, lineWidth: 1)
                                .frame(width: 96, height: 96)
                            Image(systemName: item.icon)
                                .font(.system(size: 34, weight: .light))
                                .foregroundStyle(AdelaiColor.primaryText)
                        }
                        .adelaiAppear(0.05)

                        VStack(spacing: AdelaiSpacing.sm) {
                            Text("Adelai")
                                .font(AdelaiFont.largeTitle(.bold))
                                .foregroundStyle(AdelaiColor.primaryText)

                            Text(item.title)
                                .font(AdelaiFont.title(.semibold))
                                .foregroundStyle(AdelaiColor.primaryText)
                                .multilineTextAlignment(.center)

                            Text(item.message)
                                .font(AdelaiFont.body())
                                .foregroundStyle(AdelaiColor.secondaryText)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, AdelaiSpacing.xl)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        .adelaiAppear(0.1)
                    }
                    .tag(index)
                    .padding(.horizontal, AdelaiSpacing.screenHorizontal)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .frame(maxHeight: 420)

            HStack(spacing: 8) {
                ForEach(0..<pages.count, id: \.self) { index in
                    Capsule()
                        .fill(index == page ? AdelaiColor.accent : AdelaiColor.tertiaryText)
                        .frame(width: index == page ? 18 : 6, height: 6)
                        .animation(AdelaiAnimation.quick, value: page)
                }
            }
            .padding(.top, AdelaiSpacing.lg)

            Spacer()

            VStack(spacing: AdelaiSpacing.sm) {
                if page < pages.count - 1 {
                    AdelaiButton(title: "Continue") {
                        withAnimation(AdelaiAnimation.standard) { page += 1 }
                    }
                    Button("Skip") {
                        withAnimation(AdelaiAnimation.standard) { page = pages.count - 1 }
                    }
                    .font(AdelaiFont.callout(.medium))
                    .foregroundStyle(AdelaiColor.secondaryText)
                    .padding(.top, AdelaiSpacing.xs)
                } else {
                    AdelaiButton(title: "Create your first project", icon: "plus") {
                        showCreateProject = true
                    }
                    Button("Explore Adelai") {
                        store.completeOnboarding()
                    }
                    .font(AdelaiFont.callout(.medium))
                    .foregroundStyle(AdelaiColor.secondaryText)
                    .padding(.top, AdelaiSpacing.xs)
                }
            }
            .padding(.horizontal, AdelaiSpacing.screenHorizontal)
            .padding(.bottom, AdelaiSpacing.xxl)
        }
        .background(AdelaiColor.primaryBackground.ignoresSafeArea())
        .sheet(isPresented: $showCreateProject) {
            CreateProjectSheet { project in
                Task {
                    await dependencies.projects.createProject(project)
                    store.completeOnboarding()
                }
            }
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
        }
    }
}
