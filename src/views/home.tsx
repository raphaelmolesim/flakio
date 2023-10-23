import { MainContent } from './main_content.js'
import { LayoutPage } from './layout_page.js'
import { PrimaryButton, Header } from './basic_elements.js'
import { API, GitLabAPI } from './api.ts'
import { Alert } from './alert.tsx'
import { useEffect, useState } from 'react';
import { CredentialsPage } from './credentials_page.tsx';
import { isEmpty } from '../utils.ts';
import { useNavigate } from 'react-router-dom';
import { getEventListeners } from 'events'
import { ListJobs } from './list_jobs.tsx';

export function Home() {
  const [credential, setCredential] = useState(null);
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([]);
  let hasCredentials = (credential != null)
  
  function downloadData() {
    console.log('Call to download data.')
    const gitLabAPI = new GitLabAPI()
    gitLabAPI.fetchJobs(credential, (jobs) => {
      console.log('Jobs', jobs)
      setJobs(jobs)
    })
  }

  function showCredentialConfigPage() {
    console.log('--> Credential Config Page')
    navigate("/credentials/setup")
  }

  useEffect(() => {
    console.log('Loading main page.')
    const api = new API()
    api.fetchCredentials((credentials) => {
      console.log('Credentials', credentials)
      if (isEmpty(credentials))
        setCredential(null)
      else {
        console.log('Has credentials.', credentials[0])
        setCredential(credentials[0])
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

        <ListJobs jobs={jobs} />

        <PrimaryButton text="Donwload newer data" onClick={downloadData} disabled={!hasCredentials}></PrimaryButton>
      </MainContent>
    </LayoutPage>
  )
}