import SwiftUI
import UIKit

enum AppTab: Hashable {
    case home, projects, ai, workspace, profile
}

struct MainTabView: View {
    @State private var selectedTab: AppTab = .home
    @State private var workspaceProjectID: UUID?

    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack {
                HomeView(selectedTab: $selectedTab, workspaceProjectID: $workspaceProjectID)
            }
            .tabItem { Label("Home", systemImage: "house") }
            .tag(AppTab.home)

            NavigationStack {
                ProjectsView(workspaceProjectID: $workspaceProjectID, selectedTab: $selectedTab)
            }
            .tabItem { Label("Projects", systemImage: "square.stack.3d.up") }
            .tag(AppTab.projects)

            NavigationStack {
                AIHubView()
            }
            .tabItem { Label("AI", systemImage: "sparkles") }
            .tag(AppTab.ai)

            NavigationStack {
                WorkspaceView(projectID: $workspaceProjectID)
            }
            .tabItem { Label("Workspace", systemImage: "rectangle.3.group") }
            .tag(AppTab.workspace)

            NavigationStack {
                ProfileView()
            }
            .tabItem { Label("Profile", systemImage: "person") }
            .tag(AppTab.profile)
        }
        .tint(AdelaiColor.accent)
        .onAppear(perform: styleTabBar)
    }

    private func styleTabBar() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(AdelaiColor.secondaryBackground)
        appearance.shadowColor = UIColor.white.withAlphaComponent(0.06)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}
