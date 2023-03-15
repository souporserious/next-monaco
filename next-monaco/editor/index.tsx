import * as React from 'react'
import type { LanguageId } from './register'
import type { ScopeName, TextMateGrammar, ScopeNameInfo } from './providers'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createOnigScanner, createOnigString, loadWASM } from 'vscode-oniguruma'
import { SimpleLanguageInfoProvider } from './providers'
import { registerLanguages } from './register'
import { rehydrateRegexps } from './configuration'

interface DemoScopeNameInfo extends ScopeNameInfo {
  path: string
}

main('typescript')

async function main(language: LanguageId) {
  // Note that adding a new TextMate grammar entails the following:
  // - adding an entry in the languages array
  // - adding an entry in the grammars map
  // - making the TextMate file available in the grammars/ folder
  // - making the monaco.languages.LanguageConfiguration available in the
  //   configurations/ folder.
  //
  // You likely also want to add an entry in getSampleCodeForLanguage() and
  // change the call to main() above to pass your LanguageId.
  const languages: monaco.languages.ILanguageExtensionPoint[] = [
    {
      id: 'typescript',
      extensions: ['.ts', '.tsx'],
      aliases: ['TypeScript', 'ts'],
      filenames: [
        'tsconfig.json',
        'tslint.json',
        'tsconfig.app.json',
        'tsconfig.lib.json',
      ],
      firstLine: '^#!\\s*/?.*\\bnode\\b',
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
    configurations: [],
    fetchConfiguration,
    onigLib,
    monaco,
  })

  registerLanguages(
    languages,
    (language: LanguageId) => provider.fetchLanguageInfo(language),
    monaco
  )

  const value = getSampleCodeForLanguage(language)
  const id = 'container'
  const element = document.getElementById(id)

  if (element == null) {
    throw Error(`could not find element #${id}`)
  }

  const model = monaco.editor.createModel(
    value,
    language,
    monaco.Uri.parse(`file:///${id}.index.tsx`)
  )

  const editor = monaco.editor.create(element, {
    model,
    language,
    theme: 'vs-dark',
    minimap: {
      enabled: true,
    },
  })

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
    esModuleInterop: true,
  })

  const colorMap = provider.getColorMap()
  monaco.languages.setColorMap(colorMap)
}

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

function getSampleCodeForLanguage(language: LanguageId): string {
  if (language === 'typescript') {
    return `
/**
 * Say hello.
 *
 * @example
 * <Hello name="Penny" />
 */
function Hello({ name }: { name: string }) {
  return <div>Hello, {name}</div>
}
`.trim()
  }

  throw Error(`unsupported language: ${language}`)
}

export default function Editor({ defaultValue }: { defaultValue: string }) {
  return <div id="container" style={{ height: '100vh' }} />
}
