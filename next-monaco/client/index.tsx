'use client'
import * as React from 'react'
import dynamic from 'next/dynamic'

const LazyEditor = dynamic(() => import('./initialize'), { ssr: false })

export function ClientEditor({
  defaultValue,
  children,
}: {
  defaultValue: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = React.useState(false)

  return (
    <div style={{ display: 'grid' }}>
      {mounted ? null : children}
      <LazyEditor
        defaultValue={defaultValue}
        onMount={() => setMounted(true)}
      />
    </div>
  )
}
