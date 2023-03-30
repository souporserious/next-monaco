'use client'
import * as React from 'react'
import dynamic from 'next/dynamic'

const LazyEditor = dynamic(() => import('./editor'), { ssr: false })

export function ClientEditor({
  name,
  value,
  children,
}: {
  name: string
  value: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = React.useState(false)

  return (
    <div style={{ display: 'grid' }}>
      {mounted ? null : children}
      <LazyEditor name={name} value={value} onMount={() => setMounted(true)} />
    </div>
  )
}
