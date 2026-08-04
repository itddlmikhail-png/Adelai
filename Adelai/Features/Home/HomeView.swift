import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @Binding var selectedTab: AppTab
    @Binding var workspaceProjectID: UUID?

    @State private var searchText = ""
    @State private var showSearch = false
    @State private var showCreate = false

    private var pinned: [Project] {
        store.projects.filter(\.isPinned).sorted { $0.updatedAt > $1.updatedAt }
    }

    private var recent: [Project] {
        store.projects.sorted { $0.lastOpenedAt > $1.lastOpenedAt }
    }

    private var continueProject: Project? {
        recent.first
    }

    private var recentSessions: [AIConversation] {
        Array(store.conversations.sorted { $0.updatedAt > $1.updatedAt }.prefix(4))
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                header
                    .adelaiAppear(0)

                AdelaiSearchBar(text: $searchText, placeholder: "Search projects, notes, AI…") {
                    showSearch = true
                }
                .adelaiAppear(0.04)
                .onTapGesture { showSearch = true }

                if let continueProject {
                    continueSection(continueProject)
                        .adelaiAppear(0.06)
                }

                if !pinned.isEmpty {
                    pinnedSection
                        .adelaiAppear(0.08)
                }

                recentSection
                    .adelaiAppear(0.1)

                quickActions
                    .adelaiAppear(0.12)

                sessionsSection
                    .adelaiAppear(0.14)
            }
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showCreate) {
            CreateProjectSheet { project in
                Task { await dependencies.projects.createProject(project) }
            }
            .presentationDetents([.medium, .large])
        }
        .sheet(isPresented: $showSearch) {
            NavigationStack {
                SearchView(initialQuery: searchText)
            }
            .presentationDetents([.large])
        }
    }

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Text(Greeting.current())
                    .font(AdelaiFont.caption(.medium))
                    .foregroundStyle(AdelaiColor.secondaryText)
                Text("Adelai")
                    .font(AdelaiFont.largeTitle(.bold))
                    .foregroundStyle(AdelaiColor.primaryText)
                Text("Your AI workspace")
                    .font(AdelaiFont.callout())
                    .foregroundStyle(AdelaiColor.secondaryText)
            }
            Spacer()
            AdelaiAvatar(initials: String(store.profile.name.prefix(1)).uppercased(), size: 36)
        }
        .padding(.top, AdelaiSpacing.sm)
    }

    private func continueSection(_ project: Project) -> some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            AdelaiSectionHeader(title: "Continue Working")
            AdelaiPressableCard {
                openProject(project)
            } content: {
                HStack(spacing: AdelaiSpacing.md) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .fill(AdelaiColor.inputFill)
                            .frame(width: 48, height: 48)
                        Image(systemName: project.icon)
                            .foregroundStyle(AdelaiColor.primaryText)
                    }
                    VStack(alignment: .leading, spacing: 4) {
                        Text(project.name)
                            .font(AdelaiFont.body(.semibold))
                            .foregroundStyle(AdelaiColor.primaryText)
                        Text(project.summary)
                            .font(AdelaiFont.caption())
                            .foregroundStyle(AdelaiColor.secondaryText)
                            .lineLimit(2)
                    }
                    Spacer()
                    Image(systemName: "arrow.up.right")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(AdelaiColor.tertiaryText)
                }
            }
        }
    }

    private var pinnedSection: some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            AdelaiSectionHeader(title: "Pinned Projects")
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: AdelaiSpacing.sm) {
                    ForEach(pinned) { project in
                        AdelaiPressableCard {
                            openProject(project)
                        } content: {
                            VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                                Image(systemName: project.icon)
                                    .foregroundStyle(AdelaiColor.primaryText)
                                Text(project.name)
                                    .font(AdelaiFont.callout(.semibold))
                                    .foregroundStyle(AdelaiColor.primaryText)
                                    .lineLimit(1)
                                Text(project.relativeUpdated)
                                    .font(AdelaiFont.caption())
                                    .foregroundStyle(AdelaiColor.secondaryText)
                            }
                            .frame(width: 150, alignment: .leading)
                        }
                    }
                }
            }
        }
    }

    private var recentSection: some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            AdelaiSectionHeader(title: "Recent Projects", actionTitle: "See all") {
                selectedTab = .projects
            }
            VStack(spacing: 0) {
                ForEach(Array(recent.prefix(4))) { project in
                    Button {
                        openProject(project)
                    } label: {
                        AdelaiListRow(
                            title: project.name,
                            subtitle: "\(project.openTaskCount) open · \(project.relativeUpdated)",
                            icon: project.icon
                        )
                    }
                    .buttonStyle(.plain)
                    if project.id != recent.prefix(4).last?.id {
                        AdelaiDivider()
                    }
                }
            }
            .padding(.horizontal, AdelaiSpacing.md)
            .background(AdelaiColor.card)
            .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous)
                    .strokeBorder(AdelaiColor.border, lineWidth: 1)
            )
        }
    }

    private var quickActions: some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            AdelaiSectionHeader(title: "Quick Actions")
            HStack(spacing: AdelaiSpacing.sm) {
                quickAction(title: "New Project", icon: "plus") { showCreate = true }
                quickAction(title: "Ask AI", icon: "sparkles") { selectedTab = .ai }
                quickAction(title: "Search", icon: "magnifyingglass") { showSearch = true }
            }
        }
    }

    private func quickAction(title: String, icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: AdelaiSpacing.xs) {
                Image(systemName: icon)
                    .font(.system(size: 16, weight: .semibold))
                Text(title)
                    .font(AdelaiFont.caption(.medium))
            }
            .foregroundStyle(AdelaiColor.primaryText)
            .frame(maxWidth: .infinity)
            .padding(.vertical, AdelaiSpacing.md)
            .background(AdelaiColor.card)
            .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous)
                    .strokeBorder(AdelaiColor.border, lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }

    private var sessionsSection: some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            AdelaiSectionHeader(title: "Recent AI Sessions", actionTitle: "Open") {
                selectedTab = .ai
            }
            VStack(spacing: AdelaiSpacing.sm) {
                ForEach(recentSessions) { session in
                    AdelaiCard {
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text(session.title)
                                    .font(AdelaiFont.body(.medium))
                                    .foregroundStyle(AdelaiColor.primaryText)
                                    .lineLimit(1)
                                Spacer()
                                if session.isPinned {
                                    Image(systemName: "pin.fill")
                                        .font(.system(size: 10))
                                        .foregroundStyle(AdelaiColor.tertiaryText)
                                }
                            }
                            Text(session.preview)
                                .font(AdelaiFont.caption())
                                .foregroundStyle(AdelaiColor.secondaryText)
                                .lineLimit(2)
                            Text(RelativeTimeFormatter.string(from: session.updatedAt))
                                .font(AdelaiFont.micro())
                                .foregroundStyle(AdelaiColor.tertiaryText)
                        }
                    }
                }
            }
        }
    }

    private func openProject(_ project: Project) {
        workspaceProjectID = project.id
        selectedTab = .workspace
        Task {
            var updated = project
            updated.lastOpenedAt = Date()
            await dependencies.projects.updateProject(updated)
        }
    }
}
