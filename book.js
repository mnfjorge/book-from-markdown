const _ = require('lodash')
const markdownpdf = require("markdown-pdf")
const fs = require('fs')
const git = require('./git')

const getTreeByRoot = ({ tree, root }) => {
  return _.filter(tree, t => t.path.indexOf(root) === 0 && t.path.indexOf('.md') > 0)
}

const getFinalTreeByBook = ({ tree, bookName }) => {
  let finalTree = getTreeByRoot({ tree, root: bookName })

  finalTree = _.filter(finalTree, t => t.path.indexOf('ch') >= 0)
  finalTree = _.orderBy(finalTree, t => t.path)

  return finalTree
}

exports.generateBook = async ({ owner, repo, tree, bookName }) => {
  let finalTree = getFinalTreeByBook({ tree, bookName })

  const pages = []

  for (var i in finalTree) {
    const item = finalTree[i]

    const content = (await git.getFile({
      owner, repo, file_sha: item.sha
    })).data.content

    const buff = Buffer.from(content, 'base64')

    const folder = 'temp/' + bookName

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }

    const filename = folder + '/' + i.toString() + '.md'

    fs.writeFileSync(filename, buff.toString('ascii'))
    pages.push(filename)
  }

  markdownpdf().from(pages).to('temp/' + bookName + '.pdf', () => {
    console.log('done')
  })
}