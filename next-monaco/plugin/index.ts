import { NextConfig } from 'next'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { getTypeDeclarations } from './get-type-declarations'

/** Creates a Next.js plugin that configures Monaco Editor. */
export function createMonacoPlugin({
  theme,
  types,
}: {
  theme: string
  types: string[]
}) {
  return function withMonaco(nextConfig: NextConfig = {}) {
    const getWebpackConfig = nextConfig.webpack

    nextConfig.webpack = (config, options) => {
      config.module.rules.push({
        test: /onig\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/onigasm.wasm',
        },
      })

      if (typeof getWebpackConfig === 'function') {
        return getWebpackConfig(config, options)
      }

      return config
    }

    return async () => {
      if (nextConfig.env === undefined) {
        nextConfig.env = {}
      }

      // Load Monaco themes
      nextConfig.env.MONACO_THEME = (
        await readFile(resolve(process.cwd(), theme), 'utf-8')
      )
        // replace single line comments with empty string
        .replace(/\/\/.*/g, '')

      // Load library type declarations
      const typesContents = await Promise.all(
        types.map(async (type) => ({
          code: await getTypeDeclarations(type),
          path: `file:///node_modules/${type}/index.d.ts`,
        }))
      )

      nextConfig.env.MONACO_TYPES = JSON.stringify(typesContents)

      return {
        transpilePackages: [
          'next-monaco/editor',
          ...(nextConfig.transpilePackages ?? []),
        ],
        ...nextConfig,
      }
    }
  }
}
