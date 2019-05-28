const inquirer = require('inquirer'),
  git = require('./git'),
  book = require('./book');

(async () => {

  
  const owner = 'getify'
  const repo = 'You-Dont-Know-JS'
  const branch = 'refs/heads/master'

  const tree = (await git.getRepoTree({
    repo,
    owner,
    branch
  })).data.tree

  await book.generateBook({ owner, repo, tree, bookName: 'up & going' })
  await book.generateBook({ owner, repo, tree, bookName: 'scope & closures' })
  await book.generateBook({ owner, repo, tree, bookName: 'this & object prototypes' })
  await book.generateBook({ owner, repo, tree, bookName: 'types & grammar' })
  await book.generateBook({ owner, repo, tree, bookName: 'async & performance' })
  await book.generateBook({ owner, repo, tree, bookName: 'es6 & beyond' })
})()