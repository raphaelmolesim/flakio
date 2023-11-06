import { MainContent } from './main_content.js'
import { LayoutPage } from './layout_page.js'
import { PrimaryButton, Header } from './basic_elements.js'
import { API, GitLabAPI } from './api.ts'
import { Alert } from './alert.tsx'
import { useEffect, useState } from 'react'
import { CredentialsPage } from './credentials_page.tsx'
import { isEmpty } from '../utils.ts';
import { useNavigate } from 'react-router-dom'
import { getEventListeners } from 'events'
import { ListJobs } from './list_jobs.tsx'
import { Modal } from './modal.js'

export function Home() {
  const [credential, setCredential] = useState('none')
  const navigate = useNavigate()
  let hasCredentials = (credential != null)
  const [showModal, setShowModal] = useState(false)
  const [lastImport, setLastImport] = useState(null)
  
  function downloadData() {
    console.log('Call to download data.')
    navigate("/download")
  }

  function showLongProcessMessage() {
    setShowModal(true)
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
        api.fetchLastImportData((lastImportData) => {
          console.log('Last import: ', lastImportData.lastDateFetched)
          setLastImport(lastImportData)
        })
      }
    })
  }, [MainContent]);

  function RenderLastImport() {
    if (lastImport != null) {
      return (
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mb-10">
          <h5 className="mb-4 text-xl font-medium">Imported data</h5>
          <div className="flex items-baseline text-gray-900">
              <span className="text-5xl font-extrabold tracking-tight">{lastImport.jobsCount}</span>
              <span className="ml-4 text-xl font-normal"> jobs</span>
          </div>
          <ul role="list" className="space-y-5 my-7">
            <li className="flex space-x-3 items-center">
              <svg className="flex-shrink-0 w-4 h-4 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"></path>
              </svg>
              <span className="text-base font-normal leading-tight">
                Last date featched: {new Date(lastImport.lastDateFetched).toDateString()}
              </span>
            </li>
          </ul>
        </div>
      )


    } else
      return <></>
  }

  return (
    <LayoutPage>
      <MainContent>
        <Header text='Welcome to Flakio!' />
        <Alert kind='warning' title="No credential has been set!" primaryAction="Configure" primaryActionOnClick={showCredentialConfigPage} className={hasCredentials ? 'hidden' : ''}>
          In order to download data from GitLab account, you need to set your credentials.
        </Alert>

        
        <RenderLastImport />

        <PrimaryButton text="Donwload newer data" onClick={showLongProcessMessage} disabled={!hasCredentials}></PrimaryButton>

      </MainContent>
      <Modal title="Are you sure?" message="In order to download the data this action may take a long time to process" stateManagement={[showModal, setShowModal]} confirmationCallback={downloadData}/>

    </LayoutPage>
  )
}