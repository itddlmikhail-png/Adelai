import SwiftUI

struct ProjectsView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @Binding var workspaceProjectID: UUID?
    @Binding var selectedTab: AppTab

    @State private var query = ""
    @State private var showCreate = false
    @State private var showPaywall = false

    private var filtered: [Project] {
        let base = store.projects.sorted { lhs, rhs in
            if lhs.isPinned != rhs.isPinned { return lhs.isPinned && !rhs.isPinned }
            return lhs.updatedAt > rhs.updatedAt
        }
        let q = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !q.isEmpty else { return base }
        return base.filter {
            $0.name.lowercased().contains(q) || $0.summary.lowercased().contains(q)
        }
    }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            AdelaiScreen {
                VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Projects")
                            .font(AdelaiFont.largeTitle(.bold))
                            .foregroundStyle(AdelaiColor.primaryText)
                        Text("\(store.projects.count) workspaces with private AI memory")
                            .font(AdelaiFont.callout())
                            .foregroundStyle(AdelaiColor.secondaryText)
                    }
                    .padding(.top, AdelaiSpacing.sm)

                    AdelaiSearchBar(text: $query, placeholder: "Search projects")

                    if filtered.isEmpty {
                        AdelaiEmptyState(
                            icon: "square.stack.3d.up",
                            title: "No projects yet",
                            message: "Create a project to give Adelai a place to think with you.",
                            actionTitle: "New Project"
                        ) { showCreate = true }
                    } else {
                        LazyVStack(spacing: AdelaiSpacing.sm) {
                            ForEach(filtered) { project in
                                ProjectRow(project: project) {
                                    open(project)
                                }
                                .contextMenu {
                                    Button {
                                        Task { await dependencies.projects.togglePin(id: project.id) }
                                    } label: {
                                        AdelaiContextMenuLabel(
                                            title: project.isPinned ? "Unpin" : "Pin",
                                            systemImage: project.isPinned ? "pin.slash" : "pin"
                                        )
                                    }
                                    Button(role: .destructive) {
                                        Task { await dependencies.projects.deleteProject(id: project.id) }
                                    } label: {
                                        AdelaiContextMenuLabel(title: "Delete", systemImage: "trash")
                                    }
                                }
                            }
                        }
                    }
                }
            }

            AdelaiFAB(label: "New") { showCreate = true }
                .padding(.trailing, AdelaiSpacing.screenHorizontal)
                .padding(.bottom, AdelaiSpacing.xxl)
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showCreate) {
            CreateProjectSheet { project in
                Task {
                    if store.profile.plan == .free && store.projects.count >= AdelaiConstants.freeProjectLimit {
                        showCreate = false
                        showPaywall = true
                        return
                    }
                    await dependencies.projects.createProject(project)
                }
            }
            .presentationDetents([.medium, .large])
        }
        .sheet(isPresented: $showPaywall) {
            SubscriptionView()
        }
    }

    private func open(_ project: Project) {
        workspaceProjectID = project.id
        selectedTab = .workspace
        Task {
            var updated = project
            updated.lastOpenedAt = Date()
            await dependencies.projects.updateProject(updated)
        }
    }
}

private struct ProjectRow: View {
    let project: Project
    let action: () -> Void

    var body: some View {
        AdelaiPressableCard(action: action) {
            HStack(alignment: .top, spacing: AdelaiSpacing.md) {
                ZStack {
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(AdelaiColor.inputFill)
                        .frame(width: 46, height: 46)
                    Image(systemName: project.icon)
                        .foregroundStyle(AdelaiColor.primaryText)
                }

                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(project.name)
                            .font(AdelaiFont.body(.semibold))
                            .foregroundStyle(AdelaiColor.primaryText)
                        Spacer()
                        if project.isPinned {
                            Image(systemName: "pin.fill")
                                .font(.system(size: 11))
                                .foregroundStyle(AdelaiColor.tertiaryText)
                        }
                    }
                    Text(project.summary)
                        .font(AdelaiFont.caption())
                        .foregroundStyle(AdelaiColor.secondaryText)
                        .lineLimit(2)
                    HStack(spacing: AdelaiSpacing.md) {
                        meta("\(project.openTaskCount) tasks")
                        meta("\(project.documentCount) docs")
                        meta(project.relativeUpdated)
                    }
                }
            }
        }
    }

    private func meta(_ text: String) -> some View {
        Text(text)
            .font(AdelaiFont.micro(.medium))
            .foregroundStyle(AdelaiColor.tertiaryText)
    }
}
