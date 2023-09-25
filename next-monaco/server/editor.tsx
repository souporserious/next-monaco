import * as React from 'react'
import { ClientEditor } from '../client'
import type { EditorProps } from '../client/editor'
import { Code } from './code'
import 'server-only'

/** Renders a code block using Monaco Editor. */
export function Editor(props: EditorProps) {
  return (
    <ClientEditor {...props}>
      <Code {...props} />
    </ClientEditor>
  )
}
