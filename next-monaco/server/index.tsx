import * as React from 'react'
import { highlightWithScopes } from '@code-hike/lighter'
import { ClientEditor } from '../client'
import type { EditorProps } from '../client/editor'
import 'server-only'

async function AsyncEditor(props: EditorProps) {
  const { lines } = await highlightWithScopes(
    props.value,
    props.fileName.split('.').pop(),
    JSON.parse(process.env.MONACO_THEME)
  )

  return (
    <ClientEditor {...props}>
      <pre style={{ gridArea: '1 / 1', margin: 0 }}>
        {lines.map((line, index) => (
          <div key={index} style={{ height: 20, lineHeight: '20px' }}>
            {line.map((token, index) => (
              <span key={index} style={token.style}>
                {token.content}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </ClientEditor>
  )
}

export function Editor(props: EditorProps) {
  // @ts-expect-error remove when async component types are fixed
  return <AsyncEditor {...props} />
}
