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
      return response.text()
    }).catch((error) => {
      console.log('[GitLabService] Error fetching job trace', error.toString())
      return this.requestWithWget(url)
    })
  }

  private querStringPrivateToken() {
    return `private_token=${this.privateToken}`
  }

  private async requestWithWget(url){
    var cmd = `wget -O tmp/trace.log ${url}`
    var child = require('child_process').execSync(cmd)
    const file = await Bun.file('tmp/trace.log').text()
    console.log('[GitLabService] Fetched job trace with wget', file)
    return file
  }

  private async fetchWithTimeout(url: string, data: any = {}) {
    const start = new Date().getSeconds();
    const timeoutTimer = 10000
    
    while (new Date().getSeconds() - start < 10) {
        try {
            const res = await fetch(url, {
              method: 'GET',
              body: JSON.stringify(data)
            })

            try {
                return await res;
            } catch (e) {
                if (res.status < 400) {
                    return res.status;
                } else {
                    throw e;
                }
            }
        } catch (e) {
            await new Promise((resolve) => {
                setTimeout(resolve, timeoutTimer);
            })
        }
    }
}
}