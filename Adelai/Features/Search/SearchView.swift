import SwiftUI

struct SearchView: View {
    @Environment(\.dependencies) private var dependencies
    @Environment(\.dismiss) private var dismiss
    @State private var query: String
    @State private var results: [SearchResult] = []
    @State private var isSearching = false

    init(initialQuery: String = "") {
        _query = State(initialValue: initialQuery)
    }

    var body: some View {
        VStack(spacing: AdelaiSpacing.md) {
            AdelaiSearchBar(text: $query, placeholder: "Search everything", onSubmit: search)
                .padding(.horizontal, AdelaiSpacing.screenHorizontal)
                .padding(.top, AdelaiSpacing.md)

            if query.isEmpty {
                AdelaiEmptyState(
                    icon: "magnifyingglass",
                    title: "Global Search",
                    message: "Find projects, conversations, documents, notes, tasks, and knowledge."
                )
            } else if results.isEmpty && !isSearching {
                AdelaiEmptyState(
                    icon: "magnifyingglass",
                    title: "No results",
                    message: "Try a project name, task, or memory keyword."
                )
            } else {
                ScrollView {
                    LazyVStack(spacing: AdelaiSpacing.sm) {
                        ForEach(results) { result in
                            AdelaiCard {
                                AdelaiListRow(
                                    title: result.title,
                                    subtitle: [result.kind.rawValue.capitalized, result.projectName, result.subtitle]
                                        .compactMap { $0 }
                                        .filter { !$0.isEmpty }
                                        .joined(separator: " · "),
                                    icon: result.kind.systemImage,
                                    showChevron: false
                                )
                                .padding(.vertical, -AdelaiSpacing.sm)
                            }
                        }
                    }
                    .padding(.horizontal, AdelaiSpacing.screenHorizontal)
                    .padding(.bottom, AdelaiSpacing.xxl)
                }
            }
        }
        .background(AdelaiColor.primaryBackground.ignoresSafeArea())
        .navigationTitle("Search")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Done") { dismiss() }
                    .foregroundStyle(AdelaiColor.secondaryText)
            }
        }
        .adelaiNavigationChrome()
        .onChange(of: query) { _, _ in
            search()
        }
        .task {
            if !query.isEmpty { search() }
        }
    }

    private func search() {
        Task {
            isSearching = true
            results = await dependencies.search.search(query: query)
            isSearching = false
        }
    }
}
