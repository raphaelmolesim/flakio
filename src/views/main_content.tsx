import { PrimaryButton, Header } from './basic_elements.js'
import { CredentialsDatabase } from '../db/credentials.js'

function downloadData() {
  alert('Call to download data.')  
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