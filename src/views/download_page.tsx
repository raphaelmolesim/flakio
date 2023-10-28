import { LayoutPage } from "./layout_page"
import { MainContent } from "./main_content"
import { Header, PrimaryButton } from "./basic_elements"
import { useEffect, useState } from "react"
import { API, GitLabAPI } from "./api"
import { SyncTable } from "./sync_table"
import { credentialsCreate } from "../controllers/credentials_controller"
import { LoadingPage } from "./loading_page"
import { origin } from "bun"

export function DownloadPage() {
  const [credential, setCredential] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [countFetchedPages, setCountFetchedPages] = useState(0);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [tests, setTests] = useState([]);
  const maxNumberOfPages = 5
  
  const [loadingList, setLoadingList] = useState(jobs)
  const [loadingPageParams, setLoadingPageParams] = useState({
    text: 'Downloaded jobs',
    visible: true,
    maxValue: maxNumberOfPages * 20  
  })
  const [showSyncTable, setShowSyncTable] = useState(false)
  const [showSyncedPage, setShowSyncedPage] = useState(false)

  function handleSynchronizeClick() {
    const preferredJobs = [
      "flaky-tests",
      "quarantine-tests",
      "rspec-tests 2/2",
      "rspec-tests 1/2"
    ]
    console.log('Synchronizing...', preferredJobs)
    const jobData = jobs.filter((job) => {
      return preferredJobs.includes(job.name)
    }).map((job) => {
      return {
        jobId: job.id,
        name: job.name,
        status: job.status,
        finishedAt: job.finished_at,
        ref: job.ref,
        authorName: job.user.name,
        authorAvatarUrl: job.user.avatar_url,
        pipelineId: job.pipeline.id,
        pipelineUrl: job.pipeline.web_url,
        duration: job.duration,
        queueDuration: job.queued_duration,
        coverage: job.coverage
      }
    })

    setShowSyncTable(false)

    updateLoadingPageParams({
      list: [],
      text: 'Downloaded tests',
      visible: true,
      maxValue: jobData.length
    })

    console.log('Job data: ', jobData)
    const api = new API()
    
    api.syncJobs(jobData, async (response) => {
      console.log('Synced jobs.', response)
      
      const fetchedTests = []

      // TODO: Execute promises in sequence
      const promises = jobData.map((job) => {
        const jobId = job.jobId
        const gitLabApi = new GitLabAPI(credential)
        const result = gitLabApi.syncFetchFailedTests(jobId)
        //console.log('Result: ', result)
        //fetchedTests.push(result)
        return result
      })
      //
      console.log('Promisses: ', promises)
      //await Promise.all(promises)      

      const resolvePromisesSeq = async (tasks) => {
        const results = [];
        for (const task of tasks) {
          results.push(await task)
          console.log('Results: ', results)
          setLoadingList([ ...results])
        }
        return results;
      };

      const responses = await resolvePromisesSeq(promises);
      console.log('Responses: ', responses)

      console.log('All tests fetched: ', fetchedTests)
      setTests(fetchedTests)
      loadingPageParams.visible = false
      setLoadingPageParams(loadingPageParams)
      setShowSyncedPage(true)
    })
  }

  useEffect(() => {
    console.log('Loading jobs: ', countFetchedPages)
    if (countFetchedPages >= maxNumberOfPages) {
      updateLoadingPageParams({ ...loadingPageParams, visible: false})
      setShowSyncTable(true)
      return
    }

    const api = new API()
    api.fetchCredentials((credentials) => {
      setCredential(credentials[0])
      const gitLabApi = new GitLabAPI(credentials[0])
      gitLabApi.fetchJobs(credentials[0], (newJobs) => {
        const joinedJobs = [ ...jobs, ...newJobs ]
        console.log('DownloadPage Joined Jobs', joinedJobs)
        setJobs(joinedJobs)
        setLoadingList(joinedJobs)
        setCountFetchedPages(countFetchedPages + 1)        
      }, countFetchedPages + 1)
    })

  }, [countFetchedPages])

  
  function updateLoadingPageParams(params) {
    loadingPageParams.text = params.text
    loadingPageParams.visible = params.visible
    loadingPageParams.maxValue = params.maxValue
    setLoadingPageParams(loadingPageParams)
    if (params.list !== undefined)
      setLoadingList(params.list)
  }
  
    return (
      <LayoutPage>
        <MainContent>
          
          <LoadingPage 
            text={loadingPageParams.text} 
            list={loadingList} 
            visible={loadingPageParams.visible} 
            maxValue={loadingPageParams.maxValue} />

          <div className={showSyncTable ? '' : 'hidden'}>
            <Header text='Jobs avaliable to sync' />
            <SyncTable jobs={jobs} visible={showSyncTable} selectedJobsState={[selectedJobs, setSelectedJobs]} />
            <div className="flex justify-end">
              <PrimaryButton text="Synchronize" onClick={handleSynchronizeClick}></PrimaryButton>
            </div>
          </div>

          <div className={showSyncedPage ? '' : 'hidden'}>
            <Header text='Successfully downloaded Tests' success={true} />
            <p>
              Click here to see the report
            </p>
          </div>
        </MainContent>
      </LayoutPage>
    )
}