import { ConsoleOutputLogger } from '../../console_output_logger'
import { SettingsService } from '../services/settings_service'
import { useState, useEffect } from 'react'
import { useLogger } from './use_logger'

export function useSettings() {
  [settings, setSettings] = useState({})
  const logger = useLogger("useSettings")
  const settingsService = new SettingsService()

  function partiallyUpdateSettings(key, value) {
    const newSettings = { ...settings }
    newSettings[key] = value
    logger.debug(`Update the ${key}:`, newSettings)
    setSettings(newSettings)
  }

  function addBlankRule() {
    newSettings['unificationRules'].push({ jobs: [], unifiedJob: "" })
    const newSettings = { ...settings }
    logger.debug("Added a blank rule:", newSettings)
    setSettings(newSettings)
  }

  function saveSettings() {
    settingsService.update(settings, (response) => logger.info("Update: ", response.status))
  }
  
  useEffect(() => {
    settingsService.all((settingsDictonary) => {
      logger.debug("Loaded settings:", settingsDictonary)
      const defaultConfig = {
        numberOfPagesToDownload: 50,
        unificationRules: [
          { jobs: [ "rspec-tests 1/2", "rspec-tests 2/2" ], unifiedJob: "rspec-test" },
        ]
      }
      setSettings({ ...defaultConfig, ...settingsDictonary })      
    })
  }, [])

  return { settings, setSettings: partiallyUpdateSettings, addBlankRule, saveSettings }
}
