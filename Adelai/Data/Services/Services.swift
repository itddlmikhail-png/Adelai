import Foundation

@MainActor
final class AdelaiAIService: AIServiceProtocol {
    func respond(
        prompt: String,
        project: Project?,
        memory: [MemoryFact],
        history: [AIMessage]
    ) async -> String {
        try? await Task.sleep(nanoseconds: 450_000_000)

        let lowered = prompt.lowercased()
        let memoryLines = memory.prefix(4).map { "- \($0.title): \($0.detail)" }.joined(separator: "\n")
        let projectName = project?.name ?? "your workspace"
        let goal = project?.goal ?? "build with clarity"
        let memoryBlock = memoryLines.isEmpty
            ? "I do not have durable facts yet — everything we decide can become memory."
            : "Here is what I already know:\n\(memoryLines)"

        if lowered.contains("task") || lowered.contains("next") {
            return """
            In **\(projectName)**, the next useful move is to convert intent into one clear task.

            ## Suggested next step
            - Capture a single outcome tied to: \(goal)
            - Keep the title decisive
            - Attach any relevant note or file

            \(memoryBlock)
            """
        }

        if lowered.contains("summar") || lowered.contains("status") {
            return """
            ## \(projectName) status

            Goal: \(goal)

            \(memoryBlock)

            I can turn this into a document, a checklist, or a tighter narrative whenever you want.
            """
        }

        if lowered.contains("memory") {
            return """
            Memory in Adelai is project-owned.

            ## Model
            - Facts over transcripts
            - Sources over speculation
            - Quiet citation unless asked

            \(memoryBlock)
            """
        }

        if lowered.contains("code") || lowered.contains("swift") {
            return """
            For \(projectName), keep implementation aligned with the product language.

            ```swift
            struct AdelaiPartner {
                let projectMemory: [String]
                func answer(_ prompt: String) -> String {
                    // Always start from project context
                    prompt
                }
            }
            ```

            \(memoryBlock)
            """
        }

        let recent = history.suffix(2).map(\.content).joined(separator: " ")
        let continuity = recent.isEmpty ? "" : "\n\nContinuing from our recent thread in \(projectName)."

        return """
        Working inside **\(projectName)** with the goal: \(goal).

        \(prompt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            ? "Ask me anything about this project — documents, tasks, files, or decisions."
            : "Here is a focused answer grounded in project context.")

        \(memoryBlock)\(continuity)

        If useful, I can draft a note, propose tasks, or update memory next.
        """
    }
}

@MainActor
final class AdelaiSearchService: SearchServiceProtocol {
    private let store: AppStore

    init(store: AppStore) {
        self.store = store
    }

    func search(query: String) async -> [SearchResult] {
        let q = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !q.isEmpty else { return [] }

        var results: [SearchResult] = []

        for project in store.projects where project.name.lowercased().contains(q) || project.summary.lowercased().contains(q) {
            results.append(SearchResult(id: project.id, title: project.name, subtitle: project.summary, kind: .project, projectName: nil))
        }

        for conversation in store.conversations where conversation.title.lowercased().contains(q) || conversation.preview.lowercased().contains(q) {
            let projectName = store.projects.first { $0.id == conversation.projectID }?.name
            results.append(SearchResult(id: conversation.id, title: conversation.title, subtitle: conversation.preview, kind: .conversation, projectName: projectName))
        }

        for document in store.documents where document.title.lowercased().contains(q) || document.content.lowercased().contains(q) {
            let projectName = store.projects.first { $0.id == document.projectID }?.name
            results.append(SearchResult(id: document.id, title: document.title, subtitle: String(document.content.prefix(80)), kind: .document, projectName: projectName))
        }

        for note in store.notes where note.title.lowercased().contains(q) || note.body.lowercased().contains(q) {
            let projectName = store.projects.first { $0.id == note.projectID }?.name
            results.append(SearchResult(id: note.id, title: note.title, subtitle: note.body, kind: .note, projectName: projectName))
        }

        for task in store.tasks where task.title.lowercased().contains(q) || task.details.lowercased().contains(q) {
            let projectName = store.projects.first { $0.id == task.projectID }?.name
            results.append(SearchResult(id: task.id, title: task.title, subtitle: task.status.title, kind: .task, projectName: projectName))
        }

        for item in store.knowledge where item.title.lowercased().contains(q) || item.content.lowercased().contains(q) {
            let projectName = store.projects.first { $0.id == item.projectID }?.name
            results.append(SearchResult(id: item.id, title: item.title, subtitle: item.content, kind: .knowledge, projectName: projectName))
        }

        return Array(results.prefix(40))
    }
}

@MainActor
final class AdelaiSyncService: SyncServiceProtocol {
    private let store: AppStore

    init(store: AppStore) {
        self.store = store
    }

    var isOnline: Bool { store.isOnline }

    func sync() async throws {
        store.isOnline = true
        try await Task.sleep(nanoseconds: 350_000_000)
    }
}

@MainActor
final class AdelaiSubscriptionService: SubscriptionServiceProtocol {
    private let store: AppStore

    init(store: AppStore) {
        self.store = store
    }

    var currentPlan: SubscriptionPlan { store.profile.plan }

    func upgrade(to plan: SubscriptionPlan) async {
        store.setPlan(plan)
    }
}
