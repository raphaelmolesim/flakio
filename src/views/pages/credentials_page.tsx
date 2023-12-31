import { MainContent } from '../components/main_content.js'
import { LayoutPage } from '../components/layout_page.js'
import { Header, PrimaryButton, Toast } from '../components/basic_elements.js'
import { API } from '../services/api.js'
import { isEmpty } from '../../utils.js';
import { useEffect, useState } from 'react';

export function CredentialsPage() {
  const [credential, setCredential] = useState(null);
  const [toast, setToast] = useState(null);
  const api = new API()
  
  function handleSubmit(e) {
    const projectId = document.getElementById('project-id').value
    const apiUrl = document.getElementById('api-url').value
    const privateToken = document.getElementById('private-token').value
    console.log('Submit credentials.', projectId, apiUrl, privateToken)
    
    if (credential === null) {
      api.createCredential({
        projectId: projectId,
        apiUrl: apiUrl,
        privateToken: privateToken
      }, (id) => {
        console.log('Created credential.', id)
        setToast(<Toast kind='success' message='Credential saved.' />)
        setCredential({
          id: id,
          projectId: projectId,
          apiUrl: apiUrl,
          privateToken: privateToken
        })
      })
    } else {
      console.log('Updating credential id:', credential.id)
      api.updateCredential({
        id: credential.id,
        projectId: projectId,
        apiUrl: apiUrl,
        privateToken: privateToken
      }, (id) => {
        console.log('Updated credential.', id)
        setToast(<Toast kind='success' message='Credential saved.' />)
        setCredential({
          id: id,
          projectId: projectId,
          apiUrl: apiUrl,
          privateToken: privateToken
        })
      })
    }
  }

  useEffect(() => {
    console.log('Loading credentials page.')
   
    api.fetchCredentials((credentials) => {
      if (isEmpty(credentials))
        setCredential(null)
      else {
        setCredential(credentials[0])
        console.log('Loaded credentials: ', credentials[0])
      }
    })
  }, [MainContent]);

  useEffect(() => {
    if (isEmpty(credential))
      return
    console.log('Loading credentials into the fields', credential)
    document.getElementById('project-id').value = credential.projectId
    document.getElementById('api-url').value = credential.apiUrl
    document.getElementById('private-token').value = credential.privateToken
  }, [credential]);

  return (
    <LayoutPage>
      <MainContent>
        <Header text="Credentials" />
        
        <form>
          <div className="mb-6">
            <label htmlFor="project-id" className="block mb-2 text-sm font-medium text-gray-900">Project Id</label>
            <input type="text" id="project-id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700" placeholder="GitLab Project Id" required />
          </div>
          <div className="mb-6">
            <label htmlFor="api-url" className="block mb-2 text-sm font-medium text-gray-900">Base Url</label>
            <input type="text" id="api-url" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700" placeholder="https://gitlab.com/api/v4" required />
          </div>
          <div className="mb-6">
            <label htmlFor="private-token" className="block mb-2 text-sm font-medium text-gray-900">Private Token</label>
            <input type="text" id="private-token" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700" placeholder="your private token" required />
          </div>
          <PrimaryButton text="Submit" onClick={handleSubmit} size="sm"/>
        </form>
        {toast}
      </MainContent>
    </LayoutPage>
  )
}