'use client'
import * as React from 'react'
import dynamic from 'next/dynamic'
import type { EditorProps } from './editor'

const LazyEditor = dynamic(() => import('./editor'), { ssr: false })

export function ClientEditor({
  fileName,
  value,
  className,
  style,
  children,
}: {
  children: React.ReactNode
} & EditorProps) {
  const [mounted, setMounted] = React.useState(false)

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        border: '1px solid #2f384f',
        padding: '1rem',
        borderRadius: 3,
        ...style,
      }}
    >
      {mounted ? null : children}
      <LazyEditor
        fileName={fileName}
        value={value}
        onMount={() => setMounted(true)}
      />
    </div>
  )
}
