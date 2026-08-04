import SwiftUI

struct WorkspaceView: View {
    @Binding var projectID: UUID?
    @EnvironmentObject private var store: AppStore
    @State private var showPicker = false

    private var project: Project? {
        guard let projectID else { return nil }
        return store.projects.first { $0.id == projectID }
    }

    var body: some View {
        Group {
            if let project {
                ProjectWorkspaceView(projectID: project.id)
            } else {
                AdelaiScreen {
                    VStack(alignment: .leading, spacing: AdelaiSpacing.sectionGap) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Workspace")
                                .font(AdelaiFont.largeTitle(.bold))
                                .foregroundStyle(AdelaiColor.primaryText)
                            Text("Open a project to enter its operating system")
                                .font(AdelaiFont.callout())
                                .foregroundStyle(AdelaiColor.secondaryText)
                        }
                        .padding(.top, AdelaiSpacing.sm)

                        AdelaiEmptyState(
                            icon: "rectangle.3.group",
                            title: "No project selected",
                            message: "Choose a project to access AI, documents, notes, tasks, files, and memory.",
                            actionTitle: "Choose Project"
                        ) {
                            showPicker = true
                        }

                        if !store.projects.isEmpty {
                            VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
                                AdelaiSectionHeader(title: "Recent")
                                ForEach(store.projects.sorted { $0.lastOpenedAt > $1.lastOpenedAt }.prefix(5)) { item in
                                    AdelaiPressableCard {
                                        projectID = item.id
                                    } content: {
                                        AdelaiListRow(
                                            title: item.name,
                                            subtitle: item.summary,
                                            icon: item.icon,
                                            showChevron: true
                                        )
                                        .padding(.vertical, -AdelaiSpacing.sm)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showPicker) {
            NavigationStack {
                List(store.projects) { item in
                    Button {
                        projectID = item.id
                        showPicker = false
                    } label: {
                        Label(item.name, systemImage: item.icon)
                    }
                }
                .scrollContentBackground(.hidden)
                .background(AdelaiColor.primaryBackground)
                .navigationTitle("Choose Project")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Close") { showPicker = false }
                    }
                }
            }
            .presentationDetents([.medium])
        }
    }
}
