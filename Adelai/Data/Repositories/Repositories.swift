import Foundation

@MainActor
final class ProjectRepository: ProjectRepositoryProtocol {
    private let store: AppStore

    init(store: AppStore) {
        self.store = store
    }

    func fetchProjects() async -> [Project] {
        store.projects.sorted { $0.updatedAt > $1.updatedAt }
    }

    func fetchProject(id: UUID) async -> Project? {
        store.projects.first { $0.id == id }
    }

    func createProject(_ project: Project) async {
        store.projects.insert(project, at: 0)
        store.timeline.insert(
            TimelineEvent(
                id: UUID(),
                projectID: project.id,
                title: "Project created",
                detail: project.name,
                timestamp: Date(),
                kind: .memory
            ),
            at: 0
        )
    }

    func updateProject(_ project: Project) async {
        guard let index = store.projects.firstIndex(where: { $0.id == project.id }) else { return }
        store.projects[index] = project
    }

    func deleteProject(id: UUID) async {
        store.projects.removeAll { $0.id == id }
        store.documents.removeAll { $0.projectID == id }
        store.notes.removeAll { $0.projectID == id }
        store.tasks.removeAll { $0.projectID == id }
        store.files.removeAll { $0.projectID == id }
        store.timeline.removeAll { $0.projectID == id }
        store.knowledge.removeAll { $0.projectID == id }
        store.memory.removeAll { $0.projectID == id }
        store.conversations.removeAll { $0.projectID == id }
    }

    func togglePin(id: UUID) async {
        guard let index = store.projects.firstIndex(where: { $0.id == id }) else { return }
        store.projects[index].isPinned.toggle()
        store.projects[index].updatedAt = Date()
    }
}

@MainActor
final class DocumentRepository: DocumentRepositoryProtocol {
    private let store: AppStore
    init(store: AppStore) { self.store = store }

    func fetchDocuments(projectID: UUID) async -> [ProjectDocument] {
        store.documents.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    func saveDocument(_ document: ProjectDocument) async {
        if let index = store.documents.firstIndex(where: { $0.id == document.id }) {
            store.documents[index] = document
        } else {
            store.documents.insert(document, at: 0)
        }
        store.refreshProjectAggregates(for: document.projectID)
    }

    func deleteDocument(id: UUID) async {
        guard let document = store.documents.first(where: { $0.id == id }) else { return }
        store.documents.removeAll { $0.id == id }
        store.refreshProjectAggregates(for: document.projectID)
    }
}

@MainActor
final class NoteRepository: NoteRepositoryProtocol {
    private let store: AppStore
    init(store: AppStore) { self.store = store }

    func fetchNotes(projectID: UUID) async -> [ProjectNote] {
        store.notes.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    func saveNote(_ note: ProjectNote) async {
        if let index = store.notes.firstIndex(where: { $0.id == note.id }) {
            store.notes[index] = note
        } else {
            store.notes.insert(note, at: 0)
        }
        store.refreshProjectAggregates(for: note.projectID)
    }

    func deleteNote(id: UUID) async {
        guard let note = store.notes.first(where: { $0.id == id }) else { return }
        store.notes.removeAll { $0.id == id }
        store.refreshProjectAggregates(for: note.projectID)
    }
}

@MainActor
final class TaskRepository: TaskRepositoryProtocol {
    private let store: AppStore
    init(store: AppStore) { self.store = store }

    func fetchTasks(projectID: UUID) async -> [ProjectTask] {
        store.tasks.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    func saveTask(_ task: ProjectTask) async {
        if let index = store.tasks.firstIndex(where: { $0.id == task.id }) {
            store.tasks[index] = task
        } else {
            store.tasks.insert(task, at: 0)
        }
        store.refreshProjectAggregates(for: task.projectID)
    }

    func deleteTask(id: UUID) async {
        guard let task = store.tasks.first(where: { $0.id == id }) else { return }
        store.tasks.removeAll { $0.id == id }
        store.refreshProjectAggregates(for: task.projectID)
    }
}

@MainActor
final class FileRepository: FileRepositoryProtocol {
    private let store: AppStore
    init(store: AppStore) { self.store = store }

    func fetchFiles(projectID: UUID) async -> [ProjectFile] {
        store.files.filter { $0.projectID == projectID }.sorted { $0.uploadedAt > $1.uploadedAt }
    }

    func saveFile(_ file: ProjectFile) async {
        store.files.insert(file, at: 0)
        store.refreshProjectAggregates(for: file.projectID)
    }

    func deleteFile(id: UUID) async {
        guard let file = store.files.first(where: { $0.id == id }) else { return }
        store.files.removeAll { $0.id == id }
        store.refreshProjectAggregates(for: file.projectID)
    }
}

@MainActor
final class TimelineRepository: TimelineRepositoryProtocol {
    private let store: AppStore
    init(store: AppStore) { self.store = store }

    func fetchEvents(projectID: UUID) async -> [TimelineEvent] {
        store.timeline.filter { $0.projectID == projectID }.sorted { $0.timestamp > $1.timestamp }
    }

    func appendEvent(_ event: TimelineEvent) async {
        store.timeline.insert(event, at: 0)
    }
}

@MainActor
final class KnowledgeRepository: KnowledgeRepositoryProtocol {
    private let store: AppStore
    init(store: AppStore) { self.store = store }

    func fetchKnowledge(projectID: UUID) async -> [KnowledgeItem] {
        store.knowledge.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    func saveItem(_ item: KnowledgeItem) async {
        if let index = store.knowledge.firstIndex(where: { $0.id == item.id }) {
            store.knowledge[index] = item
        } else {
            store.knowledge.insert(item, at: 0)
        }
    }
}

@MainActor
final class MemoryRepository: MemoryRepositoryProtocol {
    private let store: AppStore
    init(store: AppStore) { self.store = store }

    func fetchMemory(projectID: UUID) async -> [MemoryFact] {
        store.memory.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    func saveFact(_ fact: MemoryFact) async {
        if let index = store.memory.firstIndex(where: { $0.id == fact.id }) {
            store.memory[index] = fact
        } else {
            store.memory.insert(fact, at: 0)
        }
    }
}

@MainActor
final class ConversationRepository: ConversationRepositoryProtocol {
    private let store: AppStore
    init(store: AppStore) { self.store = store }

    func fetchConversations(projectID: UUID?) async -> [AIConversation] {
        let filtered: [AIConversation]
        if let projectID {
            filtered = store.conversations.filter { $0.projectID == projectID }
        } else {
            filtered = store.conversations
        }
        return filtered.sorted { $0.updatedAt > $1.updatedAt }
    }

    func fetchConversation(id: UUID) async -> AIConversation? {
        store.conversations.first { $0.id == id }
    }

    func saveConversation(_ conversation: AIConversation) async {
        if let index = store.conversations.firstIndex(where: { $0.id == conversation.id }) {
            store.conversations[index] = conversation
        } else {
            store.conversations.insert(conversation, at: 0)
        }
    }

    func deleteConversation(id: UUID) async {
        store.conversations.removeAll { $0.id == id }
    }
}
