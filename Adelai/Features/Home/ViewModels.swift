import Foundation
import SwiftUI

@MainActor
final class HomeViewModel: ObservableObject {
    @Published var searchText = ""

    let store: AppStore

    init(store: AppStore) {
        self.store = store
    }

    var pinned: [Project] {
        store.projects.filter(\.isPinned).sorted { $0.updatedAt > $1.updatedAt }
    }

    var recent: [Project] {
        store.projects.sorted { $0.lastOpenedAt > $1.lastOpenedAt }
    }

    var continueProject: Project? { recent.first }

    var recentSessions: [AIConversation] {
        Array(store.conversations.sorted { $0.updatedAt > $1.updatedAt }.prefix(4))
    }
}

@MainActor
final class ProjectsViewModel: ObservableObject {
    @Published var query = ""

    let store: AppStore
    private let repository: ProjectRepositoryProtocol

    init(store: AppStore, repository: ProjectRepositoryProtocol) {
        self.store = store
        self.repository = repository
    }

    var filtered: [Project] {
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

    var canCreateProject: Bool {
        store.profile.plan != .free || store.projects.count < AdelaiConstants.freeProjectLimit
    }

    func create(_ project: Project) async {
        await repository.createProject(project)
    }

    func togglePin(id: UUID) async {
        await repository.togglePin(id: id)
    }

    func delete(id: UUID) async {
        await repository.deleteProject(id: id)
    }
}

@MainActor
final class AIConversationViewModel: ObservableObject {
    @Published var conversation: AIConversation?
    @Published var input = ""
    @Published var isGenerating = false
    @Published var selectedProjectID: UUID?

    private let dependencies: DependencyContainer
    private let initialConversationID: UUID?
    private let initialProjectID: UUID?

    init(dependencies: DependencyContainer, conversationID: UUID?, projectID: UUID?) {
        self.dependencies = dependencies
        self.initialConversationID = conversationID
        self.initialProjectID = projectID
        self.selectedProjectID = projectID
    }

    var activeProject: Project? {
        let id = conversation?.projectID ?? selectedProjectID ?? initialProjectID
        return dependencies.store.projects.first { $0.id == id }
    }

    var canSend: Bool {
        !input.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isGenerating
    }

    func load() async {
        if let initialConversationID,
           let existing = await dependencies.conversations.fetchConversation(id: initialConversationID) {
            conversation = existing
            selectedProjectID = existing.projectID
        } else {
            selectedProjectID = initialProjectID
            conversation = AIConversation(
                id: UUID(),
                projectID: initialProjectID,
                title: "New Session",
                preview: "",
                updatedAt: Date(),
                isPinned: false,
                messages: []
            )
        }
    }

    func send() async {
        let prompt = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !prompt.isEmpty else { return }
        input = ""
        isGenerating = true

        var current = conversation ?? AIConversation(
            id: UUID(),
            projectID: selectedProjectID ?? initialProjectID,
            title: String(prompt.prefix(42)),
            preview: "",
            updatedAt: Date(),
            isPinned: false,
            messages: []
        )

        if current.messages.isEmpty {
            current.title = String(prompt.prefix(42))
        }
        current.projectID = selectedProjectID ?? current.projectID ?? initialProjectID
        current.messages.append(AIMessage(id: UUID(), role: .user, content: prompt, createdAt: Date()))
        conversation = current

        let project = activeProject
        let memory = project.map { p in dependencies.store.memory.filter { $0.projectID == p.id } } ?? []
        let reply = await dependencies.ai.respond(
            prompt: prompt,
            project: project,
            memory: memory,
            history: current.messages
        )

        current.messages.append(AIMessage(id: UUID(), role: .assistant, content: reply, createdAt: Date()))
        current.preview = reply
        current.updatedAt = Date()
        conversation = current
        await dependencies.conversations.saveConversation(current)

        if let project {
            await dependencies.timeline.appendEvent(
                TimelineEvent(
                    id: UUID(),
                    projectID: project.id,
                    title: "AI session updated",
                    detail: current.title,
                    timestamp: Date(),
                    kind: .ai
                )
            )
        }

        isGenerating = false
    }
}
