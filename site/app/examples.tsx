import Link from 'next/link'
import fs from 'node:fs/promises'

export async function Examples() {
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
    <ul>
      {exampleFiles.map((file) => (
        <li key={file.fileName}>
          <Link href={`/example/${file.fileName}`}>{file.fileName}</Link>
        </li>
      ))}
    </ul>
  )
}
