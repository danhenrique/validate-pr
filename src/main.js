const core = require('@actions/core')
const github = require('@actions/github')
const { pullRequestHasMandatoryLabels } = require('./validations/required-labels')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    core.info('PR Validation action started.');
    const validations = core.getInput('validations', { required: true }).replace(/\s/g, '').split(',');
    core.debug(`Validations to be performed: ${validations.join(', ')}`);

    const { context } = github;
    core.debug(`Github context founded`);
    const pr = context.payload.pull_request;
    core.info(`PR Title: ${pr.title}`);
    core.info(`PR URL: ${pr.html_url}`);

    if (!pr) {
      core.setFailed('This action must be run in a pull_request event.');
      return
    }

    for (const validation of validations) {
      switch (validation) {
        case 'required-labels':
          const requiredLabels = core.getInput('required-labels', { required: true }).replace(/\s/g, '').split(',');
          pullRequestHasMandatoryLabels(pr, requiredLabels);
          break;
        default:
          core.warning(`Unknown validation type: ${validation}`);
      }
    }

    core.info('All validations passed!');
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = { run }