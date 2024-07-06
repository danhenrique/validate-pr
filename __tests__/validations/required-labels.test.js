const core = require('@actions/core');
const github = require('@actions/github');
const { pullRequestHasMandatoryLabels } = require('../../src/validations/required-labels');
const { ValidationError } = require('../../src/exceptions/validation-error')

describe('validateLabels', () => {
  it('should return true if all required labels are present', () => {
    const pullRequest = {
      labels: [{ name: 'bug' }, { name: 'enhancement' }]
    };
    const requiredLabels = ['bug', 'enhancement'];

    const result = pullRequestHasMandatoryLabels(pullRequest, requiredLabels);
    expect(result).toBe(true);
  });

  it('should return false if some required labels are missing', () => {
    // Mock pullRequest with different labels
    const pullRequest = {
      labels: [{ name: 'bug' }]
    };
    const requiredLabels = ['bug', 'enhancement'];

    pullRequestHasMandatoryLabels(pullRequest, requiredLabels);
    expect(() => pullRequestHasMandatoryLabels(pullRequest, requiredLabels)).toThrow();
  });
});
