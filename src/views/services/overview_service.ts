import { useLogger } from '../hooks/use_logger'
import { JobsService } from './jobs_service'
import { SettingsService } from './settings_service'

export class OverviewService {

  constructor() {
    this.logger = useLogger("OverviewService")
    this.jobsService = new JobsService()
  }

  async numberOfTestPerJob(callback) {
    return fetch('/overview/number_of_test_per_job').then((response) => {
      response.json().then((json) => {
        callback(json)
      })
    }).catch((error) => {
      console.log('Error fetching credentials.', error)
    })
  }

  
}