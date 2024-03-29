import fs from 'node:fs/promises'
import { Editor } from 'next-monaco'
import './app.css'

const plugin = `
import { createMonacoPlugin } from 'next-monaco/plugin'

const withMonaco = createMonacoPlugin({
  theme: 'theme.json',
  types: ['next-monaco'],
})

export default withMonaco({
  experimental: {
    appDir: true,
  },
})
`.trim()

const editor = `
import { Editor } from 'next-monaco'

export default function App() {
  return (
    <Editor
      fileName="index.tsx"
      value={\`import { React } from 'react'\`}
    />
  )
}
`.trim()

export default async function Page() {
  const exampleFiles = await Promise.all(
    (
      await fs.readdir('app/example')
    ).map(async (fileName) => {
      const contents = await fs.readFile(`app/example/${fileName}`, 'utf8')

      return {
        fileName,
        contents,
      }
    })
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr auto 0.25fr',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          padding: '1rem',
          backgroundColor: '#d39e5a',
          color: '#1c1309',
          textAlign: 'center',
        }}
      >
        This package is still a work in progress. The APIs are not stable and
        may change.
      </div>
      <header
        style={{ display: 'flex', justifyContent: 'end', padding: '1rem' }}
      >
        <GitHubLink />
      </header>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          alignItems: 'center',
          padding: '6rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '54ch',
            padding: '2rem',
            gap: '2rem',
          }}
        >
          <h1>Next Monaco</h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h2>
              The same powerful editor used in VS Code loaded on-demand in your
              Next.js application.
            </h2>
            <p>
              Next Monaco provides a familiar full-featured code editing
              experience without sacrificing time to first byte.
            </p>
          </div>
          <code>npm install next-monaco</code>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {exampleFiles.map(({ fileName, contents }) => (
            <Editor key={fileName} fileName={fileName} value={contents} />
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
          gap: '6rem',
          padding: '4rem',
          textAlign: 'center',
          textTransform: 'uppercase',
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
        }}
      >
        <h3>Server Component Ready</h3>
        <h3>TextMate Highlighting</h3>
        <h3>Type Acquisition</h3>
        <h3>Preconfigured TypeScript</h3>
        <h3>CSS Variables</h3>
        <h3>Multi-Model</h3>
        <h3>Lazy Loaded</h3>
        <h3>Marketplace Themes</h3>
        <h3>Code Formatting</h3>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: '1rem',
          gap: '1rem',
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <h3 style={{ fontSize: '0.75rem' }}>plugin.ts</h3>
          <Editor fileName="plugin.ts" value={plugin} style={{ flex: 1 }} />
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <h3 style={{ fontSize: '0.75rem' }}>editor.tsx</h3>
          <Editor fileName="editor.tsx" value={editor} style={{ flex: 1 }} />
        </div>
      </div>
    </div>
  )
}

function GitHubLink() {
  return (
    <a href="https://github.com/souporserious/next-monaco" aria-label="github">
      <svg width="20" height="20" viewBox="0 0 16 16" fill="white">
        <path
          fillRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    </a>
  )
}
