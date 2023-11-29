import { useLogger } from '../hooks/use_logger'
import { SettingsService } from './settings_service'

export class JobsService {

  constructor() {
    this.logger = useLogger("JobsService")
    this.settingsService = new SettingsService()
  }

  async unifiedJobs(callback) {
    this.settingsService.all((settings) => {
      const unificationRules = settings['unificationRules'] || []
      this.preferredJobs((preferredJobs) => {
        const jobs = [ ...preferredJobs.map((jobName) => {
          const isThereARuleAboutThisJob = unificationRules.map((unificationRule) => unificationRule.jobs.includes(jobName))
          return isThereARuleAboutThisJob.includes(true) ? null : jobName
        }), ...unificationRules.map((unificationRule) => unificationRule.unifiedJob)].filter((jobName) => jobName)
        this.logger.debug('Unified jobs', jobs)
        callback(jobs)
      })
    })
  }

  async preferredJobs(callback) {
    fetch('/preferred-jobs').then((response) => {
      response.json().then((json) => {
        callback(json)
      })
    }).catch((error) => {
      console.log('Error fetching preferred jobs.', error)
    })
  }
}

