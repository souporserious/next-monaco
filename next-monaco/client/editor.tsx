import * as React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createConfiguredEditor } from 'vscode/monaco'

export default function Editor({
  defaultValue,
  onMount,
}: {
  defaultValue: string
  onMount?: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = React.useState(0)

  React.useLayoutEffect(() => {
    const model = monaco.editor.createModel(
      defaultValue,
      'typescript',
      monaco.Uri.file('index.tsx')
    )
    const editor = createConfiguredEditor(ref.current!, {
      model,
      fontSize: 14,
      fontFamily: 'monospace',
      lineNumbers: 'off',
      folding: false,
      automaticLayout: true,
      language: 'typescript',
      contextmenu: false,
      formatOnPaste: true,
      formatOnType: true,
      minimap: { enabled: false },
      lineNumbersMinChars: 0,
    })

    const margin = editor.getDomNode().querySelector('.margin') as HTMLElement
    const marginOverlay = editor
      .getDomNode()
      .querySelector('.margin-view-overlays') as HTMLElement
    const scrollableElement = editor
      .getDomNode()
      .querySelector('.monaco-scrollable-element') as HTMLElement

    margin.style.width = `0px`
    marginOverlay.style.width = `0px`
    scrollableElement.style.left = `0px`

    /** Add artificial delay to avoid flicker */
    setTimeout(() => {
      onMount?.()
      setOpacity(1)
    }, 1000)

    return () => {
      model.dispose()
      editor.dispose()
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        gridArea: '1 / 1',
        height: 200,
        opacity,
      }}
    />
  )
}
