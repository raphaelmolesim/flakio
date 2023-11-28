import { MainContent } from '../components/main_content.js'
import { LayoutPage } from '../components/layout_page.js'
import { PrimaryButton, Header } from '../components/basic_elements.js'
import { useEffect, useState } from 'react'
import { Select } from '../components/select.js'
import { useLogger } from '../hooks/use_logger'
import { SettingsService } from '../services/settings_service.js'

export function SettingsPage() {
  const logger = useLogger("SettingsPage");
  [settings, setSettings] = useState({})
  const settingsService = new SettingsService()

  function saveSettings(event) {
    logger.debug("Saving settings:", settings)
    settingsService.update(settings, (response) => logger.info("Update: ", response.status))
  }

  useEffect(() => {
    settingsService.all((settingsDictonary) => {
      logger.debug("Loaded settings:", settingsDictonary)
      const defaultConfig = {
        numberOfPagesToDownload: 50
      }
      setSettings({ ...defaultConfig, ...settingsDictonary })
    })
  }, [MainContent])

  function updateNumberOfPagesToDownload(e) {
    const newValue = e.target.value
    const newSettings = { ...settings }
    newSettings['numberOfPagesToDownload'] = newValue
    logger.debug("Update the number of page to download: ", newSettings)
    setSettings(newSettings)
  }

  return (
    <LayoutPage>
      <MainContent>
        <Header text='Application Settings' />

        <form>
          <div className="mb-6">
            <Select id="numberOfPagesToDownload" label="# Of Pages to Download" 
              onChange={updateNumberOfPagesToDownload} selectedValue={settings['numberOfPagesToDownload']}>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="200">200</option>
              <option value="250">250</option>
              <option value="300">300</option>
            </Select>
          </div>
          <PrimaryButton text="Save" size="sm" onClick={saveSettings}/>
        </form>
      </MainContent>
    </LayoutPage>
  )
}