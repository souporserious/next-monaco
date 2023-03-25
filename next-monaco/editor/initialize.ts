/**
 * Note, the order of these imports are important.
 * Contributions must be loaded after the editor is initialized.
 */
import '../setup'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.Preserve,
})

export { default } from './editor'
