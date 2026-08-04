import SwiftUI

struct AIConversationView: View {
    let conversationID: UUID?
    let projectID: UUID?

    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @Environment(\.dismiss) private var dismiss

    @State private var conversation: AIConversation?
    @State private var input = ""
    @State private var isGenerating = false
    @State private var selectedProjectID: UUID?
    @FocusState private var inputFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            messageList
            composer
        }
        .background(AdelaiColor.primaryBackground.ignoresSafeArea())
        .navigationTitle(navigationTitle)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("Close") { dismiss() }
                    .foregroundStyle(AdelaiColor.secondaryText)
            }
            ToolbarItem(placement: .topBarTrailing) {
                if conversation?.isPinned == true {
                    Image(systemName: "pin.fill")
                        .foregroundStyle(AdelaiColor.tertiaryText)
                }
            }
        }
        .adelaiNavigationChrome()
        .task { await load() }
    }

    private var navigationTitle: String {
        conversation?.title ?? "New Session"
    }

    private var activeProject: Project? {
        let id = conversation?.projectID ?? selectedProjectID ?? projectID
        return store.projects.first { $0.id == id }
    }

    private var messageList: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(alignment: .leading, spacing: AdelaiSpacing.md) {
                    contextBanner

                    if let messages = conversation?.messages, !messages.isEmpty {
                        ForEach(messages) { message in
                            MessageBubble(message: message)
                                .id(message.id)
                        }
                    } else {
                        AdelaiEmptyState(
                            icon: "sparkles",
                            title: "Project partner ready",
                            message: activeProject == nil
                                ? "Ask anything. Attach a project for grounded answers."
                                : "Adelai already knows \(activeProject!.name)."
                        )
                        .padding(.top, AdelaiSpacing.xxl)
                    }

                    if isGenerating {
                        HStack(spacing: AdelaiSpacing.xs) {
                            ProgressView().tint(AdelaiColor.secondaryText)
                            Text("Thinking with project memory…")
                                .font(AdelaiFont.caption())
                                .foregroundStyle(AdelaiColor.secondaryText)
                        }
                        .id("typing")
                    }
                }
                .padding(.horizontal, AdelaiSpacing.screenHorizontal)
                .padding(.vertical, AdelaiSpacing.md)
                .padding(.bottom, AdelaiSpacing.lg)
            }
            .onChange(of: conversation?.messages.count) { _, _ in
                if let last = conversation?.messages.last?.id {
                    withAnimation(AdelaiAnimation.quick) {
                        proxy.scrollTo(last, anchor: .bottom)
                    }
                }
            }
        }
    }

    private var contextBanner: some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            if let project = activeProject {
                AdelaiCard(padding: AdelaiSpacing.md) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(project.name)
                            .font(AdelaiFont.callout(.semibold))
                            .foregroundStyle(AdelaiColor.primaryText)
                        Text(project.memorySummary)
                            .font(AdelaiFont.caption())
                            .foregroundStyle(AdelaiColor.secondaryText)
                    }
                }
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: AdelaiSpacing.xs) {
                        ForEach(store.projects.prefix(6)) { project in
                            Button {
                                selectedProjectID = project.id
                            } label: {
                                Text(project.name)
                                    .font(AdelaiFont.caption(.medium))
                                    .foregroundStyle(AdelaiColor.primaryText)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                    .background(AdelaiColor.card)
                                    .clipShape(Capsule(style: .continuous))
                                    .overlay(
                                        Capsule(style: .continuous)
                                            .strokeBorder(AdelaiColor.border, lineWidth: 1)
                                    )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
        }
    }

    private var composer: some View {
        VStack(spacing: AdelaiSpacing.sm) {
            AdelaiDivider()
            HStack(alignment: .bottom, spacing: AdelaiSpacing.sm) {
                Button {
                    // Voice input affordance — ready for Speech framework wiring
                } label: {
                    Image(systemName: "mic")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(AdelaiColor.secondaryText)
                        .frame(width: 40, height: 40)
                        .background(AdelaiColor.card)
                        .clipShape(Circle())
                        .overlay(Circle().strokeBorder(AdelaiColor.border, lineWidth: 1))
                }
                .buttonStyle(.plain)

                TextField("Ask your project partner…", text: $input, axis: .vertical)
                    .lineLimit(1...5)
                    .font(AdelaiFont.body())
                    .foregroundStyle(AdelaiColor.primaryText)
                    .padding(.horizontal, AdelaiSpacing.md)
                    .padding(.vertical, AdelaiSpacing.sm)
                    .background(AdelaiColor.inputFill)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .strokeBorder(AdelaiColor.border, lineWidth: 1)
                    )
                    .focused($inputFocused)

                Button {
                    Task { await send() }
                } label: {
                    Image(systemName: "arrow.up")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundStyle(AdelaiColor.primaryBackground)
                        .frame(width: 40, height: 40)
                        .background(canSend ? AdelaiColor.accent : AdelaiColor.tertiaryText)
                        .clipShape(Circle())
                }
                .buttonStyle(.plain)
                .disabled(!canSend)
            }
            .padding(.horizontal, AdelaiSpacing.screenHorizontal)
            .padding(.bottom, AdelaiSpacing.md)
        }
        .background(AdelaiColor.secondaryBackground)
    }

    private var canSend: Bool {
        !input.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isGenerating
    }

    private func load() async {
        if let conversationID,
           let existing = await dependencies.conversations.fetchConversation(id: conversationID) {
            conversation = existing
            selectedProjectID = existing.projectID
        } else {
            selectedProjectID = projectID
            conversation = AIConversation(
                id: UUID(),
                projectID: projectID,
                title: "New Session",
                preview: "",
                updatedAt: Date(),
                isPinned: false,
                messages: []
            )
        }
    }

    private func send() async {
        let prompt = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !prompt.isEmpty else { return }
        input = ""
        isGenerating = true

        var current = conversation ?? AIConversation(
            id: UUID(),
            projectID: selectedProjectID ?? projectID,
            title: String(prompt.prefix(42)),
            preview: "",
            updatedAt: Date(),
            isPinned: false,
            messages: []
        )

        if current.messages.isEmpty {
            current.title = String(prompt.prefix(42))
        }
        current.projectID = selectedProjectID ?? current.projectID ?? projectID

        let userMessage = AIMessage(id: UUID(), role: .user, content: prompt, createdAt: Date())
        current.messages.append(userMessage)
        conversation = current

        let project = activeProject
        let memory = project.map { p in store.memory.filter { $0.projectID == p.id } } ?? []
        let reply = await dependencies.ai.respond(
            prompt: prompt,
            project: project,
            memory: memory,
            history: current.messages
        )

        let assistant = AIMessage(id: UUID(), role: .assistant, content: reply, createdAt: Date())
        current.messages.append(assistant)
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

private struct MessageBubble: View {
    let message: AIMessage

    var body: some View {
        HStack {
            if message.role == .user { Spacer(minLength: 48) }

            VStack(alignment: .leading, spacing: AdelaiSpacing.xs) {
                if message.role == .assistant {
                    AdelaiMarkdownView(markdown: message.content)
                } else {
                    Text(message.content)
                        .font(AdelaiFont.body())
                        .foregroundStyle(AdelaiColor.primaryText)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .padding(AdelaiSpacing.md)
            .background(message.role == .user ? AdelaiColor.card : AdelaiColor.secondaryBackground)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .strokeBorder(AdelaiColor.border, lineWidth: 1)
            )

            if message.role == .assistant { Spacer(minLength: 48) }
        }
    }
}
