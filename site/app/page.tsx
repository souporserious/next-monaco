'use client'
import type {
  LanguageId,
  ScopeName,
  TextMateGrammar,
  ScopeNameInfo,
} from 'next-monaco/editor'
import {
  monaco,
  createOnigScanner,
  createOnigString,
  loadWASM,
  SimpleLanguageInfoProvider,
  registerLanguages,
  rehydrateRegexps,
  VsCodeDarkTheme,
} from 'next-monaco/editor'

// interface DemoScopeNameInfo extends ScopeNameInfo {
//   path: string
// }

// main('python')

// async function main(language: LanguageId) {
//   // In this demo, the following values are hardcoded to support Python using
//   // the VS Code Dark+ theme. Currently, end users are responsible for
//   // extracting the data from the relevant VS Code extensions themselves to
//   // leverage other TextMate grammars or themes. Scripts may be provided to
//   // facilitate this in the future.
//   //
//   // Note that adding a new TextMate grammar entails the following:
//   // - adding an entry in the languages array
//   // - adding an entry in the grammars map
//   // - making the TextMate file available in the grammars/ folder
//   // - making the monaco.languages.LanguageConfiguration available in the
//   //   configurations/ folder.
//   //
//   // You likely also want to add an entry in getSampleCodeForLanguage() and
//   // change the call to main() above to pass your LanguageId.
//   const languages: monaco.languages.ILanguageExtensionPoint[] = [
//     {
//       id: 'python',
//       extensions: [
//         '.py',
//         '.rpy',
//         '.pyw',
//         '.cpy',
//         '.gyp',
//         '.gypi',
//         '.pyi',
//         '.ipy',
//         '.bzl',
//         '.cconf',
//         '.cinc',
//         '.mcconf',
//         '.sky',
//         '.td',
//         '.tw',
//       ],
//       aliases: ['Python', 'py'],
//       filenames: ['Snakefile', 'BUILD', 'BUCK', 'TARGETS'],
//       firstLine: '^#!\\s*/?.*\\bpython[0-9.-]*\\b',
//     },
//   ]
//   const grammars: { [scopeName: string]: DemoScopeNameInfo } = {
//     'source.python': {
//       language: 'python',
//       path: 'MagicPython.tmLanguage.json',
//     },
//   }

//   const fetchGrammar = async (
//     scopeName: ScopeName
//   ): Promise<TextMateGrammar> => {
//     const { path } = grammars[scopeName]
//     const uri = `/grammars/${path}`
//     const response = await fetch(uri)
//     const grammar = await response.text()
//     const type = path.endsWith('.json') ? 'json' : 'plist'
//     return { type, grammar }
//   }

//   const fetchConfiguration = async (
//     language: LanguageId
//   ): Promise<monaco.languages.LanguageConfiguration> => {
//     const uri = `/configurations/${language}.json`
//     const response = await fetch(uri)
//     const rawConfiguration = await response.text()
//     return rehydrateRegexps(rawConfiguration)
//   }

//   const data: ArrayBuffer | Response = await loadVSCodeOnigurumWASM()
//   loadWASM(data)
//   const onigLib = Promise.resolve({
//     createOnigScanner,
//     createOnigString,
//   })

//   const provider = new SimpleLanguageInfoProvider({
//     grammars,
//     fetchGrammar,
//     configurations: languages.map((language) => language.id),
//     fetchConfiguration,
//     theme: VsCodeDarkTheme,
//     onigLib,
//     monaco,
//   })
//   registerLanguages(
//     languages,
//     (language: LanguageId) => provider.fetchLanguageInfo(language),
//     monaco
//   )

//   const value = getSampleCodeForLanguage(language)
//   const id = 'container'
//   const element = document.getElementById(id)
//   if (element == null) {
//     throw Error(`could not find element #${id}`)
//   }

//   monaco.editor.create(element, {
//     value,
//     language,
//     theme: 'vs-dark',
//     minimap: {
//       enabled: true,
//     },
//   })
//   provider.injectCSS()
// }

// // Taken from https://github.com/microsoft/vscode/blob/829230a5a83768a3494ebbc61144e7cde9105c73/src/vs/workbench/services/textMate/browser/textMateService.ts#L33-L40
// async function loadVSCodeOnigurumWASM(): Promise<Response | ArrayBuffer> {
//   const response = await fetch(
//     '/node_modules/vscode-oniguruma/release/onig.wasm'
//   )
//   const contentType = response.headers.get('content-type')
//   if (contentType === 'application/wasm') {
//     return response
//   }

//   // Using the response directly only works if the server sets the MIME type 'application/wasm'.
//   // Otherwise, a TypeError is thrown when using the streaming compiler.
//   // We therefore use the non-streaming compiler :(.
//   return await response.arrayBuffer()
// }

// function getSampleCodeForLanguage(language: LanguageId): string {
//   if (language === 'python') {
//     return `\
// import foo

// async def bar(): string:
//   f = await foo()
//   f_string = f"Hooray {f}! format strings are not supported in current Monarch grammar"
//   return foo_string
// `
//   }

//   throw Error(`unsupported language: ${language}`)
// }

export default function Page() {
  return (
    <div>
      <h1>Page</h1>
      <p>Some content</p>
    </div>
  )
}
