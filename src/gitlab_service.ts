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
    console.log('[GitLabService] Fetching job trace', url)
    return this.fetchWithTimeout(url).then((response) => {
      console.log('[GitLabService] Fetched job trace', response)
      return response.text()
    }).catch((error) => {
      console.error('[GitLabService] Error fetching job trace', error.toString())
      return this.requestWithWget(url)
    })
  }

  public getJob(jobId) {
    const params = { id: jobId }
    const url = `${this.apiUrl}/projects/${this.projectId}/jobs?${this.querStringPrivateToken(params)}`
    return this.fetchWithTimeout(url).then((response) => {
      return response.json()
    }).catch((error) => {
      console.error('[GitLabService] Error fetching job data', error.toString())
      return this.requestWithWget(url)
    })
  }

  public getPipeline(pipelineId) {
    const url = `${this.apiUrl}/projects/${this.projectId}/pipelines/${pipelineId}?${this.querStringPrivateToken()}`
    return this.fetchWithTimeout(url).then((response) => {
      return response.json()
    }).catch((error) => {
      console.error('[GitLabService] Error fetching pipeline data', error.toString())
      return this.requestWithWget(url)
    })
  }

  public getUser() {
    const url = `${this.apiUrl}/user?${this.querStringPrivateToken()}`
    return this.fetchWithTimeout(url).then((response) => {
      return response.json()
    }).catch((error) => {
      console.error('[GitLabService] Error fetching user data', error.toString())
      return this.requestWithWget(url)
    })
  }

  public getPipelines(status, username) {
    const params = {
      status: status,
      username: username
    }
    const url = `${this.apiUrl}/projects/${this.projectId}/pipelines?${this.querStringPrivateToken(params)}`
    return this.fetchWithTimeout(url).then((response) => {
      return response.json()
    }).catch((error) => {
      console.error('[GitLabService] Error fetching user data', error.toString())
      return this.requestWithWget(url)
    })
  }

  private querStringPrivateToken(additionalParams = {}) {
    const privateToken = { private_token: this.privateToken }
    return new URLSearchParams({ ...privateToken, ...additionalParams }).toString()
  }

  private async requestWithWget(url){
    console.log('[GitLabService] Fetching job trace with wget', url)
    var cmd = `wget -O tmp/trace.log ${url}`
    var child = require('child_process').execSync(cmd)
    const file = await Bun.file('tmp/trace.log').text()
    console.log('[GitLabService] Fetched job trace with wget')
    return file
  }

  private async fetchWithTimeout(url: string, data: any = {}) {
    const start = new Date().getSeconds();
    const timeoutTimer = 4000
    
    while (new Date().getSeconds() - start < 10) {
      try {
        const res = await fetch(url)

        try {
          return await res;
        } catch (e) {
          console.error("Error in fetch with timeout", e)
          if (res.status < 400) {
              return res.status;
          } else {
              throw e;
          }
        }
      } catch (e) {
        console.error("Error in fetch with timeout 2", e)
        await new Promise((resolve) => {
          setTimeout(resolve, timeoutTimer);
        })
      }
    }
  }
}