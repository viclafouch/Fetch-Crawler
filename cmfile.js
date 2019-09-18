'use strict'
const cm = require('centimaitre')
const jetpack = require('fs-jetpack')
const babel = require('@babel/core')
const { promisify } = require('util')
const path = require('path')
const fs = require('fs');


const srcDir = jetpack.cwd('./src/')
const libDir = jetpack.cwd('./build/')

const srcDirExamples = jetpack.cwd('./examples/')
const libDirExamples = jetpack.cwd('./build-examples/')

const testDir = jetpack.cwd('./test/')
const testLibDir = jetpack.cwd('./build-test/')

const babelTransform = promisify(babel.transformFile)

cm.setDefaultOptions({
  sourceMaps: true
})

cm.task('clean', () => {
  libDir.dir('.', { empty: true })
})

cm.task('clean-examples', () => {
  libDirExamples.dir('.', { empty: true })
})

cm.task('clean-test', () => {
  testLibDir.dir('.', { empty: true })
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
              node: 8
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

cm.task('build-examples', ['clean-examples'], async options => {
  const rootDirPath = jetpack.path()
  const files = srcDirExamples.find({ matching: '**/*.js' })
  for (const file of files) {
    const res = await babelTransform(srcDirExamples.path(file), {
      sourceMaps: options.sourceMaps,
      sourceFileName: path.relative(rootDirPath, srcDirExamples.path(file)),
      sourceRoot: path.relative(libDirExamples.path(path.dirname(file)), rootDirPath),
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 8
            },
            useBuiltIns: false
          }
        ]
      ]
    })
    if (options.sourceMaps) {
      res.map.file = `${path.basename(file)}`
      res.code = res.code + `\n//# sourceMappingURL=${path.basename(file)}.map`
      await libDirExamples.writeAsync(file + '.map', JSON.stringify(res.map))
    }
    await libDirExamples.writeAsync(file, res.code)
  }
})

cm.task('build-test', ['clean-test'], async options => {
  const rootDirPath = jetpack.path()
  const files = testDir.find({ matching: '**/*.js' })
  for (const file of files) {
    const res = await babelTransform(testDir.path(file), {
      sourceMaps: options.sourceMaps,
      sourceFileName: path.relative(rootDirPath, testDir.path(file)),
      sourceRoot: path.relative(testLibDir.path(path.dirname(file)), rootDirPath),
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
      await testLibDir.writeAsync(file + '.map', JSON.stringify(res.map))
    }
    await testLibDir.writeAsync(file, res.code)
  }

  const fromDir = path.join(__dirname, 'test', 'server', 'pages')
  const toDir = path.join(__dirname, 'build-test', 'server', 'pages')

  if (!fs.existsSync(toDir)) fs.mkdirSync(toDir);

  fs.readdirSync(fromDir).forEach(element => {
      if (fs.lstatSync(path.join(fromDir, element)).isFile()) {
          fs.copyFileSync(path.join(fromDir, element), path.join(toDir, element));
      } else {
          copyFolderSync(path.join(fromDir, element), path.join(toDir, element));
      }
  });
})

