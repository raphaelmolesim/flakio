import { PrimaryButton, Header } from './basic_elements.js'
import { API } from './api.ts'
import { Alert } from './alert.tsx'
import { useEffect, useState } from 'react';

function isEmpty(element) {
  if (element === undefined || element === null || element.length === 0)
    return true
  else
    return false
}

function downloadData() {
  console.log('Call to download data.')
}

function showCredentialConfigPage() {
  console.log('--> Credential Config Page')
}

export function MainContent() {
  const [hasCredentials, setHasCredentials] = useState(null);  

  useEffect(() => {
    console.log('Loading main page.')
    const api = new API()
    api.fetchCredentials((credentials) => {
      if (isEmpty(credentials))
        setHasCredentials(false)
      else {
        setHasCredentials(true)
        console.log('Has credentials.', credentials)
      }
    })
  }, [MainContent]);

  
  return (
    <div className="pt-6 px-4">
      <article className="border p-6 bg-white rounded">
        <Header text='Welcome to Flakio!' />
        <Alert kind='info' title="No credential has been set!" primaryAction="Configure" primaryActionOnClick={showCredentialConfigPage} className={hasCredentials ? 'hidden' : ''}>
          In order to download data from GitLab account, you need to set your credentials.
        </Alert>
        <PrimaryButton text="Donwload newer data" onClick={downloadData} disabled={!hasCredentials}></PrimaryButton>
      </article>
    </div>
  )
}