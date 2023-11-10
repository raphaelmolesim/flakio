export class API {

  async fetchCredentials(callback) {
    return fetch('/credentials').then((response) => {
      response.json().then((json) => {
        callback(json.credentials)
      })
    }).catch((error) => {
      console.log('Error fetching credentials.', error)
    })
  }

  async createCredential(credential, callback) {
    console.log('API: Creating credential', credential)
    return fetch('/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credential)
    }).then((response) => {
      response.json().then((json) => {
        callback(json.id)
      })
    }).catch((error) => {
      console.log('Error creating credential.', error)
    })
  }

  async updateCredential(credential, callback) {
    console.log('API: Updating credential', credential)
    return fetch(`/credentials/${credential.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credential)
    }).then((response) => {
      response.json().then((json) => {
        console.log('API: Updated credential', json)
        callback(json.id)
      })
    }).catch((error) => {
      console.log('Error updating credential.', error)
    })
  }

  async syncJobs(jobs, callback) {
    fetch('/sync-jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobs: jobs
      })
    }).then((response) => {
      response.json().then((json) => {
        callback(json.jobIds)
      })
    }).catch((error) => {
      console.log('Error syncing jobs.', error)
    })
  }

  async syncTests(tests, callback) {
    fetch('/sync-tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tests: tests
      })
    }).then((response) => {
      response.json().then((json) => {
        callback(json.testIds)
      })
    }).catch((error) => {
      console.log('Error syncing test.', error)
    })
  }

  async updateJobWithTestRunData(jobs, callback) {
    fetch('/jobs/update-test-run-data', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobs: jobs
      })
    }).then((response) => {
      response.json().then((json) => {
        callback(json)
      })
    }).catch((error) => {
      console.log('Error syncing test.', error)
    })
  }

  async fetchPreferredJobs(callback) {
    fetch('/preferred-jobs').then((response) => {
      response.json().then((json) => {
        callback(json)
      })
    }).catch((error) => {
      console.log('Error fetching preferred jobs.', error)
    })
  }

  async fetchTestsReport(jobName, callback) {
    const decodedJobName = encodeURI(jobName.replaceAll('/', '@slash-bar'))
    console.log('--> API: Fetching for failed tests', decodedJobName)
    fetch(`/tests/${decodedJobName.trim()}`).then((response) => {
      response.json().then((json) => {
        callback(json)
      })
    }).catch((error) => {
      console.log('Error fetching preferred jobs.', error)
    })
  }

  async fetchTestDetails(testLine, jobName, callback) {
    return fetch('/tests/details?' + new URLSearchParams({
      testLine: testLine,
      jobName: jobName
    })).then((response) => {
      response.json().then((json) => {
        callback(json)
      })
    }).catch((error) => {
      console.log('Error fetching credentials.', error)
    })
  }

  async fetchLastImportData(callback) {
    return fetch('/last-import').then((response) => {
      response.json().then((json) => {
        callback(json)
      })
    }).catch((error) => {
      console.log('Error fetching credentials.', error)
    })
  }
}


export class GitLabAPI {

  constructor(credential) {
    this.credential = credential
  }

  async fetchJobs(credential, callback, page=0) {
    console.log('API: Fetching for page', page)
    fetch('/jobs?' + new URLSearchParams({
      projectId: credential.projectId,
      apiUrl: credential.apiUrl,
      privateToken: credential.privateToken,
      page: page
    }),{
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log('API: Fetched jobs', response)
      response.json().then((json) => {
        console.log('API: Fetched jobs json', json)
        callback(json)
      })
    }).catch((error) => {
      console.log('Error fetching jobs.', error)
    })
  }

  async fetchFailedTests(jobId, callback) {
    console.log('API: Fetching for failed tests')
    fetch(`/jobs/${jobId}/failed-tests?` + new URLSearchParams({
      projectId: this.credential.projectId,
      apiUrl: this.credential.apiUrl,
      privateToken: this.credential.privateToken
    }),{
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log('API: Fetched failed tests', response)
      response.json().then((json) => {
        console.log('API: Fetched test json', json)
        callback(json)
      })
    }).catch((error) => {
      console.log('Error fetching jobs.', error)
    })
  }

  syncFetchFailedTests(jobId) {
    console.log('API: Fetching for failed tests')
    
    return fetch(`/jobs/${jobId}/failed-tests?` + new URLSearchParams({
      projectId: this.credential.projectId,
      apiUrl: this.credential.apiUrl,
      privateToken: this.credential.privateToken
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json()
    }).catch((error) => {
      console.log('Error fetching jobs.', error)
    })
  }

}
