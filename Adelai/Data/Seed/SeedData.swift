import Foundation

enum SeedData {
    static func populate(into store: AppStore) {
        let now = Date()
        let atlasID = UUID(uuidString: "A1111111-1111-1111-1111-111111111111")!
        let novaID = UUID(uuidString: "A2222222-2222-2222-2222-222222222222")!
        let folioID = UUID(uuidString: "A3333333-3333-3333-3333-333333333333")!
        let lumenID = UUID(uuidString: "A4444444-4444-4444-4444-444444444444")!

        store.projects = [
            Project(
                id: atlasID,
                name: "Atlas Redesign",
                summary: "Rebuild the product narrative and shipping system for Atlas.",
                icon: "square.stack.3d.up",
                isPinned: true,
                createdAt: now.addingTimeInterval(-86400 * 18),
                updatedAt: now.addingTimeInterval(-3600 * 2),
                lastOpenedAt: now.addingTimeInterval(-1800),
                goal: "Ship a calmer, sharper Atlas experience with AI-native workflows.",
                templateID: "product",
                memorySummary: "Focuses on clarity, reduced chrome, and a project-first AI partner.",
                documentCount: 3,
                noteCount: 2,
                taskCount: 4,
                fileCount: 3,
                openTaskCount: 3
            ),
            Project(
                id: novaID,
                name: "Nova Launch",
                summary: "Coordinate messaging, demos, and launch-week execution.",
                icon: "rocket",
                isPinned: true,
                createdAt: now.addingTimeInterval(-86400 * 9),
                updatedAt: now.addingTimeInterval(-3600 * 5),
                lastOpenedAt: now.addingTimeInterval(-7200),
                goal: "Launch Nova with a precise story and zero noise.",
                templateID: "launch",
                memorySummary: "Audience is design-led founders. Tone should stay restrained.",
                documentCount: 2,
                noteCount: 1,
                taskCount: 3,
                fileCount: 2,
                openTaskCount: 2
            ),
            Project(
                id: folioID,
                name: "Research Folio",
                summary: "Capture insights from interviews and competitive reviews.",
                icon: "books.vertical",
                isPinned: false,
                createdAt: now.addingTimeInterval(-86400 * 30),
                updatedAt: now.addingTimeInterval(-86400),
                lastOpenedAt: now.addingTimeInterval(-86400 * 2),
                goal: "Turn research into durable product memory.",
                templateID: "research",
                memorySummary: "Users want project-scoped AI that remembers decisions.",
                documentCount: 2,
                noteCount: 3,
                taskCount: 2,
                fileCount: 1,
                openTaskCount: 1
            ),
            Project(
                id: lumenID,
                name: "Lumen Notes",
                summary: "Personal writing system with AI editorial support.",
                icon: "pencil.line",
                isPinned: false,
                createdAt: now.addingTimeInterval(-86400 * 4),
                updatedAt: now.addingTimeInterval(-3600 * 10),
                lastOpenedAt: now.addingTimeInterval(-3600 * 12),
                goal: "Build a quiet writing environment with strong memory.",
                templateID: "writing",
                memorySummary: "Prefer short paragraphs and decisive language.",
                documentCount: 1,
                noteCount: 2,
                taskCount: 1,
                fileCount: 0,
                openTaskCount: 1
            )
        ]

        store.documents = [
            ProjectDocument(
                id: UUID(),
                projectID: atlasID,
                title: "Product Principles",
                content: """
                # Product Principles

                Atlas should feel like an operating system for thinking.

                ## Core rules
                - Projects own context
                - AI never starts from zero
                - Interface stays quiet

                ```swift
                struct Principle {
                    let name: String
                    let rule: String
                }
                ```
                """,
                updatedAt: now.addingTimeInterval(-7200),
                isPinned: true
            ),
            ProjectDocument(
                id: UUID(),
                projectID: atlasID,
                title: "IA Outline",
                content: "## Information Architecture\n\nHome → Projects → Project Workspace → AI Memory",
                updatedAt: now.addingTimeInterval(-86400),
                isPinned: false
            ),
            ProjectDocument(
                id: UUID(),
                projectID: atlasID,
                title: "Interaction Spec",
                content: "Transitions under 250ms. Spring response around 0.28. No decorative motion.",
                updatedAt: now.addingTimeInterval(-86400 * 2),
                isPinned: false
            ),
            ProjectDocument(
                id: UUID(),
                projectID: novaID,
                title: "Launch Narrative",
                content: "# Nova Launch\n\nOne sentence: Nova helps teams ship with clarity.",
                updatedAt: now.addingTimeInterval(-5000),
                isPinned: true
            ),
            ProjectDocument(
                id: UUID(),
                projectID: novaID,
                title: "Demo Script",
                content: "Open project → Ask AI → Show memory → Create task from answer.",
                updatedAt: now.addingTimeInterval(-9000),
                isPinned: false
            ),
            ProjectDocument(
                id: UUID(),
                projectID: folioID,
                title: "Interview Synthesis",
                content: "Users abandon tools that feel like dashboards. They stay for calm focus.",
                updatedAt: now.addingTimeInterval(-86400 * 3),
                isPinned: true
            ),
            ProjectDocument(
                id: UUID(),
                projectID: folioID,
                title: "Competitor Notes",
                content: "Avoid Notion density. Prefer Linear restraint and Cursor intent.",
                updatedAt: now.addingTimeInterval(-86400 * 4),
                isPinned: false
            ),
            ProjectDocument(
                id: UUID(),
                projectID: lumenID,
                title: "Editorial Voice",
                content: "Write like Apple copy: exact, warm, never clever for its own sake.",
                updatedAt: now.addingTimeInterval(-11000),
                isPinned: true
            )
        ]

        store.notes = [
            ProjectNote(id: UUID(), projectID: atlasID, title: "Whitespace audit", body: "Remove secondary chrome from first viewport.", updatedAt: now.addingTimeInterval(-4000), tags: ["design"]),
            ProjectNote(id: UUID(), projectID: atlasID, title: "AI partner framing", body: "Not a chatbot. A project partner with memory.", updatedAt: now.addingTimeInterval(-8000), tags: ["ai"]),
            ProjectNote(id: UUID(), projectID: novaID, title: "Press kit items", body: "Product film, stills, founder note.", updatedAt: now.addingTimeInterval(-12000), tags: ["launch"]),
            ProjectNote(id: UUID(), projectID: folioID, title: "Quote bank", body: "\"I want the AI to know my project, not just my last message.\"", updatedAt: now.addingTimeInterval(-20000), tags: ["research"]),
            ProjectNote(id: UUID(), projectID: folioID, title: "Signal: offline", body: "Offline-first is a trust feature.", updatedAt: now.addingTimeInterval(-25000), tags: ["research"]),
            ProjectNote(id: UUID(), projectID: folioID, title: "Open question", body: "How do we surface memory without making it feel like a database?", updatedAt: now.addingTimeInterval(-30000), tags: ["ux"]),
            ProjectNote(id: UUID(), projectID: lumenID, title: "Morning pages", body: "Keep the blank page sacred. AI arrives only when invited.", updatedAt: now.addingTimeInterval(-15000), tags: ["writing"]),
            ProjectNote(id: UUID(), projectID: lumenID, title: "Structure", body: "Title. One idea. One cut.", updatedAt: now.addingTimeInterval(-18000), tags: ["writing"])
        ]

        store.tasks = [
            ProjectTask(id: UUID(), projectID: atlasID, title: "Finalize navigation model", details: "Home, Projects, AI, Workspace, Profile", status: .done, dueDate: now.addingTimeInterval(-86400), updatedAt: now.addingTimeInterval(-86400)),
            ProjectTask(id: UUID(), projectID: atlasID, title: "Design project memory panel", details: "Facts, sources, confidence", status: .inProgress, dueDate: now.addingTimeInterval(86400 * 2), updatedAt: now.addingTimeInterval(-3000)),
            ProjectTask(id: UUID(), projectID: atlasID, title: "Polish onboarding copy", details: "3 screens max", status: .todo, dueDate: now.addingTimeInterval(86400 * 3), updatedAt: now.addingTimeInterval(-6000)),
            ProjectTask(id: UUID(), projectID: atlasID, title: "Wire offline cache", details: "Projects and conversations first", status: .todo, dueDate: now.addingTimeInterval(86400 * 5), updatedAt: now.addingTimeInterval(-9000)),
            ProjectTask(id: UUID(), projectID: novaID, title: "Record founder walkthrough", details: "Under 90 seconds", status: .inProgress, dueDate: now.addingTimeInterval(86400), updatedAt: now.addingTimeInterval(-2000)),
            ProjectTask(id: UUID(), projectID: novaID, title: "Confirm launch assets", details: "Hero still + wordmark", status: .todo, dueDate: now.addingTimeInterval(86400 * 2), updatedAt: now.addingTimeInterval(-4500)),
            ProjectTask(id: UUID(), projectID: novaID, title: "Invite early access list", details: "Founders only", status: .done, dueDate: now.addingTimeInterval(-86400 * 2), updatedAt: now.addingTimeInterval(-86400 * 2)),
            ProjectTask(id: UUID(), projectID: folioID, title: "Cluster interview themes", details: "Memory, calm, speed", status: .inProgress, dueDate: now.addingTimeInterval(86400 * 4), updatedAt: now.addingTimeInterval(-7000)),
            ProjectTask(id: UUID(), projectID: folioID, title: "Archive stale notes", details: "Keep signal only", status: .done, dueDate: now.addingTimeInterval(-86400 * 5), updatedAt: now.addingTimeInterval(-86400 * 5)),
            ProjectTask(id: UUID(), projectID: lumenID, title: "Draft essay: Quiet Software", details: "1200 words", status: .todo, dueDate: now.addingTimeInterval(86400 * 6), updatedAt: now.addingTimeInterval(-10000))
        ]

        store.files = [
            ProjectFile(id: UUID(), projectID: atlasID, name: "atlas-wireframes.pdf", kind: .pdf, sizeLabel: "2.4 MB", uploadedAt: now.addingTimeInterval(-86400 * 2)),
            ProjectFile(id: UUID(), projectID: atlasID, name: "hero-study.png", kind: .image, sizeLabel: "1.1 MB", uploadedAt: now.addingTimeInterval(-86400)),
            ProjectFile(id: UUID(), projectID: atlasID, name: "NavigationModel.swift", kind: .code, sizeLabel: "8 KB", uploadedAt: now.addingTimeInterval(-3600 * 8)),
            ProjectFile(id: UUID(), projectID: novaID, name: "launch-score.m4a", kind: .audio, sizeLabel: "4.8 MB", uploadedAt: now.addingTimeInterval(-86400 * 3)),
            ProjectFile(id: UUID(), projectID: novaID, name: "press-brief.pdf", kind: .pdf, sizeLabel: "640 KB", uploadedAt: now.addingTimeInterval(-86400)),
            ProjectFile(id: UUID(), projectID: folioID, name: "interview-05.pdf", kind: .pdf, sizeLabel: "1.8 MB", uploadedAt: now.addingTimeInterval(-86400 * 6))
        ]

        store.timeline = [
            TimelineEvent(id: UUID(), projectID: atlasID, title: "AI summarized product principles", detail: "Extracted 4 durable rules into memory", timestamp: now.addingTimeInterval(-1800), kind: .ai),
            TimelineEvent(id: UUID(), projectID: atlasID, title: "Document updated", detail: "Product Principles", timestamp: now.addingTimeInterval(-7200), kind: .document),
            TimelineEvent(id: UUID(), projectID: atlasID, title: "Task moved", detail: "Design project memory panel → In Progress", timestamp: now.addingTimeInterval(-9000), kind: .task),
            TimelineEvent(id: UUID(), projectID: novaID, title: "File uploaded", detail: "press-brief.pdf", timestamp: now.addingTimeInterval(-86400), kind: .file),
            TimelineEvent(id: UUID(), projectID: folioID, title: "Memory reinforced", detail: "Users want project-scoped AI", timestamp: now.addingTimeInterval(-86400 * 2), kind: .memory),
            TimelineEvent(id: UUID(), projectID: lumenID, title: "Note created", detail: "Morning pages", timestamp: now.addingTimeInterval(-15000), kind: .note)
        ]

        store.knowledge = [
            KnowledgeItem(id: UUID(), projectID: atlasID, title: "Calm over chrome", content: "Every added control must earn its place by reducing friction.", source: "Product Principles", updatedAt: now.addingTimeInterval(-5000)),
            KnowledgeItem(id: UUID(), projectID: atlasID, title: "Project-first AI", content: "Context lives in the project. Chat is a surface, not the product.", source: "AI Framing", updatedAt: now.addingTimeInterval(-8000)),
            KnowledgeItem(id: UUID(), projectID: novaID, title: "Launch tone", content: "Precise. Confident. Never loud.", source: "Launch Narrative", updatedAt: now.addingTimeInterval(-6000)),
            KnowledgeItem(id: UUID(), projectID: folioID, title: "Research signal", content: "Memory continuity beats model novelty for retention.", source: "Interview Synthesis", updatedAt: now.addingTimeInterval(-86400)),
            KnowledgeItem(id: UUID(), projectID: lumenID, title: "Writing rule", content: "Invite AI only after the first draft exists.", source: "Editorial Voice", updatedAt: now.addingTimeInterval(-12000))
        ]

        store.memory = [
            MemoryFact(id: UUID(), projectID: atlasID, title: "Design language", detail: "Dark, monochrome, typography-led. White accent only.", confidence: 0.98, updatedAt: now.addingTimeInterval(-2000)),
            MemoryFact(id: UUID(), projectID: atlasID, title: "Primary user", detail: "Builders who want Cursor-like precision on iOS.", confidence: 0.94, updatedAt: now.addingTimeInterval(-4000)),
            MemoryFact(id: UUID(), projectID: atlasID, title: "Non-goals", detail: "No colorful dashboards. No Notion-like density.", confidence: 0.97, updatedAt: now.addingTimeInterval(-4500)),
            MemoryFact(id: UUID(), projectID: novaID, title: "Audience", detail: "Design-led founders and small product teams.", confidence: 0.91, updatedAt: now.addingTimeInterval(-7000)),
            MemoryFact(id: UUID(), projectID: novaID, title: "Launch constraint", detail: "Demo must stay under 90 seconds.", confidence: 0.89, updatedAt: now.addingTimeInterval(-7500)),
            MemoryFact(id: UUID(), projectID: folioID, title: "User quote", detail: "I want the AI to know my project, not just my last message.", confidence: 0.96, updatedAt: now.addingTimeInterval(-86400)),
            MemoryFact(id: UUID(), projectID: lumenID, title: "Voice", detail: "Short paragraphs. Decisive language. No filler.", confidence: 0.93, updatedAt: now.addingTimeInterval(-11000))
        ]

        let atlasConversation = AIConversation(
            id: UUID(),
            projectID: atlasID,
            title: "Memory model for Atlas",
            preview: "Keep memory as durable facts with sources, not chat logs.",
            updatedAt: now.addingTimeInterval(-1500),
            isPinned: true,
            messages: [
                AIMessage(id: UUID(), role: .user, content: "How should project memory work in Atlas?", createdAt: now.addingTimeInterval(-1600)),
                AIMessage(id: UUID(), role: .assistant, content: """
                For Atlas, treat memory as durable project truth.

                ## Recommendation
                - Store facts, goals, and decisions — not full transcripts
                - Attach a source for every fact
                - Let the AI cite memory silently unless asked

                Based on your principles, the interface should stay quiet while the partner stays informed.
                """, createdAt: now.addingTimeInterval(-1500))
            ]
        )

        let novaConversation = AIConversation(
            id: UUID(),
            projectID: novaID,
            title: "Launch demo flow",
            preview: "Open project → ask → reveal memory → create task.",
            updatedAt: now.addingTimeInterval(-5400),
            isPinned: false,
            messages: [
                AIMessage(id: UUID(), role: .user, content: "Give me a 90-second demo script.", createdAt: now.addingTimeInterval(-5500)),
                AIMessage(id: UUID(), role: .assistant, content: "Open Nova Launch, ask for the launch narrative, show that Adelai already knows the audience, then create a task from the answer. Stay under 90 seconds.", createdAt: now.addingTimeInterval(-5400))
            ]
        )

        let globalConversation = AIConversation(
            id: UUID(),
            projectID: nil,
            title: "What should Adelai become?",
            preview: "An AI operating system for thinking and building.",
            updatedAt: now.addingTimeInterval(-3600 * 6),
            isPinned: true,
            messages: [
                AIMessage(id: UUID(), role: .user, content: "What is Adelai, in one sentence?", createdAt: now.addingTimeInterval(-3600 * 6 - 60)),
                AIMessage(id: UUID(), role: .assistant, content: "Adelai is an AI operating system where every project has its own memory, workspace, and partner.", createdAt: now.addingTimeInterval(-3600 * 6))
            ]
        )

        store.conversations = [atlasConversation, novaConversation, globalConversation]
    }

    static let templates: [ProjectTemplate] = [
        ProjectTemplate(id: "blank", name: "Blank Project", summary: "Start clean with full control.", icon: "plus.square.dashed", starterGoal: "Define the outcome."),
        ProjectTemplate(id: "product", name: "Product", summary: "Specs, tasks, and AI product partner.", icon: "square.stack.3d.up", starterGoal: "Ship a clear product experience."),
        ProjectTemplate(id: "launch", name: "Launch", summary: "Narrative, assets, and launch checklist.", icon: "rocket", starterGoal: "Launch with precision."),
        ProjectTemplate(id: "research", name: "Research", summary: "Interviews, synthesis, and knowledge.", icon: "books.vertical", starterGoal: "Turn research into decisions."),
        ProjectTemplate(id: "writing", name: "Writing", summary: "Drafts, notes, and editorial AI.", icon: "pencil.line", starterGoal: "Write with focus."),
        ProjectTemplate(id: "engineering", name: "Engineering", summary: "Code, files, and implementation memory.", icon: "chevron.left.forwardslash.chevron.right", starterGoal: "Build and document as you go.")
    ]
}
