import { LayoutPage } from "../../components/layout_page"
import { MainContent } from "../../components/main_content"
import { Header, PrimaryButton } from "../../components/basic_elements"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { API, GitLabAPI } from "../../services/api"
import { LoadingPage } from "../../components/loading_page";
import { SyncedTestTable } from "./synced_test_table"

export function SyncPage(prop) {
  const [showSyncedPage, setShowSyncedPage] = useState(true)
  const location = useLocation()
  const jobData = location.state.jobData
  const credential = location.state.credential
  const [jobTestData, setJobTestData] = useState([])
  const [syncedTests, setSyncedTests] = useState([])

  async function syncTestData() {
    console.log('Job data: ', jobData)
    
    const promises = jobData.map((job) => {
      const jobId = job.jobId
      const gitLabApi = new GitLabAPI(credential)
      return gitLabApi.syncFetchFailedTests(jobId)
    })
    
    const resolvePromisesSeq = async (tasks) => {
      const results = [];
      for (const task of tasks) {
        results.push(await task)
        console.log('Sequencial execution results: ', results)
        setJobTestData([ ...results])
      }
      return results;
    };
    
    const jobTestResult = await resolvePromisesSeq(promises)    
    console.log('Job test result: ', jobTestResult)
    const api = new API()

    const testData = jobTestResult.map((jobTest) =>{
      return jobTest.failedTests.map((failedTest) => {
        return {
          jobId: failedTest.jobId,
          line: failedTest.line,
          name: failedTest.name,
          errorMessages: failedTest.errorMessages
        }      
      })
    }).flat()
    console.log('---> Test data to sync: ', testData)
    await api.syncTests((testData), (response) => console.log('Synced tests with id: ', response))
    setSyncedTests(testData)

    const testRunData = jobTestResult.map((jobTest) =>{
      return {
        jobId: jobTest.jobId,
        overallStatus: jobTest.overallStatus,
        seed: jobTest.seed,
      }
    }).flat().filter((testRun) => testRun.overallStatus != null)

    console.log('---> Test run data to sync: ', testRunData)
    await api.updateJobWithTestRunData((testRunData), (response) => console.log('Synced Test Run Data'))
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
          <SyncedTestTable tests={syncedTests} jobs={jobData} visible={syncedTests.length > 0} />
        </div>
      </MainContent>
    </LayoutPage>
  )
}