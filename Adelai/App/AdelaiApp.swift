import SwiftUI

@main
struct AdelaiApp: App {
    @StateObject private var dependencies = DependencyContainer()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(dependencies)
                .environmentObject(dependencies.store)
                .environment(\.dependencies, dependencies)
                .preferredColorScheme(.dark)
        }
    }
}
