# Adelai

**The AI Operating System for iOS.**

Adelai is a premium AI workspace where people think, build, organize, and create. Everything lives inside Projects. Every Project has its own memory and its own AI partner that understands context.

Not a chat wrapper. A calm, project-first operating system — designed to feel like Apple built Cursor.

## Open in Xcode

1. Open `Adelai.xcodeproj` in Xcode 15.4+ (iOS 17+)
2. Select an iPhone simulator or device
3. Set your Development Team under Signing
4. Run

Seeded demo data loads automatically so Home, Projects, AI, and Workspace feel alive on first launch.

## Architecture

```
Adelai/
├── App/                 # Composition root, DI, root navigation
├── Core/DesignSystem/   # Colors, type, spacing, reusable components
├── Domain/              # Models + repository protocols
├── Data/                # Repositories, AI/search/sync services, SwiftData, seed
├── Features/            # Onboarding, Home, Projects, AI, Workspace, Profile…
└── Navigation/          # Tab shell
```

- **SwiftUI** + **MVVM-ready** feature views
- **Clean Architecture** boundaries (Domain ← Data ← Features)
- **Dependency Injection** via `DependencyContainer`
- **Offline-first** AppStore with SwiftData + CloudKit-ready schema
- **Protocol-oriented** repositories and services
- **Async/await** throughout

## Product surfaces

| Tab | Purpose |
|-----|---------|
| Home | Greeting, search, continue, pinned/recent, quick actions, AI sessions |
| Projects | All projects, templates, pin/delete, create in seconds |
| AI | Global sessions with project-aware partner |
| Workspace | Full project OS: Overview, AI, Documents, Notes, Tasks, Files, Timeline, Knowledge, Memory, Settings |
| Profile | Plan, sync, preferences, subscription |

## Design system

- Background `#09090B` · Surface `#111214` · Card `#18181B`
- Text white / `#8A8A8F` · Accent white only
- SF Pro hierarchy: 34 / 28 / 20 / 17 / 13
- Spring motion under ~250ms
- Reusable: buttons, cards, search, FAB, lists, markdown, code blocks, empty states

## Subscription

- **Free** — 3 projects, limited AI
- **Pro** — unlimited projects & AI, memory, sync, voice, priority models
- **Business** — teams, shared memory, analytics, admin

## First launch

3-page onboarding → create a project in under 30 seconds → land in the workspace.

## Next integrations

Wire `AdelaiAIService` to your model provider, enable CloudKit on the SwiftData container, and connect Speech for Voice Mode. The surfaces and contracts are already in place.
