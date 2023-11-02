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

  private querStringPrivateToken() {
    return `private_token=${this.privateToken}`
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