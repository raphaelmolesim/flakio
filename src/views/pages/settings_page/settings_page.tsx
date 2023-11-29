import { MainContent } from '../../components/main_content.js'
import { LayoutPage } from '../../components/layout_page.js'
import { PrimaryButton, AlternativeButton, Header } from '../../components/basic_elements.js'
import { useEffect, useState } from 'react'
import { Select } from '../../components/select.js'
import { useLogger } from '../../hooks/use_logger.js'
import { SettingsService } from '../../services/settings_service.js'
import { API } from '../../services/api.js'
import { RulesList } from './rules-list.js'
import { useSettings } from '../../hooks/use_settings.js'

export function SettingsPage() {
  const logger = useLogger("SettingsPage");
  const { settings, setSettings, addBlankRule, saveSettings } = useSettings()

  function saveClick(event) {
    logger.debug("Saving settings:", settings)
    saveSettings()
  }

  function updateNumberOfPagesToDownload(e) {
    const newValue = e.target.value
    setSettings('numberOfPagesToDownload', newValue)
  }

  function setRules(rules) {
    setSettings('unificationRules', rules)
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
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Unify jobs
            </label>
            <span className="italic text-xs font-medium text-gray-900 dark:text-gray-300 block mb-2">(You can merge jobs in the report, this is usefull when you have parrallel tests for intance)</span>
            <AlternativeButton text="Add unification rule" onClick={addBlankRule}></AlternativeButton>
            <RulesList rules={settings['unificationRules']} setRules={setRules} />
          </div>
          <PrimaryButton text="Save" size="sm" onClick={saveClick}/>
        </form>
      </MainContent>
    </LayoutPage>
  )
}