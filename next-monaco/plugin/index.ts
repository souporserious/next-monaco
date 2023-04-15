import { NextConfig } from 'next'
import { resolve, join } from 'node:path'
import { tmpdir } from 'node:os'
import { writeFile } from 'node:fs/promises'
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
      const typesContents = (
        await Promise.all(types.flatMap(getTypeDeclarations))
      ).flat()
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
                  to: 'static/next-monaco/types.json',
                },
                {
                  from: resolve(process.cwd(), theme),
                  to: 'static/next-monaco/theme.json',
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

      nextConfig.env.MONACO_THEME_PATH = resolve(process.cwd(), theme)

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
