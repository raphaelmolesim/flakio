import { LayoutPage } from "./layout_page"
import { MainContent } from "./main_content"
import { Header, PrimaryButton } from "./basic_elements"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { API, GitLabAPI } from "./api"
import { LoadingPage } from "./loading_page";

export function SyncPage(prop) {
  const [showSyncedPage, setShowSyncedPage] = useState(true)
  const location = useLocation()
  const jobData = location.state.jobData
  const credential = location.state.credential
  const [jobTestData, setJobTestData] = useState([])

  async function syncTestData() {
    console.log('Job data: ', jobData)
    const api = new API()
  
    const promises = jobData.map((job) => {
      const jobId = job.jobId
      const gitLabApi = new GitLabAPI(credential)
      return gitLabApi.syncFetchFailedTests(jobId)
    })

    console.log('Promisses: ', promises)
    const resolvePromisesSeq = async (tasks) => {
      const results = [];
      for (const task of tasks) {
        results.push(await task)
        console.log('Sequencial execution results: ', results)
        setJobTestData([ ...results])
      }
      return results;
    };

    const responses = await resolvePromisesSeq(promises);
    console.log('Responses: ', responses)
    //console.log('All tests fetched: ', fetchedTests)
    //setTests(fetchedTests)
    //loadingPageParams.visible = false
    //setLoadingPageParams(loadingPageParams)
    //setShowSyncedPage(true)
  }

  useEffect(() => {
    console.log('Loading sync page.', location)
    syncTestData() 
  }, [MainContent])

  return (
    <LayoutPage>
      <MainContent>
        <LoadingPage 
            text="Tests downloaded"
            list={jobTestData} 
            visible={jobTestData.length < jobData.length} 
            maxValue={jobData.length} />

        <div className={jobTestData.length === jobData.length ? '' : 'hidden'}>
          <Header text='Successfully downloaded Tests' success={true} />
          <p>
            Click here to see the report
          </p>
        </div>
      </MainContent>
    </LayoutPage>
  )
}