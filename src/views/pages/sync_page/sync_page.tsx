import { LayoutPage } from "../../components/layout_page"
import { MainContent } from "../../components/main_content"
import { Header, PrimaryButton } from "../../components/basic_elements"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { API, GitLabAPI } from "../../services/api"
import { LoadingPage } from "../../components/loading_page";
import { SyncedTestTable } from "./synced_test_table"

export function SyncPage(prop) {
  const location = useLocation()
  const jobData = location.state.jobData
  const credential = location.state.credential
  const [jobTestData, setJobTestData] = useState([])

  async function syncTestData() {
    console.log('Job data: ', jobData)
    await paginatedSync(jobData)
  }

  async function paginatedSync(jobData) {
    const itemsPerPage = 30
    let numberOfPages = (jobData.length / itemsPerPage)
    if (jobData.length > (itemsPerPage * numberOfPages))
      numberOfPages++

    let currentPage = 0
    let carryOutContextArray = []
    while(currentPage <= numberOfPages) {  
      const idx_start = currentPage * itemsPerPage
      const idx_end = numberOfPages > 1 ? idx_start + itemsPerPage : jobData.length
      const promises = jobData.slice(idx_start, idx_end).map((job) => {
        const jobId = job.jobId
        const gitLabApi = new GitLabAPI(credential)
        return gitLabApi.syncFetchFailedTests(jobId)
      }) 
      console.log('Promisses: ', promises)
      
      const resolvePromisesSeq = async (tasks) => {
        const results = [];
        for (const task of tasks) {
          newResult = await task
          results.push(newResult)
          console.log('Sequencial execution results: ', results)
          setJobTestData((currentJobTestData) => {
            const updatedJobTestData = [...currentJobTestData, newResult]
            console.log('updatedJobTestData: ', updatedJobTestData)
            return updatedJobTestData
          })
        }
        return results;
      };

      const jobTestResult = await resolvePromisesSeq(promises)
      console.log('Job test result: ', jobTestResult)
      const api = new API()

      let idx = 0
      const testData = jobTestResult.map((jobTest) =>{
        console.log('-> Job test: ', jobTest, "idx: ", idx)
        idx++
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

      const testRunData = jobTestResult.map((jobTest) =>{
        return {
          jobId: jobTest.jobId,
          overallStatus: jobTest.overallStatus,
          seed: jobTest.seed,
        }
      }).flat().filter((testRun) => testRun.overallStatus != null)

      console.log('---> Test run data to sync: ', testRunData)
      await api.updateJobWithTestRunData((testRunData), (response) => console.log('Synced Test Run Data'))
      currentPage++
    }
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
        </div>
      </MainContent>
    </LayoutPage>
  )
}