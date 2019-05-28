const Octokit = require('@octokit/rest')
const octokit = new Octokit()
const _ = require('lodash')
const markdownpdf = require("markdown-pdf")
const fs = require('fs')

const owner = 'getify'
const repo = 'You-Dont-Know-JS'

const getTreeByRoot = (tree, root) => {
  return _.filter(tree.tree, t => t.path.indexOf(root) === 0 && t.path.indexOf('.md') > 0)
}

const getFinalTreeByBook = (tree, bookName) => {
  finalTree = getTreeByRoot(tree.data, bookName)

  finalTree = _.filter(finalTree, t => t.path.indexOf('ch') >= 0)
  finalTree = _.orderBy(finalTree, t => t.path)

  return finalTree
}

const generateBook = async (tree, bookName) => {
  let finalTree = []
  finalTree = _.merge(finalTree, getFinalTreeByBook(tree, bookName))

  const pages = []

  for (var i in finalTree) {
    const item = finalTree[i]

    const blob = await octokit.git.getBlob({
      owner,
      repo,
      file_sha: item.sha
    })

    const buff = Buffer.from(blob.data.content, 'base64')

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

(async () => {
  const refs = await octokit.git.listRefs({
    owner: owner,
    repo: repo
  })

  const branch = _.find(refs.data, r => r.ref === 'refs/heads/master')

  const tree = await octokit.git.getTree({
    owner,
    repo,
    recursive: 1,
    tree_sha: branch.object.sha
  })

  await generateBook(tree, 'up & going')
  await generateBook(tree, 'scope & closures')
  await generateBook(tree, 'this & object prototypes')
  await generateBook(tree, 'types & grammar')
  await generateBook(tree, 'async & performance')
  await generateBook(tree, 'es6 & beyond')
})()