export class GitLabService {
  constructor(projectId, apiUrl, privateToken) {
    this.projectId = projectId;
    this.apiUrl = apiUrl;
    this.privateToken = privateToken;
  }

  public getFinishedJobs(page=0) {
    const url = `${this.apiUrl}/projects/${this.projectId}/jobs?${this.querStringPrivateToken()}&page=${page}&scope[]=success&scope[]=failed`
    return fetch(url).then((response) => {
      return response.json()
    })
  }

  public getJobTrace(jobId) {
    const url = `${this.apiUrl}/projects/${this.projectId}/jobs/${jobId}/trace?${this.querStringPrivateToken()}`
    console.log('🦊 Fetching job trace', url)
    return fetch(url).then((response) => {
      return response.text()
    }).catch((error) => {
      console.log('🦊 Error fetching job trace', error)
    })
  }

  private querStringPrivateToken() {
    return `private_token=${this.privateToken}`
  }
}