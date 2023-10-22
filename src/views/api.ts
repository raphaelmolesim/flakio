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

}
