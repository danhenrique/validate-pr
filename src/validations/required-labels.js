const core = require('@actions/core')
const { ValidationError } = require('../exceptions/validation-error')

function pullRequestHasMandatoryLabels(pullRequest, requiredLabels) {
  const labels = pullRequest.labels.map(label => label.name)
  core.debug(`Pull Request labels: ${labels.join(', ')}`)

  const missingLabels = requiredLabels.filter(
    requiredLabel => !labels.includes(requiredLabel.toLowerCase())
  )

  if (missingLabels.length > 0) {
    throw new ValidationError(
      `The pull request doesn't have the required labels. Required labels missing: ${missingLabels.join(', ')}.`
    )
  }
  core.info('Required labels validation passed!')
  return true
}

module.exports = { pullRequestHasMandatoryLabels }
