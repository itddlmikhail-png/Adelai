import Foundation
import SwiftData

/// SwiftData persistence schema for offline-first storage.
/// The runtime currently uses AppStore for a polished seed experience;
/// these models are the durable CloudKit-ready persistence layer.

@Model
final class SDProject {
    @Attribute(.unique) var id: UUID
    var name: String
    var summary: String
    var icon: String
    var isPinned: Bool
    var createdAt: Date
    var updatedAt: Date
    var lastOpenedAt: Date
    var goal: String
    var templateID: String?
    var memorySummary: String

    init(from project: Project) {
        self.id = project.id
        self.name = project.name
        self.summary = project.summary
        self.icon = project.icon
        self.isPinned = project.isPinned
        self.createdAt = project.createdAt
        self.updatedAt = project.updatedAt
        self.lastOpenedAt = project.lastOpenedAt
        self.goal = project.goal
        self.templateID = project.templateID
        self.memorySummary = project.memorySummary
    }
}

@Model
final class SDConversation {
    @Attribute(.unique) var id: UUID
    var projectID: UUID?
    var title: String
    var preview: String
    var updatedAt: Date
    var isPinned: Bool
    var messagesJSON: Data

    init(from conversation: AIConversation) {
        self.id = conversation.id
        self.projectID = conversation.projectID
        self.title = conversation.title
        self.preview = conversation.preview
        self.updatedAt = conversation.updatedAt
        self.isPinned = conversation.isPinned
        self.messagesJSON = (try? JSONEncoder().encode(conversation.messages)) ?? Data()
    }
}

@Model
final class SDMemoryFact {
    @Attribute(.unique) var id: UUID
    var projectID: UUID
    var title: String
    var detail: String
    var confidence: Double
    var updatedAt: Date

    init(from fact: MemoryFact) {
        self.id = fact.id
        self.projectID = fact.projectID
        self.title = fact.title
        self.detail = fact.detail
        self.confidence = fact.confidence
        self.updatedAt = fact.updatedAt
    }
}

enum AdelaiModelContainer {
    static func make(inMemory: Bool = false) throws -> ModelContainer {
        let schema = Schema([SDProject.self, SDConversation.self, SDMemoryFact.self])
        let configuration = ModelConfiguration(
            isStoredInMemoryOnly: inMemory,
            cloudKitDatabase: inMemory ? .none : .automatic
        )
        return try ModelContainer(for: schema, configurations: configuration)
    }
}
