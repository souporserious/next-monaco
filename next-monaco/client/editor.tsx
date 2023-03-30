/**
 * Note, the order of these imports are important.
 * Contributions must be loaded after the editor is initialized.
 */
import '../setup'
import { createConfiguredEditor } from 'vscode/monaco'
import * as React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.Preserve,
})

const MIN_LINE_COUNT = 1
const LINE_HEIGHT = 20

export default function Editor({
  name,
  value,
  onMount,
}: {
  name: string
  value: string
  onMount?: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = React.useState(0)
  const lineCount = value
    ? Math.max(value.split('\n').length, MIN_LINE_COUNT)
    : MIN_LINE_COUNT

  React.useLayoutEffect(() => {
    const model = monaco.editor.createModel(
      value,
      getLanguageFromFileExtension(name.split('.').pop()),
      monaco.Uri.file(name)
    )
    const editor = createConfiguredEditor(ref.current!, {
      model,
      fontFamily: 'monospace',
      fontSize: 14,
      lineHeight: LINE_HEIGHT,
      lineNumbers: 'off',
      folding: false,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderLineHighlightOnlyWhenFocus: true,
      language: 'typescript',
      contextmenu: false,
      formatOnPaste: true,
      formatOnType: true,
      minimap: { enabled: false },
    })

    const editorNode = editor.getDomNode()
    const margin = editorNode.querySelector('.margin') as HTMLElement
    const marginOverlay = editorNode.querySelector(
      '.margin-view-overlays'
    ) as HTMLElement
    const scrollableElement = editorNode.querySelector(
      '.monaco-scrollable-element'
    ) as HTMLElement

    margin.style.width = `0px`
    marginOverlay.style.width = `0px`
    scrollableElement.style.width = `100%`
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
        height: lineCount * LINE_HEIGHT,
        opacity,
      }}
    />
  )
}

const fileExtensionToLanguage = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json: 'json',
  html: 'html',
  css: 'css',
}

function getLanguageFromFileExtension(extension) {
  return fileExtensionToLanguage[extension] || 'plaintext'
}
