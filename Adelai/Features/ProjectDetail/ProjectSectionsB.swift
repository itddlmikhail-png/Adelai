import SwiftUI

struct ProjectTasksView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @State private var showComposer = false
    @State private var title = ""

    private var tasks: [ProjectTask] {
        store.tasks.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                AdelaiButton(title: "Add Task", icon: "plus", style: .secondary) {
                    showComposer = true
                }

                ForEach(TaskStatus.allCases, id: \.self) { status in
                    let group = tasks.filter { $0.status == status }
                    if !group.isEmpty {
                        VStack(alignment: .leading, spacing: AdelaiSpacing.xs) {
                            Text(status.title)
                                .font(AdelaiFont.caption(.semibold))
                                .foregroundStyle(AdelaiColor.secondaryText)
                                .padding(.top, AdelaiSpacing.sm)

                            ForEach(group) { task in
                                AdelaiCard {
                                    HStack(alignment: .top, spacing: AdelaiSpacing.md) {
                                        Button {
                                            cycle(task)
                                        } label: {
                                            Image(systemName: task.status == .done ? "checkmark.circle.fill" : "circle")
                                                .foregroundStyle(task.status == .done ? AdelaiColor.success : AdelaiColor.secondaryText)
                                        }
                                        .buttonStyle(.plain)

                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(task.title)
                                                .font(AdelaiFont.body(.medium))
                                                .foregroundStyle(AdelaiColor.primaryText)
                                                .strikethrough(task.status == .done)
                                            Text(task.details)
                                                .font(AdelaiFont.caption())
                                                .foregroundStyle(AdelaiColor.secondaryText)
                                        }
                                    }
                                }
                                .contextMenu {
                                    Button(role: .destructive) {
                                        Task { await dependencies.tasks.deleteTask(id: task.id) }
                                    } label: {
                                        AdelaiContextMenuLabel(title: "Delete", systemImage: "trash")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .alert("New Task", isPresented: $showComposer) {
            TextField("Task title", text: $title)
            Button("Cancel", role: .cancel) { title = "" }
            Button("Add") {
                Task {
                    let task = ProjectTask(
                        id: UUID(),
                        projectID: projectID,
                        title: title,
                        details: "",
                        status: .todo,
                        dueDate: nil,
                        updatedAt: Date()
                    )
                    await dependencies.tasks.saveTask(task)
                    title = ""
                }
            }
        }
    }

    private func cycle(_ task: ProjectTask) {
        Task {
            var updated = task
            switch updated.status {
            case .todo: updated.status = .inProgress
            case .inProgress: updated.status = .done
            case .done: updated.status = .todo
            }
            updated.updatedAt = Date()
            await dependencies.tasks.saveTask(updated)
        }
    }
}

struct ProjectFilesView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies

    private var files: [ProjectFile] {
        store.files.filter { $0.projectID == projectID }.sorted { $0.uploadedAt > $1.uploadedAt }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                AdelaiButton(title: "Upload File", icon: "arrow.up.doc", style: .secondary) {
                    Task {
                        let file = ProjectFile(
                            id: UUID(),
                            projectID: projectID,
                            name: "upload-\(Int(Date().timeIntervalSince1970)).pdf",
                            kind: .pdf,
                            sizeLabel: "240 KB",
                            uploadedAt: Date()
                        )
                        await dependencies.files.saveFile(file)
                        await dependencies.timeline.appendEvent(
                            TimelineEvent(
                                id: UUID(),
                                projectID: projectID,
                                title: "File uploaded",
                                detail: file.name,
                                timestamp: Date(),
                                kind: .file
                            )
                        )
                    }
                }

                if files.isEmpty {
                    AdelaiEmptyState(icon: "folder", title: "No files", message: "Upload PDFs, images, code, and audio into project context.")
                } else {
                    ForEach(files) { file in
                        AdelaiCard {
                            AdelaiListRow(
                                title: file.name,
                                subtitle: "\(file.sizeLabel) · \(RelativeTimeFormatter.string(from: file.uploadedAt))",
                                icon: file.kind.systemImage,
                                showChevron: false
                            )
                            .padding(.vertical, -AdelaiSpacing.sm)
                        }
                    }
                }
            }
        }
    }
}

struct ProjectTimelineView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore

    private var events: [TimelineEvent] {
        store.timeline.filter { $0.projectID == projectID }.sorted { $0.timestamp > $1.timestamp }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                if events.isEmpty {
                    AdelaiEmptyState(icon: "clock", title: "No activity", message: "Project history will appear as you work.")
                } else {
                    ForEach(events) { event in
                        HStack(alignment: .top, spacing: AdelaiSpacing.md) {
                            ZStack {
                                Circle()
                                    .fill(AdelaiColor.card)
                                    .frame(width: 36, height: 36)
                                Image(systemName: event.kind.systemImage)
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundStyle(AdelaiColor.primaryText)
                            }
                            VStack(alignment: .leading, spacing: 4) {
                                Text(event.title)
                                    .font(AdelaiFont.body(.medium))
                                    .foregroundStyle(AdelaiColor.primaryText)
                                Text(event.detail)
                                    .font(AdelaiFont.caption())
                                    .foregroundStyle(AdelaiColor.secondaryText)
                                Text(RelativeTimeFormatter.string(from: event.timestamp))
                                    .font(AdelaiFont.micro())
                                    .foregroundStyle(AdelaiColor.tertiaryText)
                            }
                            Spacer(minLength: 0)
                        }
                        .padding(.vertical, AdelaiSpacing.xs)
                    }
                }
            }
        }
    }
}

struct ProjectKnowledgeView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore

    private var items: [KnowledgeItem] {
        store.knowledge.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                if items.isEmpty {
                    AdelaiEmptyState(icon: "books.vertical", title: "No knowledge yet", message: "Synthesize documents and notes into durable knowledge.")
                } else {
                    ForEach(items) { item in
                        AdelaiCard {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(item.title)
                                    .font(AdelaiFont.body(.semibold))
                                    .foregroundStyle(AdelaiColor.primaryText)
                                Text(item.content)
                                    .font(AdelaiFont.callout())
                                    .foregroundStyle(AdelaiColor.secondaryText)
                                Text("Source · \(item.source)")
                                    .font(AdelaiFont.micro(.medium))
                                    .foregroundStyle(AdelaiColor.tertiaryText)
                            }
                        }
                    }
                }
            }
        }
    }
}

struct ProjectMemoryView: View {
    let projectID: UUID
    @EnvironmentObject private var store: AppStore
    @Environment(\.dependencies) private var dependencies
    @State private var showAdd = false
    @State private var title = ""
    @State private var detail = ""

    private var facts: [MemoryFact] {
        store.memory.filter { $0.projectID == projectID }.sorted { $0.updatedAt > $1.updatedAt }
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                AdelaiCard {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Project AI Memory")
                            .font(AdelaiFont.headline())
                            .foregroundStyle(AdelaiColor.primaryText)
                        Text("Durable facts the AI uses before every answer. Quiet, source-backed, project-owned.")
                            .font(AdelaiFont.callout())
                            .foregroundStyle(AdelaiColor.secondaryText)
                    }
                }

                AdelaiButton(title: "Add Memory Fact", icon: "plus", style: .secondary) {
                    showAdd = true
                }

                ForEach(facts) { fact in
                    AdelaiCard {
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text(fact.title)
                                    .font(AdelaiFont.body(.semibold))
                                    .foregroundStyle(AdelaiColor.primaryText)
                                Spacer()
                                Text("\(Int(fact.confidence * 100))%")
                                    .font(AdelaiFont.micro(.semibold))
                                    .foregroundStyle(AdelaiColor.tertiaryText)
                            }
                            Text(fact.detail)
                                .font(AdelaiFont.callout())
                                .foregroundStyle(AdelaiColor.secondaryText)
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showAdd) {
            NavigationStack {
                VStack(spacing: AdelaiSpacing.md) {
                    AdelaiTextField(placeholder: "Fact title", text: $title)
                    AdelaiTextField(placeholder: "Detail", text: $detail, axis: .vertical)
                    Spacer()
                }
                .padding(AdelaiSpacing.screenHorizontal)
                .background(AdelaiColor.primaryBackground.ignoresSafeArea())
                .navigationTitle("New Memory")
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") { showAdd = false }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Save") {
                            Task {
                                let fact = MemoryFact(
                                    id: UUID(),
                                    projectID: projectID,
                                    title: title,
                                    detail: detail,
                                    confidence: 0.9,
                                    updatedAt: Date()
                                )
                                await dependencies.memory.saveFact(fact)
                                title = ""
                                detail = ""
                                showAdd = false
                            }
                        }
                    }
                }
            }
            .presentationDetents([.medium])
        }
    }
}

struct ProjectSettingsView: View {
    let project: Project
    @Environment(\.dependencies) private var dependencies
    @State private var name: String
    @State private var goal: String
    @State private var summary: String
    @State private var didSave = false

    init(project: Project) {
        self.project = project
        _name = State(initialValue: project.name)
        _goal = State(initialValue: project.goal)
        _summary = State(initialValue: project.summary)
    }

    var body: some View {
        AdelaiScreen {
            VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                    fieldLabel("Name")
                    AdelaiTextField(placeholder: "Project name", text: $name)
                    fieldLabel("Goal")
                    AdelaiTextField(placeholder: "Goal", text: $goal, axis: .vertical)
                    fieldLabel("Summary")
                    AdelaiTextField(placeholder: "Summary", text: $summary, axis: .vertical)
                }

                AdelaiButton(title: didSave ? "Saved" : "Save Changes", icon: "checkmark") {
                    Task {
                        var updated = project
                        updated.name = name
                        updated.goal = goal
                        updated.summary = summary
                        updated.updatedAt = Date()
                        await dependencies.projects.updateProject(updated)
                        withAnimation(AdelaiAnimation.quick) { didSave = true }
                    }
                }

                AdelaiButton(title: project.isPinned ? "Unpin Project" : "Pin Project", style: .secondary) {
                    Task { await dependencies.projects.togglePin(id: project.id) }
                }

                AdelaiButton(title: "Delete Project", style: .danger) {
                    Task { await dependencies.projects.deleteProject(id: project.id) }
                }
            }
        }
    }

    private func fieldLabel(_ text: String) -> some View {
        Text(text)
            .font(AdelaiFont.caption(.medium))
            .foregroundStyle(AdelaiColor.secondaryText)
    }
}
