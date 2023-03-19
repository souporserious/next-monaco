import * as React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createConfiguredEditor } from 'vscode/monaco'
import './setup'
import 'monaco-editor/esm/vs/editor/editor.all'
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'

export default function Editor({ defaultValue }: { defaultValue: string }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const model = monaco.editor.createModel(
      defaultValue,
      'typescript',
      monaco.Uri.file('index.tsx')
    )
    const editor = createConfiguredEditor(ref.current!, {
      model,
    })

    return () => {
      model.dispose()
      editor.dispose()
    }
  }, [])

  return <div ref={ref} style={{ height: '100vh' }} />
}
