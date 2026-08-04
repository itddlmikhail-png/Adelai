import SwiftUI

struct AIHubView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @State private var selectedConversation: AIConversation?
    @State private var showNewChat = false

    private var conversations: [AIConversation] {
        store.conversations.sorted { lhs, rhs in
            if lhs.isPinned != rhs.isPinned { return lhs.isPinned && !rhs.isPinned }
            return lhs.updatedAt > rhs.updatedAt
        }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("AI")
                        .font(AdelaiFont.largeTitle(.bold))
                        .foregroundStyle(AdelaiColor.primaryText)
                    Text("A partner that thinks with your projects")
                        .font(AdelaiFont.callout())
                        .foregroundStyle(AdelaiColor.secondaryText)
                }
                .padding(.top, AdelaiSpacing.sm)

                AdelaiButton(title: "Start a session", icon: "sparkles") {
                    showNewChat = true
                }

                VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                    AdelaiSectionHeader(title: "Sessions")
                    if conversations.isEmpty {
                        AdelaiEmptyState(
                            icon: "sparkles",
                            title: "No sessions yet",
                            message: "Start a conversation grounded in project memory."
                        )
                    } else {
                        ForEach(conversations) { conversation in
                            Button {
                                selectedConversation = conversation
                            } label: {
                                AdelaiCard {
                                    VStack(alignment: .leading, spacing: 8) {
                                        HStack {
                                            Text(conversation.title)
                                                .font(AdelaiFont.body(.semibold))
                                                .foregroundStyle(AdelaiColor.primaryText)
                                                .lineLimit(1)
                                            Spacer()
                                            if conversation.isPinned {
                                                AdelaiBadge(text: "Pinned", tone: .accent)
                                            }
                                        }
                                        Text(conversation.preview)
                                            .font(AdelaiFont.caption())
                                            .foregroundStyle(AdelaiColor.secondaryText)
                                            .lineLimit(2)
                                        HStack {
                                            Text(projectLabel(for: conversation))
                                                .font(AdelaiFont.micro(.medium))
                                                .foregroundStyle(AdelaiColor.tertiaryText)
                                            Spacer()
                                            Text(RelativeTimeFormatter.string(from: conversation.updatedAt))
                                                .font(AdelaiFont.micro())
                                                .foregroundStyle(AdelaiColor.tertiaryText)
                                        }
                                    }
                                }
                            }
                            .buttonStyle(.plain)
                            .contextMenu {
                                Button {
                                    Task {
                                        var updated = conversation
                                        updated.isPinned.toggle()
                                        await dependencies.conversations.saveConversation(updated)
                                    }
                                } label: {
                                    AdelaiContextMenuLabel(
                                        title: conversation.isPinned ? "Unpin" : "Pin",
                                        systemImage: conversation.isPinned ? "pin.slash" : "pin"
                                    )
                                }
                                Button(role: .destructive) {
                                    Task { await dependencies.conversations.deleteConversation(id: conversation.id) }
                                } label: {
                                    AdelaiContextMenuLabel(title: "Delete", systemImage: "trash")
                                }
                            }
                        }
                    }
                }
            }
        }
        .navigationBarHidden(true)
        .sheet(item: $selectedConversation) { conversation in
            NavigationStack {
                AIConversationView(conversationID: conversation.id, projectID: conversation.projectID)
            }
        }
        .sheet(isPresented: $showNewChat) {
            NavigationStack {
                AIConversationView(conversationID: nil, projectID: nil)
            }
        }
    }

    private func projectLabel(for conversation: AIConversation) -> String {
        if let projectID = conversation.projectID,
           let project = store.projects.first(where: { $0.id == projectID }) {
            return project.name
        }
        return "Global"
    }
}
