const _ = require('lodash')
const Octokit = require('@octokit/rest')
const octokit = new Octokit()

exports.getRepoTree = async ({ repo, owner, branch }) => {
  const refs = await octokit.git.listRefs({
    owner: owner,
    repo: repo
  })

  const branchData = _.find(refs.data, r => r.ref === branch)

  return await octokit.git.getTree({
    owner,
    repo,
    recursive: 1,
    tree_sha: branchData.object.sha
  })
}

exports.getFile = async ({ owner, repo, file_sha }) => {
  return await octokit.git.getBlob({
    owner,
    repo,
    file_sha
  })
}