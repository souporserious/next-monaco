import * as React from 'react'
import { ClientEditor } from '../client'
import type { EditorProps } from '../client/editor'
import { Code } from './code'
import 'server-only'

async function AsyncEditor(props: EditorProps) {
  return (
    <ClientEditor {...props}>
      <Code {...props} />
    </ClientEditor>
  )
}

export function Editor(props: EditorProps) {
  // @ts-expect-error remove when async component types are fixed
  return <AsyncEditor {...props} />
}
