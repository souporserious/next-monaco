import * as React from 'react'
import { highlightWithScopes } from '@code-hike/lighter'
import { ClientEditor } from '../client'
import 'server-only'

async function AsyncEditor({ defaultValue }: { defaultValue: string }) {
  const { lines } = await highlightWithScopes(
    defaultValue,
    'tsx',
    JSON.parse(process.env.MONACO_THEME)
  )

  return (
    <ClientEditor defaultValue={defaultValue}>
      <pre style={{ gridArea: '1 / 1', margin: 0 }}>
        {lines.map((line, index) => (
          <div key={index} style={{ lineHeight: '20px' }}>
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

export function Editor({ defaultValue }: { defaultValue: string }) {
  // @ts-expect-error remove when async component types are fixed
  return <AsyncEditor defaultValue={defaultValue} />
}
