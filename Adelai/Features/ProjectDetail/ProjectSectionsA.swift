import SwiftUI

struct ProjectAIView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore
    @State private var activeConversation: AIConversation?
    @State private var startNew = false

    private var conversations: [AIConversation] {
        store.conversations
            .filter { $0.projectID == projectID }
            .sorted { $0.updatedAt > $1.updatedAt }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                AdelaiButton(title: "Talk to project AI", icon: "sparkles") {
                    startNew = true
                }

                if conversations.isEmpty {
                    AdelaiEmptyState(
                        icon: "sparkles",
                        title: "No project sessions",
                        message: "Ask anything. Adelai already knows this project's memory."
                    )
                } else {
                    ForEach(conversations) { conversation in
                        Button { activeConversation = conversation } label: {
                            AdelaiCard {
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(conversation.title)
                                        .font(AdelaiFont.body(.semibold))
                                        .foregroundStyle(AdelaiColor.primaryText)
                                    Text(conversation.preview)
                                        .font(AdelaiFont.caption())
                                        .foregroundStyle(AdelaiColor.secondaryText)
                                        .lineLimit(2)
                                }
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
        .sheet(item: $activeConversation) { conversation in
            NavigationStack {
                AIConversationView(conversationID: conversation.id, projectID: projectID)
            }
        }
        .sheet(isPresented: $startNew) {
            NavigationStack {
                AIConversationView(conversationID: nil, projectID: projectID)
            }
        }
    }
}

struct ProjectDocumentsView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @State private var selected: ProjectDocument?
    @State private var showEditor = false

    private var documents: [ProjectDocument] {
        store.documents.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                AdelaiButton(title: "New Document", icon: "plus", style: .secondary) {
                    let doc = ProjectDocument(
                        id: UUID(),
                        projectID: projectID,
                        title: "Untitled",
                        content: "# Untitled\n\n",
                        updatedAt: Date(),
                        isPinned: false
                    )
                    Task {
                        await dependencies.documents.saveDocument(doc)
                        selected = doc
                        showEditor = true
                    }
                }

                if documents.isEmpty {
                    AdelaiEmptyState(icon: "doc.text", title: "No documents", message: "Write specs, briefs, and living project docs.")
                } else {
                    ForEach(documents) { document in
                        AdelaiPressableCard {
                            selected = document
                            showEditor = true
                        } content: {
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Text(document.title)
                                        .font(AdelaiFont.body(.semibold))
                                        .foregroundStyle(AdelaiColor.primaryText)
                                    Spacer()
                                    if document.isPinned {
                                        Image(systemName: "pin.fill")
                                            .font(.system(size: 10))
                                            .foregroundStyle(AdelaiColor.tertiaryText)
                                    }
                                }
                                Text(RelativeTimeFormatter.string(from: document.updatedAt))
                                    .font(AdelaiFont.caption())
                                    .foregroundStyle(AdelaiColor.secondaryText)
                            }
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showEditor) {
            if let selected {
                DocumentEditorView(document: selected)
            }
        }
    }
}

struct DocumentEditorView: View {
    @State var document: ProjectDocument
    @Environment(\.dependencies) private var dependencies
    @Environment(\.dismiss) private var dismiss
    @State private var mode: Mode = .edit

    enum Mode { case edit, preview }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Picker("Mode", selection: $mode) {
                    Text("Edit").tag(Mode.edit)
                    Text("Preview").tag(Mode.preview)
                }
                .pickerStyle(.segmented)
                .padding(AdelaiSpacing.screenHorizontal)
                .padding(.vertical, AdelaiSpacing.sm)

                if mode == .edit {
                    TextField("Title", text: $document.title)
                        .font(AdelaiFont.headline())
                        .foregroundStyle(AdelaiColor.primaryText)
                        .padding(.horizontal, AdelaiSpacing.screenHorizontal)
                    TextEditor(text: $document.content)
                        .font(AdelaiFont.body())
                        .scrollContentBackground(.hidden)
                        .foregroundStyle(AdelaiColor.primaryText)
                        .padding(.horizontal, AdelaiSpacing.sm)
                } else {
                    ScrollView {
                        AdelaiMarkdownView(markdown: document.content)
                            .padding(AdelaiSpacing.screenHorizontal)
                    }
                }
            }
            .background(AdelaiColor.primaryBackground.ignoresSafeArea())
            .navigationTitle("Document")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        Task {
                            document.updatedAt = Date()
                            await dependencies.documents.saveDocument(document)
                            dismiss()
                        }
                    }
                    .fontWeight(.semibold)
                }
            }
            .adelaiNavigationChrome()
        }
    }
}

struct ProjectNotesView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @State private var draftTitle = ""
    @State private var draftBody = ""
    @State private var showComposer = false

    private var notes: [ProjectNote] {
        store.notes.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                AdelaiButton(title: "New Note", icon: "plus", style: .secondary) {
                    showComposer = true
                }

                ForEach(notes) { note in
                    AdelaiCard {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(note.title)
                                .font(AdelaiFont.body(.semibold))
                                .foregroundStyle(AdelaiColor.primaryText)
                            Text(note.body)
                                .font(AdelaiFont.caption())
                                .foregroundStyle(AdelaiColor.secondaryText)
                                .lineLimit(3)
                            if !note.tags.isEmpty {
                                HStack {
                                    ForEach(note.tags, id: \.self) { tag in
                                        AdelaiBadge(text: tag)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showComposer) {
            NavigationStack {
                VStack(spacing: AdelaiSpacing.md) {
                    AdelaiTextField(placeholder: "Title", text: $draftTitle)
                    AdelaiTextField(placeholder: "Write a note…", text: $draftBody, axis: .vertical)
                    Spacer()
                }
                .padding(AdelaiSpacing.screenHorizontal)
                .background(AdelaiColor.primaryBackground.ignoresSafeArea())
                .navigationTitle("New Note")
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") { showComposer = false }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Save") {
                            Task {
                                let note = ProjectNote(
                                    id: UUID(),
                                    projectID: projectID,
                                    title: draftTitle.isEmpty ? "Untitled note" : draftTitle,
                                    body: draftBody,
                                    updatedAt: Date(),
                                    tags: []
                                )
                                await dependencies.notes.saveNote(note)
                                draftTitle = ""
                                draftBody = ""
                                showComposer = false
                            }
                        }
                    }
                }
            }
            .presentationDetents([.medium])
        }
    }
}
