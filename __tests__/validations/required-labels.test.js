const core = require('@actions/core');
const github = require('@actions/github');
const { pullRequestHasMandatoryLabels } = require('../../src/validations/required-labels');
const { ValidationError } = require('../../src/exceptions/validation-error')

describe('validateLabels', () => {
  it('should not throw any validation error.', () => {
    const pullRequest = {
      labels: [{ name: 'bug' }, { name: 'enhancement' }]
    };
    const requiredLabels = ['bug', 'enhancement'];

    pullRequestHasMandatoryLabels(pullRequest, requiredLabels);
    expect(() => pullRequestHasMandatoryLabels(pullRequest, requiredLabels).not.toThrow(ValidationError));
  });

  it('should throw validation error.', () => {
    // Mock pullRequest with different labels
    const pullRequest = {
      labels: [{ name: 'bug' }]
    };
    const requiredLabels = ['bug', 'enhancement'];

    expect(() => pullRequestHasMandatoryLabels(pullRequest, requiredLabels).toThrow(ValidationError));
  });
});
