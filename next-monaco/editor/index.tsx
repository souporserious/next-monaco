'use client'
import * as React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createConfiguredEditor } from 'vscode/monaco'
import './setup'

// TODO: for some reason this only works when the entire editor directory is imported locally
// import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'

// monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//   jsx: monaco.languages.typescript.JsxEmit.Preserve,
// })

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
      automaticLayout: true,
    })

    return () => {
      model.dispose()
      editor.dispose()
    }
  }, [])

  return <div ref={ref} style={{ height: 200 }} />
}
