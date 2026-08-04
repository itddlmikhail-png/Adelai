import Foundation
#if canImport(UIKit)
import UIKit
#endif

enum AdelaiHaptics {
    static func light() {
        #if canImport(UIKit)
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
        #endif
    }

    static func success() {
        #if canImport(UIKit)
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
        #endif
    }
}

enum AdelaiConstants {
    static let freeProjectLimit = 3
    static let appName = "Adelai"
    static let tagline = "The AI Operating System"
    static let bundleID = "com.adelai.app"
}
