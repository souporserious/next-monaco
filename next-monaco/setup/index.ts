import 'monaco-editor/esm/vs/editor/editor.all'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { StandaloneServices } from 'vscode/services'
import getDialogsServiceOverride from 'vscode/service-override/dialogs'
import getConfigurationServiceOverride from 'vscode/service-override/configuration'
import getTextmateServiceOverride, {
  setGrammars,
} from 'vscode/service-override/textmate'
import getThemeServiceOverride, {
  setDefaultThemes,
  IThemeExtensionPoint,
} from 'vscode/service-override/theme'
import getLanguagesServiceOverride, {
  setLanguages,
} from 'vscode/service-override/languages'

window.MonacoEnvironment = {
  getWorker: async function (moduleId, label) {
    switch (label) {
      case 'editorWorkerService':
        return new Worker(
          new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url)
        )
      case 'css':
      case 'less':
      case 'scss':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/css/css.worker',
            import.meta.url
          )
        )
      case 'handlebars':
      case 'html':
      case 'razor':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/html/html.worker',
            import.meta.url
          )
        )
      case 'json':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/json/json.worker',
            import.meta.url
          )
        )
      case 'javascript':
      case 'typescript':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/typescript/ts.worker',
            import.meta.url
          )
        )
      default:
        throw new Error(`Unimplemented worker ${label} (${moduleId})`)
    }
  },
}

StandaloneServices.initialize({
  ...getDialogsServiceOverride(),
  ...getConfigurationServiceOverride(),
  ...getTextmateServiceOverride(async () => {
    // @ts-expect-error
    const onigFile = await import('vscode-oniguruma/release/onig.wasm')
    const response = await fetch(onigFile.default)
    return await response.arrayBuffer()
  }),
  ...getThemeServiceOverride(),
  ...getLanguagesServiceOverride(),
})

const loader: Partial<Record<string, () => Promise<string>>> = {
  '/next-monaco.json': async () => process.env.MONACO_THEME,
}

const themes = [
  {
    id: 'Next Monaco',
    label: 'Next Monaco',
    uiTheme: 'vs-dark',
    path: './next-monaco.json',
  },
] as IThemeExtensionPoint[]

setDefaultThemes(themes, async (theme) => loader[theme.path.slice(1)]!())

monaco.editor.setTheme('Next Monaco')

setLanguages([
  {
    id: 'typescript',
    extensions: ['.ts', '.tsx'],
    aliases: ['TypeScript', 'ts', 'typescript'],
  },
  {
    id: 'css',
    extensions: ['.css'],
    aliases: ['CSS', 'css'],
  },
])

setGrammars(
  [
    {
      language: 'typescript',
      scopeName: 'source.ts',
      path: './Typescript.tmLanguage.json',
    },
    {
      language: 'typescript',
      scopeName: 'source.tsx',
      path: './TypescriptReact.tmLanguage.json',
    },
    {
      language: 'css',
      scopeName: 'source.css',
      path: './css.tmLanguage.json',
    },
  ],
  async (grammar) => {
    switch (grammar.scopeName) {
      case 'source.ts':
        return JSON.stringify(
          (await import('./TypeScript.tmLanguage.json')).default as any
        )
      case 'source.tsx':
        return JSON.stringify(
          (await import('./TypeScriptReact.tmLanguage.json')).default as any
        )
      case 'source.css':
        return JSON.stringify(
          (await import('./css.tmLanguage.json')).default as any
        )
    }
    throw new Error(`Grammar not found for: ${grammar.language}`)
  }
)
