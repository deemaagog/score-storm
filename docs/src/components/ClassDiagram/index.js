import { usePluginData } from "@docusaurus/useGlobalData"
import Mermaid from "@theme/Mermaid"

export default function ClassDiagram() {
  const { classDiagram } = usePluginData("class-diagram-plugin")

  return <Mermaid value={classDiagram} />
}
