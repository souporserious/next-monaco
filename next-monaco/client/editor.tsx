/*
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

const typeDeclarations = JSON.parse(process.env.MONACO_TYPES)

typeDeclarations.forEach(({ code, path }) => {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(code, path)
})

const MIN_LINE_COUNT = 1
const LINE_HEIGHT = 20

export type EditorProps = {
  fileName: string
  value: string
  className?: string
  style?: React.CSSProperties
  onMount?: () => void
}

export default function Editor({
  fileName,
  value,
  className,
  style,
  onMount,
}: EditorProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = React.useState(0)
  const lineCount = value
    ? Math.max(value.split('\n').length, MIN_LINE_COUNT)
    : MIN_LINE_COUNT

  React.useLayoutEffect(() => {
    const language = getLanguageFromFileExtension(fileName.split('.').pop())
    const model = monaco.editor.createModel(
      value,
      language,
      monaco.Uri.file(fileName)
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
      guides: { indentation: false },
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
      className={className}
      style={{
        gridArea: '1 / 1',
        height: lineCount * LINE_HEIGHT,
        opacity,
        ...style,
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
