import { ConsoleOutputLogger } from "../console_output_logger"
const logger = new ConsoleOutputLogger("info", "SettingsController")

export const settingsIndex = async ({ settingsDb }) => {
  const settings = await settingsDb().all()
  logger.debug("Settings Index:", settings)
  const tranformedSettings = settings.map((settings) => {
    return {
      "id" : settings.id,
      "key" : settings.key,
      "value" : settings.value,
      "createdAt" : settings.created_at,
      "updatedAt" : settings.updated_at
    }
  })
  return {
    settings: tranformedSettings
  }
}

export const settingsCreate = async ({ settingsDb, body }) => {
  const newSettings = { key: body.key, value: body.value }
  logger.info('Creating settings', body, newSettings)
  const id = await settingsDb().create(newSettings)
  return id
}

export const settingsUpdate = async ({ settingsDb, body }) => {
  logger.info('Updating settings', body)
  await settingsDb().update(body.key, body.value)
  return body
}

export const settingsBulkUpdate = async ({ settingsDb, body }) => {
  logger.info('Bulk updating settings', body.settings)
  const settings = await settingsDb().all()
  const settingsKeyAlreadyPresent = settings.map((setting) => setting.key)
  logger.info("settingsKeyAlreadyPresent", settingsKeyAlreadyPresent)
  for (const [key, value] of Object.entries(body.settings)) {  
    if (settingsKeyAlreadyPresent.includes(key))
      await settingsDb().update(key, value)
    else
      await settingsDb().create({ key, value })
  }
  return { status: 'Ok' }
}