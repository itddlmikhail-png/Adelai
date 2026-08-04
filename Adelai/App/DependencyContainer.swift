import Foundation
import SwiftUI

@MainActor
final class DependencyContainer: ObservableObject {
    let store: AppStore
    let projects: ProjectRepositoryProtocol
    let documents: DocumentRepositoryProtocol
    let notes: NoteRepositoryProtocol
    let tasks: TaskRepositoryProtocol
    let files: FileRepositoryProtocol
    let timeline: TimelineRepositoryProtocol
    let knowledge: KnowledgeRepositoryProtocol
    let memory: MemoryRepositoryProtocol
    let conversations: ConversationRepositoryProtocol
    let ai: AIServiceProtocol
    let search: SearchServiceProtocol
    let sync: SyncServiceProtocol
    let subscription: SubscriptionServiceProtocol

    init(store: AppStore = AppStore()) {
        self.store = store
        self.projects = ProjectRepository(store: store)
        self.documents = DocumentRepository(store: store)
        self.notes = NoteRepository(store: store)
        self.tasks = TaskRepository(store: store)
        self.files = FileRepository(store: store)
        self.timeline = TimelineRepository(store: store)
        self.knowledge = KnowledgeRepository(store: store)
        self.memory = MemoryRepository(store: store)
        self.conversations = ConversationRepository(store: store)
        self.ai = AdelaiAIService()
        self.search = AdelaiSearchService(store: store)
        self.sync = AdelaiSyncService(store: store)
        self.subscription = AdelaiSubscriptionService(store: store)
    }
}

private struct DependencyContainerKey: EnvironmentKey {
    static let defaultValue: DependencyContainer? = nil
}

extension EnvironmentValues {
    var dependencies: DependencyContainer {
        get {
            if let value = self[DependencyContainerKey.self] {
                return value
            }
            return MainActor.assumeIsolated { DependencyContainer() }
        }
        set { self[DependencyContainerKey.self] = newValue }
    }
}
