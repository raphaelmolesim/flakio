export class GitLabService {
  constructor(projectId, apiUrl, privateToken) {
    this.projectId = projectId;
    this.apiUrl = apiUrl;
    this.privateToken = privateToken;
  }

  public getJobs(page=0,) {
    const url = `${this.apiUrl}/projects/${this.projectId}/jobs?private_token=${this.privateToken}&page=${page}&scope[]=success&scope[]=failed`
    return fetch(url).then((response) => {
      return response.json()
    })
  }
}