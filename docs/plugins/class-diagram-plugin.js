const { TsUML2Settings, getMermaidDSL, parseProject } = require("tsuml2")

export default function () {
  return {
    name: "class-diagram-plugin",
    async loadContent() {
      const settings = new TsUML2Settings()
      settings.glob = `../packages/core/src/{model/**/*.ts,graphical/Graphical*.ts}`
      settings.memberAssociations = true
      settings.exportedTypesOnly = true
      settings.mermaid = ["direction LR"]
      const declarations = parseProject(settings)

      const declarationsSanitized = declarations.map((declaration) => {
        return {
          ...declaration,
          heritageClauses: [],
          classes: declaration.classes.map((c) => {
            return {
              ...c,
              heritageClauses: [],
              methods: [],
              properties: c.properties.filter((p) => {
                return (
                  p.type !== "number" &&
                  p.type !== "string" &&
                  p.type !== "boolean" &&
                  p.type !== "Glyph" &&
                  p.modifierFlags === 0
                )
              }),
            }
          }),
          types: [],
          enums: [],
        }
      })
      const dsl = getMermaidDSL(declarationsSanitized, settings)

      return dsl
    },
    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions
      const updatedDiagram = content.replace(/class (Graphical\w+)\{/g, "class $1:::graphical{")
      setGlobalData({ classDiagram: updatedDiagram })
    },
  }
}
