import { useLogger } from '../hooks/use_logger'

export class SettingsService {

  constructor() {
    this.logger = useLogger("SettingsService")
  }

  async all(callback) {
    return fetch('/api/settings').then((response) => {
      response.json().then((json) => {
        this.logger.debug("all response json >", json.settings)
        const settingsDictionary = json.settings.reduce((result, setting) => {
          result[setting.key] = setting.value
          return result
        }, {})
        return callback(settingsDictionary)
      })
    }).catch((error) => {
      logger.log('Error fetching settings', error)
    })
  }

  async update(settings, callback) {
    return fetch('/api/settings/bulk-update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ settings: settings })
    }).then((response) => {
      response.json().then((json) => {
        callback({ status: 'Ok' })
      })
    }).catch((error) => {
      logger.log('Error fetching settings', error)
    })
  }

}