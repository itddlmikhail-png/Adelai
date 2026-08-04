import SwiftUI

struct CreateProjectSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var goal = ""
    @State private var selectedTemplate = SeedData.templates[1]

    var onCreate: (Project) -> Void

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                    VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                        Text("New Project")
                            .font(AdelaiFont.title())
                            .foregroundStyle(AdelaiColor.primaryText)
                        Text("Name it. Set a goal. Start building.")
                            .font(AdelaiFont.callout())
                            .foregroundStyle(AdelaiColor.secondaryText)
                    }

                    VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                        Text("Name")
                            .font(AdelaiFont.caption(.medium))
                            .foregroundStyle(AdelaiColor.secondaryText)
                        AdelaiTextField(placeholder: "Project name", text: $name, icon: "square.stack.3d.up")
                    }

                    VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                        Text("Goal")
                            .font(AdelaiFont.caption(.medium))
                            .foregroundStyle(AdelaiColor.secondaryText)
                        AdelaiTextField(placeholder: "What are you building?", text: $goal, axis: .vertical)
                    }

                    VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                        Text("Template")
                            .font(AdelaiFont.caption(.medium))
                            .foregroundStyle(AdelaiColor.secondaryText)

                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: AdelaiSpacing.sm) {
                            ForEach(SeedData.templates) { template in
                                Button {
                                    withAnimation(AdelaiAnimation.quick) {
                                        selectedTemplate = template
                                        if goal.isEmpty { goal = template.starterGoal }
                                    }
                                } label: {
                                    VStack(alignment: .leading, spacing: AdelaiSpacing.xs) {
                                        Image(systemName: template.icon)
                                            .font(.system(size: 16, weight: .medium))
                                            .foregroundStyle(AdelaiColor.primaryText)
                                        Text(template.name)
                                            .font(AdelaiFont.callout(.semibold))
                                            .foregroundStyle(AdelaiColor.primaryText)
                                        Text(template.summary)
                                            .font(AdelaiFont.caption())
                                            .foregroundStyle(AdelaiColor.secondaryText)
                                            .lineLimit(2)
                                    }
                                    .padding(AdelaiSpacing.md)
                                    .frame(maxWidth: .infinity, minHeight: 110, alignment: .topLeading)
                                    .background(AdelaiColor.card)
                                    .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadius, style: .continuous)
                                            .strokeBorder(
                                                selectedTemplate.id == template.id ? AdelaiColor.accent.opacity(0.55) : AdelaiColor.border,
                                                lineWidth: 1
                                            )
                                    )
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }

                    AdelaiButton(
                        title: "Create Project",
                        icon: "arrow.right",
                        isEnabled: !name.trimmingCharacters(in: .whitespaces).isEmpty
                    ) {
                        create()
                    }
                }
                .padding(AdelaiSpacing.screenHorizontal)
                .padding(.bottom, AdelaiSpacing.xxl)
            }
            .background(AdelaiColor.primaryBackground.ignoresSafeArea())
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Close") { dismiss() }
                        .foregroundStyle(AdelaiColor.secondaryText)
                }
            }
            .adelaiNavigationChrome()
        }
    }

    private func create() {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        let now = Date()
        let project = Project(
            id: UUID(),
            name: trimmed,
            summary: selectedTemplate.summary,
            icon: selectedTemplate.icon,
            isPinned: false,
            createdAt: now,
            updatedAt: now,
            lastOpenedAt: now,
            goal: goal.isEmpty ? selectedTemplate.starterGoal : goal,
            templateID: selectedTemplate.id,
            memorySummary: "New project memory will grow as you work.",
            documentCount: 0,
            noteCount: 0,
            taskCount: 0,
            fileCount: 0,
            openTaskCount: 0
        )
        onCreate(project)
        dismiss()
    }
}
