import Foundation

protocol ProjectRepositoryProtocol {
    func fetchProjects() async -> [Project]
    func fetchProject(id: UUID) async -> Project?
    func createProject(_ project: Project) async
    func updateProject(_ project: Project) async
    func deleteProject(id: UUID) async
    func togglePin(id: UUID) async
}

protocol DocumentRepositoryProtocol {
    func fetchDocuments(projectID: UUID) async -> [ProjectDocument]
    func saveDocument(_ document: ProjectDocument) async
    func deleteDocument(id: UUID) async
}

protocol NoteRepositoryProtocol {
    func fetchNotes(projectID: UUID) async -> [ProjectNote]
    func saveNote(_ note: ProjectNote) async
    func deleteNote(id: UUID) async
}

protocol TaskRepositoryProtocol {
    func fetchTasks(projectID: UUID) async -> [ProjectTask]
    func saveTask(_ task: ProjectTask) async
    func deleteTask(id: UUID) async
}

protocol FileRepositoryProtocol {
    func fetchFiles(projectID: UUID) async -> [ProjectFile]
    func saveFile(_ file: ProjectFile) async
    func deleteFile(id: UUID) async
}

protocol TimelineRepositoryProtocol {
    func fetchEvents(projectID: UUID) async -> [TimelineEvent]
    func appendEvent(_ event: TimelineEvent) async
}

protocol KnowledgeRepositoryProtocol {
    func fetchKnowledge(projectID: UUID) async -> [KnowledgeItem]
    func saveItem(_ item: KnowledgeItem) async
}

protocol MemoryRepositoryProtocol {
    func fetchMemory(projectID: UUID) async -> [MemoryFact]
    func saveFact(_ fact: MemoryFact) async
}

protocol ConversationRepositoryProtocol {
    func fetchConversations(projectID: UUID?) async -> [AIConversation]
    func fetchConversation(id: UUID) async -> AIConversation?
    func saveConversation(_ conversation: AIConversation) async
    func deleteConversation(id: UUID) async
}

protocol AIServiceProtocol {
    func respond(
        prompt: String,
        project: Project?,
        memory: [MemoryFact],
        history: [AIMessage]
    ) async -> String
}

protocol SearchServiceProtocol {
    func search(query: String) async -> [SearchResult]
}

protocol SyncServiceProtocol {
    var isOnline: Bool { get }
    func sync() async throws
}

protocol SubscriptionServiceProtocol {
    var currentPlan: SubscriptionPlan { get }
    func upgrade(to plan: SubscriptionPlan) async
}
