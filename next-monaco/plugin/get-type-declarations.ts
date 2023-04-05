import fs from 'node:fs/promises'
import path from 'node:path'
import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'
import { builtinModules } from 'module'

async function getPackageJson(packagePath) {
  const packageJsonContent = await fs.readFile(packagePath, 'utf-8')
  return JSON.parse(packageJsonContent)
}

function getAllDependencies(packageJson) {
  return Object.keys(packageJson.dependencies ?? {}).concat(
    Object.keys(packageJson.peerDependencies ?? {})
  )
}

async function findTypesPathFromTypeVersions(
  packageJson,
  parentPackage,
  submodule
) {
  if (!packageJson.typesVersions) return null

  const typeVersionsField = packageJson.typesVersions['*']
  if (!typeVersionsField) return null

  const typesPathsFromTypeVersions = typeVersionsField[submodule]
  if (!typesPathsFromTypeVersions) return null

  for (const candidatePath of typesPathsFromTypeVersions) {
    try {
      const typesPath = path.resolve(
        process.cwd(),
        'node_modules',
        parentPackage,
        candidatePath
      )

      await fs.access(typesPath)
      return typesPath
    } catch {
      // Ignore and continue with the next candidate path
    }
  }

  return null
}

async function findTypesPath(packageJson, parentPackage, submodule) {
  const typesField = packageJson.types || packageJson.typings
  if (!submodule && typesField) {
    return path.resolve(
      process.cwd(),
      'node_modules',
      parentPackage,
      typesField
    )
  }

  if (submodule) {
    const typesPath = await findTypesPathFromTypeVersions(
      packageJson,
      parentPackage,
      submodule
    )
    if (typesPath) return typesPath
  }

  return path.resolve(
    process.cwd(),
    'node_modules',
    `@types/${parentPackage}`,
    'index.d.ts'
  )
}

/** Fetches the types for a locally installed NPM package. */
export async function getTypeDeclarations(packageName) {
  const [orgOrParent, parentPackageOrSubmodule, submoduleCandidate] =
    packageName.split('/')
  const isOrgPackage = orgOrParent.startsWith('@')
  const parentPackage = isOrgPackage
    ? `${orgOrParent}/${parentPackageOrSubmodule}`
    : orgOrParent
  const submodule = isOrgPackage ? submoduleCandidate : parentPackageOrSubmodule
  const parentPackagePath = path.resolve(
    process.cwd(),
    'node_modules',
    parentPackage,
    'package.json'
  )

  try {
    const packageJson = await getPackageJson(parentPackagePath)
    const allDependencies = getAllDependencies(packageJson)

    const typesPath = await findTypesPath(packageJson, parentPackage, submodule)

    try {
      const bundle = await rollup({
        input: path.resolve('./node_modules/', packageName, typesPath),
        plugins: [dts({ respectExternal: true })],
        external: (id) => allDependencies.concat(builtinModules).includes(id),
      })
      const result = await bundle.generate({})

      return result.output[0].code
    } catch (error) {
      console.error(
        `next-monaco: Could not find types for "${packageName}"`,
        error
      )
    }
  } catch (error) {
    console.error(
      `next-monaco: Could not find package.json for "${packageName}"`,
      error
    )
  }

  return ''
}
