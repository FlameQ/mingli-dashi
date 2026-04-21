/**
 * 命理大师 - 项目结构验证测试
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', 'miniprogram')

describe('Project Structure', () => {
  describe('Core files', () => {
    const coreFiles = [
      'app.js', 'app.json', 'app.wxss', 'sitemap.json'
    ]
    coreFiles.forEach(file => {
      test(`${file} should exist`, () => {
        expect(fs.existsSync(path.join(ROOT, file))).toBe(true)
      })
    })
  })

  describe('Style files', () => {
    const styleFiles = [
      'styles/variables.wxss', 'styles/chinese-theme.wxss'
    ]
    styleFiles.forEach(file => {
      test(`${file} should exist`, () => {
        expect(fs.existsSync(path.join(ROOT, file))).toBe(true)
      })
    })
  })

  describe('Util files', () => {
    const utilFiles = [
      'utils/util.js', 'utils/date-util.js', 'utils/bazi-calculator.js'
    ]
    utilFiles.forEach(file => {
      test(`${file} should exist`, () => {
        expect(fs.existsSync(path.join(ROOT, file))).toBe(true)
      })
    })
  })

  describe('Tab pages', () => {
    const pages = ['home', 'category', 'history', 'profile']
    pages.forEach(page => {
      describe(`pages/${page}/`, () => {
        const exts = ['.json', '.js', '.wxml', '.wxss']
        exts.forEach(ext => {
          test(`${page}${ext} should exist`, () => {
            expect(fs.existsSync(path.join(ROOT, 'pages', page, `${page}${ext}`))).toBe(true)
          })
        })
      })
    })
  })

  describe('Custom tab bar', () => {
    const files = ['index.json', 'index.js', 'index.wxml', 'index.wxss']
    files.forEach(file => {
      test(`custom-tab-bar/${file} should exist`, () => {
        expect(fs.existsSync(path.join(ROOT, 'custom-tab-bar', file))).toBe(true)
      })
    })
  })

  describe('Components', () => {
    const components = ['module-card', 'result-scroll', 'chinese-border']
    components.forEach(comp => {
      describe(`components/${comp}/`, () => {
        const exts = ['.json', '.js', '.wxml', '.wxss']
        exts.forEach(ext => {
          test(`${comp}${ext} should exist`, () => {
            expect(fs.existsSync(path.join(ROOT, 'components', comp, `${comp}${ext}`))).toBe(true)
          })
        })
      })
    })
  })

  describe('Skills directory', () => {
    const skills = ['bazi', 'numerologist', 'yinyuan', 'master', 'fengshui', 'tarot', 'taibu']
    skills.forEach(skill => {
      test(`skills/${skill}/ should exist`, () => {
        expect(fs.existsSync(path.join(ROOT, 'skills', skill))).toBe(true)
      })
    })
  })

  describe('Subpackages', () => {
    const packages = [
      { name: 'package-bazi', pages: ['pages/input/input', 'pages/result/result'] },
      { name: 'package-qimen', pages: ['pages/input/input', 'pages/result/result'] },
      { name: 'package-ziwei', pages: ['pages/input/input', 'pages/result/result'] },
      { name: 'package-yinyuan', pages: ['pages/input/input', 'pages/result/result'] },
      { name: 'package-tarot', pages: ['pages/select/select', 'pages/reading/reading'] },
      { name: 'package-liuyao', pages: ['pages/input/input', 'pages/result/result'] },
      { name: 'package-fengshui', pages: ['pages/input/input', 'pages/result/result'] },
      { name: 'package-buddhism', pages: ['pages/chat/chat', 'pages/result/result'] }
    ]
    packages.forEach(pkg => {
      describe(`${pkg.name}/`, () => {
        pkg.pages.forEach(pagePath => {
          const pageName = pagePath.split('/').pop()
          const exts = ['.json', '.js', '.wxml', '.wxss']
          exts.forEach(ext => {
            test(`${pagePath}${ext} should exist`, () => {
              const fullPath = path.join(ROOT, pkg.name, `${pagePath}${ext}`)
              expect(fs.existsSync(fullPath)).toBe(true)
            })
          })
        })
      })
    })
  })
})
