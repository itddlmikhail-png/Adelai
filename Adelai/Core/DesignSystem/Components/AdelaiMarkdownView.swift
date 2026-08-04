import SwiftUI

struct AdelaiMarkdownView: View {
    let markdown: String

    var body: some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            ForEach(Array(blocks.enumerated()), id: \.offset) { _, block in
                switch block {
                case .paragraph(let text):
                    Text(LocalizedStringKey(text))
                        .font(AdelaiFont.body())
                        .foregroundStyle(AdelaiColor.primaryText)
                        .fixedSize(horizontal: false, vertical: true)

                case .heading(let text, let level):
                    Text(text)
                        .font(level <= 1 ? AdelaiFont.title(.bold) : AdelaiFont.headline())
                        .foregroundStyle(AdelaiColor.primaryText)
                        .padding(.top, AdelaiSpacing.xs)

                case .code(let code, let language):
                    AdelaiCodeBlock(code: code, language: language)

                case .bullet(let text):
                    HStack(alignment: .top, spacing: AdelaiSpacing.sm) {
                        Text("•")
                            .foregroundStyle(AdelaiColor.secondaryText)
                        Text(LocalizedStringKey(text))
                            .font(AdelaiFont.body())
                            .foregroundStyle(AdelaiColor.primaryText)
                            .fixedSize(horizontal: false, vertical: true)
                    }

                case .quote(let text):
                    HStack(spacing: AdelaiSpacing.sm) {
                        Rectangle()
                            .fill(AdelaiColor.borderStrong)
                            .frame(width: 2)
                        Text(text)
                            .font(AdelaiFont.body())
                            .foregroundStyle(AdelaiColor.secondaryText)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
    }

    private var blocks: [MarkdownBlock] {
        MarkdownParser.parse(markdown)
    }
}

struct AdelaiCodeBlock: View {
    let code: String
    var language: String? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: AdelaiSpacing.sm) {
            if let language, !language.isEmpty {
                Text(language.uppercased())
                    .font(AdelaiFont.micro(.semibold))
                    .foregroundStyle(AdelaiColor.tertiaryText)
            }

            ScrollView(.horizontal, showsIndicators: false) {
                Text(code)
                    .font(AdelaiFont.mono(13))
                    .foregroundStyle(AdelaiColor.primaryText)
                    .textSelection(.enabled)
            }
        }
        .padding(AdelaiSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AdelaiColor.secondaryBackground)
        .clipShape(RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadiusSmall, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: AdelaiSpacing.cornerRadiusSmall, style: .continuous)
                .strokeBorder(AdelaiColor.border, lineWidth: 1)
        )
    }
}

private enum MarkdownBlock {
    case paragraph(String)
    case heading(String, Int)
    case code(String, String?)
    case bullet(String)
    case quote(String)
}

private enum MarkdownParser {
    static func parse(_ markdown: String) -> [MarkdownBlock] {
        var blocks: [MarkdownBlock] = []
        let lines = markdown.components(separatedBy: "\n")
        var index = 0

        while index < lines.count {
            let line = lines[index]

            if line.hasPrefix("```") {
                let language = String(line.dropFirst(3)).trimmingCharacters(in: .whitespaces)
                var codeLines: [String] = []
                index += 1
                while index < lines.count && !lines[index].hasPrefix("```") {
                    codeLines.append(lines[index])
                    index += 1
                }
                blocks.append(.code(codeLines.joined(separator: "\n"), language.isEmpty ? nil : language))
                index += 1
                continue
            }

            if line.hasPrefix("### ") {
                blocks.append(.heading(String(line.dropFirst(4)), 3))
            } else if line.hasPrefix("## ") {
                blocks.append(.heading(String(line.dropFirst(3)), 2))
            } else if line.hasPrefix("# ") {
                blocks.append(.heading(String(line.dropFirst(2)), 1))
            } else if line.hasPrefix("- ") || line.hasPrefix("• ") {
                blocks.append(.bullet(String(line.dropFirst(2))))
            } else if line.hasPrefix("> ") {
                blocks.append(.quote(String(line.dropFirst(2))))
            } else if !line.trimmingCharacters(in: .whitespaces).isEmpty {
                blocks.append(.paragraph(line))
            }

            index += 1
        }

        return blocks
    }
}
