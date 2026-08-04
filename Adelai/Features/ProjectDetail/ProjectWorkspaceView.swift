import SwiftUI

enum ProjectSection: String, CaseIterable, Identifiable, Hashable {
    case overview, ai, documents, notes, tasks, files, timeline, knowledge, memory, settings

    var id: String { rawValue }

    var title: String {
        switch self {
        case .overview: return "Overview"
        case .ai: return "AI"
        case .documents: return "Documents"
        case .notes: return "Notes"
        case .tasks: return "Tasks"
        case .files: return "Files"
        case .timeline: return "Timeline"
        case .knowledge: return "Knowledge"
        case .memory: return "AI Memory"
        case .settings: return "Settings"
        }
    }

    var icon: String {
        switch self {
        case .overview: return "rectangle.3.group"
        case .ai: return "sparkles"
        case .documents: return "doc.text"
        case .notes: return "note.text"
        case .tasks: return "checklist"
        case .files: return "folder"
        case .timeline: return "clock"
        case .knowledge: return "books.vertical"
        case .memory: return "brain.head.profile"
        case .settings: return "gearshape"
        }
    }
}

struct ProjectWorkspaceView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore
    @State private var section: ProjectSection = .overview
    @State private var showAI = false

    private var project: Project? {
        store.projects.first { $0.id == projectID }
    }

    var body: some View {
        Group {
            if let project {
                VStack(spacing: 0) {
                    header(project)
                    sectionPicker
                    Divider().overlay(AdelaiColor.separator)
                    sectionContent(project)
                }
                .background(AdelaiColor.primaryBackground.ignoresSafeArea())
            } else {
                AdelaiEmptyState(
                    icon: "exclamationmark.triangle",
                    title: "Project unavailable",
                    message: "This project could not be found."
                )
                .background(AdelaiColor.primaryBackground.ignoresSafeArea())
            }
        }
        .sheet(isPresented: $showAI) {
            NavigationStack {
                AIConversationView(conversationID: nil, projectID: projectID)
            }
        }
    }

    private func header(_ project: Project) -> some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(project.name)
                        .font(AdelaiFont.title(.bold))
                        .foregroundStyle(AdelaiColor.primaryText)
                    Text(project.goal)
                        .font(AdelaiFont.caption())
                        .foregroundStyle(AdelaiColor.secondaryText)
                        .lineLimit(2)
                }
                Spacer()
                Button { showAI = true } label: {
                    Image(systemName: "sparkles")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(AdelaiColor.primaryBackground)
                        .frame(width: 40, height: 40)
                        .background(AdelaiColor.accent)
                        .clipShape(Circle())
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, AdelaiSpacing.screenHorizontal)
        .padding(.top, AdelaiSpacing.md)
        .padding(.bottom, AdelaiSpacing.sm)
    }

    private var sectionPicker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: AdelaiSpacing.xs) {
                ForEach(ProjectSection.allCases) { item in
                    Button {
                        withAnimation(AdelaiAnimation.quick) { section = item }
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: item.icon)
                                .font(.system(size: 12, weight: .semibold))
                            Text(item.title)
                                .font(AdelaiFont.caption(.semibold))
                        }
                        .foregroundStyle(section == item ? AdelaiColor.primaryBackground : AdelaiColor.secondaryText)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(section == item ? AdelaiColor.accent : AdelaiColor.card)
                        .clipShape(Capsule(style: .continuous))
                        .overlay(
                            Capsule(style: .continuous)
                                .strokeBorder(section == item ? Color.clear : AdelaiColor.border, lineWidth: 1)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, AdelaiSpacing.screenHorizontal)
            .padding(.vertical, AdelaiSpacing.sm)
        }
    }

    @ViewBuilder
    private func sectionContent(_ project: Project) -> some View {
        switch section {
        case .overview:
            ProjectOverviewView(project: project) { section = $0 }
        case .ai:
            ProjectAIView(projectID: project.id)
        case .documents:
            ProjectDocumentsView(projectID: project.id)
        case .notes:
            ProjectNotesView(projectID: project.id)
        case .tasks:
            ProjectTasksView(projectID: project.id)
        case .files:
            ProjectFilesView(projectID: project.id)
        case .timeline:
            ProjectTimelineView(projectID: project.id)
        case .knowledge:
            ProjectKnowledgeView(projectID: project.id)
        case .memory:
            ProjectMemoryView(projectID: project.id)
        case .settings:
            ProjectSettingsView(project: project)
        }
    }
}

struct ProjectOverviewView: View {
    let project: Project
    var onSelect: (ProjectSection) -> Void
    @EnvironmentObject private var store: AppStore

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                AdelaiCard {
                    VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                        Text("AI Memory")
                            .font(AdelaiFont.caption(.medium))
                            .foregroundStyle(AdelaiColor.secondaryText)
                        Text(project.memorySummary)
                            .font(AdelaiFont.body())
                            .foregroundStyle(AdelaiColor.primaryText)
                    }
                }

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: AdelaiSpacing.sm) {
                    metric("Documents", "\(project.documentCount)", .documents)
                    metric("Notes", "\(project.noteCount)", .notes)
                    metric("Open Tasks", "\(project.openTaskCount)", .tasks)
                    metric("Files", "\(project.fileCount)", .files)
                }

                VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                    AdelaiSectionHeader(title: "Jump in")
                    ForEach([ProjectSection.ai, .documents, .tasks, .memory], id: \.self) { item in
                        AdelaiPressableCard {
                            onSelect(item)
                        } content: {
                            AdelaiListRow(title: item.title, subtitle: subtitle(for: item), icon: item.icon)
                                .padding(.vertical, -AdelaiSpacing.sm)
                        }
                    }
                }
            }
        }
    }

    private func metric(_ title: String, _ value: String, _ section: ProjectSection) -> some View {
        Button {
            onSelect(section)
        } label: {
            AdelaiCard {
                VStack(alignment: .leading, spacing: 6) {
                    Text(value)
                        .font(AdelaiFont.title(.bold))
                        .foregroundStyle(AdelaiColor.primaryText)
                    Text(title)
                        .font(AdelaiFont.caption())
                        .foregroundStyle(AdelaiColor.secondaryText)
                }
            }
        }
        .buttonStyle(.plain)
    }

    private func subtitle(for section: ProjectSection) -> String {
        switch section {
        case .ai: return "Project partner with full context"
        case .documents: return "\(project.documentCount) documents"
        case .tasks: return "\(project.openTaskCount) open"
        case .memory: return "\(store.memory.filter { $0.projectID == project.id }.count) facts"
        default: return section.title
        }
    }
}
