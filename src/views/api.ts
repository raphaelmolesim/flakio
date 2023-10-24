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

}


export class GitLabAPI {

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


}
