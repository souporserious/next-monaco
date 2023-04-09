import 'monaco-editor/esm/vs/editor/editor.all'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { StandaloneServices } from 'vscode/services'
import { registerExtension } from 'vscode/extensions'
import getDialogsServiceOverride from 'vscode/service-override/dialogs'
import getConfigurationServiceOverride from 'vscode/service-override/configuration'
import getTextmateServiceOverride from 'vscode/service-override/textmate'
import getThemeServiceOverride from 'vscode/service-override/theme'
import getLanguagesServiceOverride from 'vscode/service-override/languages'

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
  ...getTextmateServiceOverride(),
  ...getThemeServiceOverride(),
  ...getLanguagesServiceOverride(),
})

const defaultThemesExtensions = {
  name: 'theme-defaults',
  displayName: '%displayName%',
  description: '%description%',
  categories: ['Themes'],
  version: '1.0.0',
  publisher: 'vscode',
  license: 'MIT',
  engines: {
    vscode: '*',
  },
  contributes: {
    themes: [
      {
        id: 'Next Monaco',
        label: 'Next Monaco',
        uiTheme: 'vs-dark',
        path: './next-monaco.json',
      },
    ],
  },
  repository: {
    type: 'git',
    url: 'https://github.com/microsoft/vscode.git',
  },
}

const { registerFile: registerDefaultThemeExtensionFile } = registerExtension(
  defaultThemesExtensions
)

registerDefaultThemeExtensionFile('./next-monaco.json', async () => {
  console.log('register default theme')
  return process.env.MONACO_THEME
})

monaco.editor.setTheme('Next Monaco')

const extension = {
  name: 'test',
  publisher: 'next-monaco',
  version: '1.0.0',
  engines: {
    vscode: '*',
  },
  contributes: {
    languages: [
      {
        id: 'typescript',
        extensions: ['.ts', '.tsx'],
        aliases: ['TypeScript', 'ts', 'typescript'],
      },
    ],
    grammars: [
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
    ],
  },
}

const { registerFile: registerExtensionFile } = registerExtension(extension)

registerExtensionFile('./Typescript.tmLanguage.json', async () => {
  console.log('load typescript grammar')
  return JSON.stringify(
    (await import('./TypeScript.tmLanguage.json')).default as any
  )
})

registerExtensionFile('./TypescriptReact.tmLanguage.json', async () => {
  console.log('load typescript react grammar')
  return JSON.stringify(
    (await import('./TypescriptReact.tmLanguage.json')).default as any
  )
})
