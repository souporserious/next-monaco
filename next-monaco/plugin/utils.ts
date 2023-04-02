import fs from 'node:fs/promises'
import path from 'node:path'

/** Fetches the types for a locally installed NPM package. */
export async function getTypeDeclaration(packageName) {
  const packagePath = path.resolve(
    process.cwd(),
    'node_modules',
    packageName,
    'package.json'
  )
  const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'))
  const typesField = packageJson.types || packageJson.typings

  let typesPath: string

  if (typesField) {
    typesPath = path.resolve(
      process.cwd(),
      'node_modules',
      packageName,
      typesField
    )
  } else {
    const typesPackageName = `@types/${packageName}`

    typesPath = path.resolve(
      process.cwd(),
      'node_modules',
      typesPackageName,
      'index.d.ts'
    )
  }

  const code = await fs.readFile(typesPath, 'utf-8')

  return code
}
