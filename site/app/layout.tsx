export const metadata = {
  title: 'next-monaco',
  description: `Monaco Editor configured for Next.js. Fully featured code editing based on VS Code.`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
