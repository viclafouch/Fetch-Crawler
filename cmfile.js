'use strict'
const cm = require('centimaitre')
const jetpack = require('fs-jetpack')
const babel = require('@babel/core')
const { promisify } = require('util')
const path = require('path')

const srcDir = jetpack.cwd('./src/')
const libDir = jetpack.cwd('./build/')

const babelTransform = promisify(babel.transformFile)

cm.setDefaultOptions({
  sourceMaps: true
})

cm.task('clean', () => {
  libDir.dir('.', { empty: true })
})

cm.task('build', ['clean'], async options => {
  const rootDirPath = jetpack.path()
  const files = srcDir.find({ matching: '**/*.js' })
  for (const file of files) {
    const res = await babelTransform(srcDir.path(file), {
      sourceMaps: options.sourceMaps,
      sourceFileName: path.relative(rootDirPath, srcDir.path(file)),
      sourceRoot: path.relative(libDir.path(path.dirname(file)), rootDirPath),
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 10
            },
            useBuiltIns: false
          }
        ]
      ]
    })
    if (options.sourceMaps) {
      res.map.file = `${path.basename(file)}`
      res.code = res.code + `\n//# sourceMappingURL=${path.basename(file)}.map`
      await libDir.writeAsync(file + '.map', JSON.stringify(res.map))
    }
    await libDir.writeAsync(file, res.code)
  }
})