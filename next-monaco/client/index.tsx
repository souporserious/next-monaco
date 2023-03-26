'use client'
import * as React from 'react'
import dynamic from 'next/dynamic'

const LazyEditor = dynamic(() => import('./initialize'), { ssr: false })

export function Editor({
  defaultValue,
  children,
}: {
  defaultValue: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = React.useState(false)

  return (
    <>
      {mounted ? null : children}
      <LazyEditor
        defaultValue={defaultValue}
        onMount={() => setMounted(true)}
      />
    </>
  )
}
