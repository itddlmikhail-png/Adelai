import Foundation

@MainActor
final class AppStore: ObservableObject {
    @Published var projects: [Project] = []
    @Published var documents: [ProjectDocument] = []
    @Published var notes: [ProjectNote] = []
    @Published var tasks: [ProjectTask] = []
    @Published var files: [ProjectFile] = []
    @Published var timeline: [TimelineEvent] = []
    @Published var knowledge: [KnowledgeItem] = []
    @Published var memory: [MemoryFact] = []
    @Published var conversations: [AIConversation] = []
    @Published var profile: UserProfile
    @Published var hasCompletedOnboarding: Bool
    @Published var isOnline: Bool = true

    private let defaults = UserDefaults.standard
    private let onboardingKey = "adelai.hasCompletedOnboarding"
    private let planKey = "adelai.subscriptionPlan"

    init(seed: Bool = true) {
        let planRaw = defaults.string(forKey: planKey) ?? SubscriptionPlan.free.rawValue
        let plan = SubscriptionPlan(rawValue: planRaw) ?? .free
        self.profile = UserProfile(
            name: "Mikhail",
            email: "itddlmikhail@gmail.com",
            plan: plan,
            createdAt: Date().addingTimeInterval(-86400 * 12)
        )
        self.hasCompletedOnboarding = defaults.bool(forKey: onboardingKey)

        if seed {
            SeedData.populate(into: self)
        }
    }

    func completeOnboarding() {
        hasCompletedOnboarding = true
        defaults.set(true, forKey: onboardingKey)
    }

    func setPlan(_ plan: SubscriptionPlan) {
        profile.plan = plan
        defaults.set(plan.rawValue, forKey: planKey)
    }

    func refreshProjectAggregates(for projectID: UUID) {
        guard let index = projects.firstIndex(where: { $0.id == projectID }) else { return }
        projects[index].documentCount = documents.filter { $0.projectID == projectID }.count
        projects[index].noteCount = notes.filter { $0.projectID == projectID }.count
        projects[index].taskCount = tasks.filter { $0.projectID == projectID }.count
        projects[index].openTaskCount = tasks.filter { $0.projectID == projectID && $0.status != .done }.count
        projects[index].fileCount = files.filter { $0.projectID == projectID }.count
        projects[index].updatedAt = Date()
    }
}
