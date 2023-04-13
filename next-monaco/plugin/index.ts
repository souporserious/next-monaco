import { NextConfig } from 'next'
import { resolve, join } from 'node:path'
import { tmpdir } from 'node:os'
import { readFile, writeFile } from 'node:fs/promises'
import CopyPlugin from 'copy-webpack-plugin'
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

    return async () => {
      const typesContents = await Promise.all(
        types.flatMap(getTypeDeclarations)
      )
      const typesFilePath = join(tmpdir(), 'types.json')

      await writeFile(typesFilePath, JSON.stringify(typesContents))

      nextConfig.webpack = (config, options) => {
        if (options.isServer === false) {
          config.module.rules.push({
            test: /onig\.wasm$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/wasm/onigasm.wasm',
            },
          })

          config.plugins.push(
            new CopyPlugin({
              patterns: [
                {
                  from: typesFilePath,
                  to: resolve(process.cwd(), 'public/types.json'),
                },
              ],
            })
          )
        }

        if (typeof getWebpackConfig === 'function') {
          return getWebpackConfig(config, options)
        }

        return config
      }

      if (nextConfig.env === undefined) {
        nextConfig.env = {}
      }

      // Load Monaco themes
      nextConfig.env.MONACO_THEME = (
        await readFile(resolve(process.cwd(), theme), 'utf-8')
      )
        // replace single line comments with empty string
        .replace(/\/\/.*/g, '')

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
