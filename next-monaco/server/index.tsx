import * as React from 'react'
import { highlightWithScopes } from '@code-hike/lighter'
import { ClientEditor } from '../client'
import 'server-only'

async function AsyncEditor({ name, value }: { name: string; value: string }) {
  const { lines } = await highlightWithScopes(
    value,
    name.split('.').pop(),
    JSON.parse(process.env.MONACO_THEME)
  )

  return (
    <ClientEditor name={name} value={value}>
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

export function Editor({ name, value }: { name: string; value: string }) {
  // @ts-expect-error remove when async component types are fixed
  return <AsyncEditor name={name} value={value} />
}
