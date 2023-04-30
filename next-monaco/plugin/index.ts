import { NextConfig } from 'next'
import { dirname, resolve, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'
import CopyPlugin from 'copy-webpack-plugin'
import createMDXPlugin from '@next/mdx'
import { getTypeDeclarations } from './get-type-declarations'

const withMDX = createMDXPlugin()

/** Creates a Next.js plugin that configures Monaco Editor. */
export function createMonacoPlugin({
  theme,
  types = [],
}: {
  theme: string
  types?: string[]
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
        // Override the MDX import source file to use a local set of components by default
        config.resolve.alias['next-mdx-import-source-file'] = [
          resolve(
            dirname(fileURLToPath(import.meta.url)),
            '../../plugin/mdx-components.tsx'
          ),
        ]

        if (options.isServer === false) {
          // Load Onigasm for syntax highlighting
          config.module.rules.push({
            test: /onig\.wasm$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/wasm/onigasm.wasm',
            },
          })

          // Load package type declarations and themes for Editor
          config.plugins.push(
            new CopyPlugin({
              patterns: [
                {
                  from: resolve(process.cwd(), theme),
                  to: 'static/next-monaco/theme.json',
                },
                {
                  from: typesFilePath,
                  to: 'static/next-monaco/types.json',
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

      return withMDX({
        ...nextConfig,
        experimental: {
          mdxRs: true,
          ...(nextConfig.experimental || []),
        },
        transpilePackages: [
          'next-monaco',
          ...(nextConfig.transpilePackages || []),
        ],
        pageExtensions: nextConfig.pageExtensions || ['ts', 'tsx', 'mdx'],
      })
    }
  }
}
