import fs from 'node:fs/promises'
import path from 'node:path'

/** Fetches the types for a locally installed NPM package. */
export async function getTypeDeclaration(packageName) {
  const [parentPackage, submodule] = packageName.split('/')
  const parentPackagePath = path.resolve(
    process.cwd(),
    'node_modules',
    parentPackage,
    'package.json'
  )

  try {
    const packageJson = JSON.parse(
      await fs.readFile(parentPackagePath, 'utf-8')
    )

    let typesPath

    if (submodule) {
      if (packageJson.typesVersions) {
        const typeVersionsField = packageJson.typesVersions['*']

        if (typeVersionsField) {
          const typesPathFromTypeVersions = typeVersionsField[submodule]

          if (typesPathFromTypeVersions) {
            typesPath = path.resolve(
              process.cwd(),
              'node_modules',
              parentPackage,
              typesPathFromTypeVersions[0]
            )
          }
        }
      }
    } else {
      const typesField = packageJson.types || packageJson.typings

      if (typesField) {
        typesPath = path.resolve(
          process.cwd(),
          'node_modules',
          parentPackage,
          typesField
        )
      } else if (packageJson.exports) {
        const exportsField = packageJson.exports['.']
        const typesFieldFromExports =
          exportsField?.types || exportsField?.typings

        if (typesFieldFromExports) {
          typesPath = path.resolve(
            process.cwd(),
            'node_modules',
            parentPackage,
            typesFieldFromExports
          )
        } else if (packageJson.typesVersions) {
          const typeVersionsField = packageJson.typesVersions['*']

          if (typeVersionsField) {
            const typesPathFromTypeVersions = typeVersionsField['.'][0]

            typesPath = path.resolve(
              process.cwd(),
              'node_modules',
              parentPackage,
              typesPathFromTypeVersions
            )
          }
        }
      }
    }

    if (!typesPath) {
      typesPath = path.resolve(
        process.cwd(),
        'node_modules',
        `@types/${packageName}`,
        'index.d.ts'
      )
    }

    try {
      return await fs.readFile(typesPath, 'utf-8')
    } catch (error) {
      console.error(
        `next-monaco: Could not find types for: ${packageName} at: ${typesPath}`,
        error
      )
    }
  } catch (error) {
    console.error(
      `next-monaco: Could not find package.json for: ${packageName}`,
      error
    )
  }

  return ''
}
