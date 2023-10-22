import { MainContent } from './main_content.js'
import { LayoutPage } from './layout_page.js'
import { PrimaryButton, Header } from './basic_elements.js'
import { API } from './api.ts'
import { Alert } from './alert.tsx'
import { useEffect, useState } from 'react';
import { CredentialsPage } from './credentials_page.tsx';
import { isEmpty, goToPage } from '../utils.ts';


function downloadData() {
  console.log('Call to download data.')
}

function showCredentialConfigPage() {
  console.log('--> Credential Config Page')
  goToPage(<CredentialsPage />)
}

export function Home() {
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
    <LayoutPage>
      <MainContent>
        <Header text='Welcome to Flakio!' />
        <Alert kind='warning' title="No credential has been set!" primaryAction="Configure" primaryActionOnClick={showCredentialConfigPage} className={hasCredentials ? 'hidden' : ''}>
          In order to download data from GitLab account, you need to set your credentials.
        </Alert>
        <PrimaryButton text="Donwload newer data" onClick={downloadData} disabled={!hasCredentials}></PrimaryButton>
      </MainContent>
    </LayoutPage>
  )
}