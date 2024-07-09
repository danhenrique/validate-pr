/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const github = require('@actions/github')
const main = require('../src/main')
const requiredLabels = require('../src/validations/required-labels')
const { ValidationError } = require('../src/exceptions/validation-error')

let inputs = {}

// Mock the GitHub Actions libraries
const infoMock = jest.spyOn(core, 'info').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const originalContext = { ...github.context }
jest.spyOn(core, 'getInput').mockImplementation(name => {
  return inputs[name]
})
// Mock the action's main function
const runMock = jest.spyOn(main, 'run')
const pullRequestHasMandatoryLabelsMock = jest.spyOn(
  requiredLabels,
  'pullRequestHasMandatoryLabels'
)

describe('running on pull request event', () => {
  beforeAll(() => {
    github.context.payload = {
      pull_request: {
        number: 1,
        title: 'Test PR',
        html_url: '',
        labels: [{ name: 'bug' }, { name: 'enhancement' }]
      }
    }
  })

  beforeEach(() => {
    inputs = {}
  })

  it('pull request with required labels w/ spaces', async () => {
    inputs = {
      validations: 'required-labels',
      'required-labels': 'bug, enhancement'
    }

    await main.run()

    expect(runMock).toHaveBeenCalledTimes(1)
    expect(infoMock).toHaveBeenCalledWith('All validations passed!')
  })

  it('pull request with required labels w/o spaces', async () => {
    inputs = {
      validations: 'required-labels',
      'required-labels': 'bug,enhancement'
    }

    await main.run()

    expect(runMock).toHaveBeenCalledTimes(1)
    expect(infoMock).toHaveBeenCalledWith('All validations passed!')
  })

  it('pull request without required labels', async () => {
    inputs = {
      validations: 'required-labels',
      'required-labels': 'tested'
    }

    //let labels = inputs['required-labels'].replace(/\s/g, '').split(',')
    await main.run()

    expect(runMock).toHaveBeenCalledTimes(1)
    expect(setFailedMock).toHaveBeenCalledWith(
      `The pull request doesn't have the required labels. Required labels missing: tested.`
    )
  })
})
