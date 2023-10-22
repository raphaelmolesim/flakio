import { PrimaryButton, Header } from './basic_elements.js'
import { API } from './api.ts'

function isEmpty(element) {
  if (element === undefined || element === null || element.length === 0)
    return true
  else
    return false
}

function downloadData() {
  console.log('Call to download data.')
  const api = new API()
  api.fetchCredentials((credentials) => {
    if (isEmpty(credentials))
    showMissingCredentialsAlert()
  else
  console.log('Has credentials.', credentials)
})
}

function showMissingCredentialsAlert() {
  console.log('No credentials.')
}

export function MainContent() {
  return (
    <div className="pt-6 px-4">
      <article className="border p-6 bg-white rounded">
        <Header text='None report to show.' />
        <PrimaryButton text="Donwload newer data" onClick={downloadData}></PrimaryButton>
      </article>
    </div>
  )
}