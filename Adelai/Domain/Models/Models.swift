import Foundation

struct Project: Identifiable, Hashable, Codable {
    let id: UUID
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
    var documentCount: Int
    var noteCount: Int
    var taskCount: Int
    var fileCount: Int
    var openTaskCount: Int

    var relativeUpdated: String {
        RelativeTimeFormatter.string(from: updatedAt)
    }
}

struct ProjectDocument: Identifiable, Hashable, Codable {
    let id: UUID
    var projectID: UUID
    var title: String
    var content: String
    var updatedAt: Date
    var isPinned: Bool
}

struct ProjectNote: Identifiable, Hashable, Codable {
    let id: UUID
    var projectID: UUID
    var title: String
    var body: String
    var updatedAt: Date
    var tags: [String]
}

enum TaskStatus: String, Codable, CaseIterable, Hashable {
    case todo
    case inProgress
    case done

    var title: String {
        switch self {
        case .todo: return "To Do"
        case .inProgress: return "In Progress"
        case .done: return "Done"
        }
    }
}

struct ProjectTask: Identifiable, Hashable, Codable {
    let id: UUID
    var projectID: UUID
    var title: String
    var details: String
    var status: TaskStatus
    var dueDate: Date?
    var updatedAt: Date
}

struct ProjectFile: Identifiable, Hashable, Codable {
    let id: UUID
    var projectID: UUID
    var name: String
    var kind: FileKind
    var sizeLabel: String
    var uploadedAt: Date
}

enum FileKind: String, Codable, Hashable {
    case pdf, image, code, audio, other

    var systemImage: String {
        switch self {
        case .pdf: return "doc.richtext"
        case .image: return "photo"
        case .code: return "chevron.left.forwardslash.chevron.right"
        case .audio: return "waveform"
        case .other: return "doc"
        }
    }
}

struct TimelineEvent: Identifiable, Hashable, Codable {
    let id: UUID
    var projectID: UUID
    var title: String
    var detail: String
    var timestamp: Date
    var kind: TimelineKind
}

enum TimelineKind: String, Codable, Hashable {
    case ai, document, note, task, file, memory

    var systemImage: String {
        switch self {
        case .ai: return "sparkles"
        case .document: return "doc.text"
        case .note: return "note.text"
        case .task: return "checkmark.circle"
        case .file: return "folder"
        case .memory: return "brain.head.profile"
        }
    }
}

struct KnowledgeItem: Identifiable, Hashable, Codable {
    let id: UUID
    var projectID: UUID
    var title: String
    var content: String
    var source: String
    var updatedAt: Date
}

struct MemoryFact: Identifiable, Hashable, Codable {
    let id: UUID
    var projectID: UUID
    var title: String
    var detail: String
    var confidence: Double
    var updatedAt: Date
}

struct AIConversation: Identifiable, Hashable, Codable {
    let id: UUID
    var projectID: UUID?
    var title: String
    var preview: String
    var updatedAt: Date
    var isPinned: Bool
    var messages: [AIMessage]
}

struct AIMessage: Identifiable, Hashable, Codable {
    let id: UUID
    var role: MessageRole
    var content: String
    var createdAt: Date
}

enum MessageRole: String, Codable, Hashable {
    case user, assistant, system
}

struct ProjectTemplate: Identifiable, Hashable, Codable {
    let id: String
    var name: String
    var summary: String
    var icon: String
    var starterGoal: String
}

enum SubscriptionPlan: String, Codable, CaseIterable, Hashable {
    case free, pro, business

    var title: String {
        switch self {
        case .free: return "Free"
        case .pro: return "Pro"
        case .business: return "Business"
        }
    }

    var priceLabel: String {
        switch self {
        case .free: return "$0"
        case .pro: return "$20"
        case .business: return "$49"
        }
    }

    var periodLabel: String {
        self == .free ? "" : "/month"
    }

    var features: [String] {
        switch self {
        case .free:
            return ["3 Projects", "Limited AI", "Local workspace"]
        case .pro:
            return ["Unlimited Projects", "Unlimited AI", "AI Memory", "Cloud Sync", "Voice Mode", "Priority Models"]
        case .business:
            return ["Unlimited Team Members", "Shared AI Memory", "Workspace Analytics", "Admin Panel", "Everything in Pro"]
        }
    }
}

struct UserProfile: Hashable, Codable {
    var name: String
    var email: String
    var plan: SubscriptionPlan
    var createdAt: Date
}

struct SearchResult: Identifiable, Hashable {
    let id: UUID
    var title: String
    var subtitle: String
    var kind: SearchResultKind
    var projectName: String?
}

enum SearchResultKind: String, Hashable {
    case project, conversation, document, note, task, knowledge

    var systemImage: String {
        switch self {
        case .project: return "square.stack.3d.up"
        case .conversation: return "sparkles"
        case .document: return "doc.text"
        case .note: return "note.text"
        case .task: return "checklist"
        case .knowledge: return "books.vertical"
        }
    }
}

enum RelativeTimeFormatter {
    static func string(from date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

enum Greeting {
    static func current(date: Date = Date()) -> String {
        let hour = Calendar.current.component(.hour, from: date)
        switch hour {
        case 5..<12: return "Good morning"
        case 12..<17: return "Good afternoon"
        case 17..<22: return "Good evening"
        default: return "Good night"
        }
    }
}
