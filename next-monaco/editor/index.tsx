import * as React from 'react'
import type { LanguageId } from './register'
import type { ScopeName, TextMateGrammar, ScopeNameInfo } from './providers'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createOnigScanner, createOnigString, loadWASM } from 'vscode-oniguruma'
import { SimpleLanguageInfoProvider } from './providers'
import { registerLanguages } from './register'
import { rehydrateRegexps } from './configuration'
import { getTheme } from './theme'

interface DemoScopeNameInfo extends ScopeNameInfo {
  path: string
}

/* Convert VS Code theme to Monaco theme */
// TODO: this should allow setting multiple themes that are all defined at the same time e.g. <Editor theme="night-owl" />
try {
  monaco.editor.defineTheme(
    'next-monaco',
    getTheme(JSON.parse(process.env.MONACO_THEME))
  )
  monaco.editor.setTheme('next-monaco')
} catch (error) {
  throw new Error(
    `next-monaco: Invalid theme configuration. Make sure theme is set to a path that exists and defines a valid VS Code theme.`,
    { cause: error }
  )
}

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.Preserve,
  esModuleInterop: true,
})

async function loadVSCodeOnigurumWASM() {
  const onigasmModule = await import(
    // @ts-expect-error
    'vscode-oniguruma/release/onig.wasm'
  )
  const response = await fetch(onigasmModule.default)
  try {
    const data: ArrayBuffer | Response = await (response as any).arrayBuffer()
    loadWASM(data)
  } catch (error) {
    console.error(`Failed to load vscode-oniguruma: ${error}`)
  }
}

async function initMonacoEditor(value: string, language: LanguageId) {
  const languages: monaco.languages.ILanguageExtensionPoint[] = [
    {
      id: 'typescript',
      extensions: ['.ts', '.tsx'],
    },
  ]
  const grammars: { [scopeName: string]: DemoScopeNameInfo } = {
    'source.tsx': {
      language: 'typescript',
      path: 'tsx.tmLanguage.json',
    },
  }

  const fetchGrammar = async (
    scopeName: ScopeName
  ): Promise<TextMateGrammar> => {
    const { path } = grammars[scopeName]
    const uri = `/monaco/${path}`
    console.log('fetching grammar at: ', uri)
    const response = await fetch(uri)
    const grammar = await response.text()
    const type = path.endsWith('.json') ? 'json' : 'plist'
    return { type, grammar }
  }

  const fetchConfiguration = async (
    language: LanguageId
  ): Promise<monaco.languages.LanguageConfiguration> => {
    const uri = `/monaco/${language}.json`
    console.log('fetching configuration at: ', uri)
    const response = await fetch(uri)
    const rawConfiguration = await response.text()
    return rehydrateRegexps(rawConfiguration)
  }

  await loadVSCodeOnigurumWASM()

  const onigLib = Promise.resolve({
    createOnigScanner,
    createOnigString,
  })

  const provider = new SimpleLanguageInfoProvider({
    grammars,
    fetchGrammar,
    configurations: languages.map((language) => language.id),
    fetchConfiguration,
    onigLib,
    monaco,
  })

  registerLanguages(
    languages,
    (language: LanguageId) => provider.fetchLanguageInfo(language),
    monaco
  )

  const id = 'editor'
  const element = document.getElementById(id)
  const model = monaco.editor.createModel(
    value,
    language,
    monaco.Uri.parse(`file:///${id}.index.tsx`)
  )
  const editor = monaco.editor.create(element, {
    model,
    language,
    theme: 'next-monaco',
  })

  const colorMap = provider.getColorMap()

  console.log('colorMap', colorMap)

  monaco.languages.setColorMap(colorMap)

  return editor
}

export default function Editor({ defaultValue }: { defaultValue: string }) {
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>()

  React.useLayoutEffect(() => {
    initMonacoEditor(defaultValue, 'typescript').then((editor) => {
      editorRef.current = editor
    })

    return () => {
      editorRef.current?.getModel()?.dispose()
      editorRef.current?.dispose()
    }
  }, [])

  return <div id="editor" style={{ height: '100vh' }} />
}
