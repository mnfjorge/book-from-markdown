const inquirer = require('inquirer'),
  git = require('./git'),
  book = require('./book');

(async () => {
  const input = await inquirer.prompt([
    {
      name: 'owner',
      type: 'input'
    }, {
      name: 'repo',
      type: 'input'
    }, {
      name: 'branch',
      type: 'input',
      default: 'master'
    }, {
      name: 'paths',
      type: 'input'
    }
  ])

  const { owner, repo, branch, paths } = input

  const tree = (await git.getRepoTree({
    repo,
    owner,
    branch
  })).data.tree

  for (var i in paths.split(',')) {
    const path = paths[i]
    console.log('Working', path)

    await book.generateBook({ owner, repo, tree, bookName: path })
  }
})()