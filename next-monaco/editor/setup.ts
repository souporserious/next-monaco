import 'monaco-editor/esm/vs/editor/editor.all'
import { StandaloneServices } from 'vscode/services'
import getModelEditorServiceOverride from 'vscode/service-override/modelEditor'
import getDialogsServiceOverride from 'vscode/service-override/dialogs'
import getConfigurationServiceOverride from 'vscode/service-override/configuration'
import getKeybindingsServiceOverride from 'vscode/service-override/keybindings'
import getTextmateServiceOverride, {
  setGrammars,
} from 'vscode/service-override/textmate'
import getThemeServiceOverride, {
  setDefaultThemes,
  IThemeExtensionPoint,
} from 'vscode/service-override/theme'
import geTokenClassificationServiceOverride from 'vscode/service-override/tokenClassification'
import getLanguageConfigurationServiceOverride, {
  setLanguageConfiguration,
} from 'vscode/service-override/languageConfiguration'
import getLanguagesServiceOverride, {
  setLanguages,
} from 'vscode/service-override/languages'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js'
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js'

interface WorkerConstructor {
  new (): Worker
}

export type WorkerLoader = () => WorkerConstructor | Promise<WorkerConstructor>

const workerLoaders: Partial<Record<string, WorkerLoader>> = {
  editorWorkerService: () => EditorWorker,
  typeScriptWorkerService: () => TypeScriptWorker,
}

window.MonacoEnvironment = {
  getWorker: async function (moduleId, label) {
    const workerFactory = workerLoaders[label]

    if (workerFactory != null) {
      const Worker = await workerFactory()
      return new Worker()
    }

    throw new Error(`Unimplemented worker ${label} (${moduleId})`)
  },
}

// Override services
StandaloneServices.initialize({
  ...getModelEditorServiceOverride(async (model, options) => {
    console.log('trying to open a model', model, options)
    return undefined
  }),
  ...getDialogsServiceOverride(),
  ...getConfigurationServiceOverride(),
  ...getKeybindingsServiceOverride(),
  ...getTextmateServiceOverride(async () => {
    // @ts-expect-error
    const onigFile = await import('vscode-oniguruma/release/onig.wasm')
    const response = await fetch(onigFile.default)
    return await response.arrayBuffer()
  }),
  ...getThemeServiceOverride(),
  ...geTokenClassificationServiceOverride(),
  ...getLanguageConfigurationServiceOverride(),
  ...getLanguagesServiceOverride(),
})

const loader: Partial<Record<string, () => Promise<string>>> = {
  '/next-monaco.json': () => JSON.parse(process.env.MONACO_THEME),
}

const themes = [
  {
    id: 'Default Dark+',
    label: 'Dark+ (default dark)',
    uiTheme: 'vs-dark',
    path: './next-monaco.json',
  },
] as IThemeExtensionPoint[]

setDefaultThemes(themes, async (theme) => loader[theme.path.slice(1)]!())

setLanguages([
  {
    id: 'typescript',
    extensions: ['.ts', '.tsx'],
    aliases: ['TypeScript', 'ts', 'typescript'],
    configuration: './typescript-configuration',
  },
])

setLanguageConfiguration('/typescript-configuration.json', async () => {
  return (await import('./typescript-language-configuration.json'))
    .default as any
})

setGrammars(
  [
    {
      language: 'typescript',
      scopeName: 'source.ts',
      path: './typescript.tmLanguage.json',
    },
    {
      language: 'typescriptreact',
      scopeName: 'source.tsx',
      path: './typescriptreact.tmLanguage.json',
    },
  ],
  async (grammar) => {
    switch (grammar.scopeName) {
      case 'source.ts':
        return (await import('./TypeScript.tmLanguage.json')).default as any
      case 'source.tsx':
        return (await import('./TypeScriptReact.tmLanguage.json'))
          .default as any
    }
    throw new Error('grammar not found')
  }
)
