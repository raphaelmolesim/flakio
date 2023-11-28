import { LayoutPage } from "../../components/layout_page"
import { MainContent } from "../../components/main_content"
import { Header, PrimaryButton } from "../../components/basic_elements"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API, GitLabAPI } from "../../services/api"
import { JobsToSync } from "./jobs_to_sync_table"
import { LoadingPage } from "../../components/loading_page"
import { SettingsService } from '../../services/settings_service'

export function DownloadPage() {
  const [credential, setCredential] = useState(null)
  const [jobs, setJobs] = useState([])
  const [countFetchedPages, setCountFetchedPages] = useState(0)
  const [selectedJobs, setSelectedJobs] = useState([])
  const [preferredJobs, setPreferredJobs] = useState([])
  const [maxNumberOfPages, setMaxNumberOfPages] = useState(null)  
  const navigate = useNavigate()

  function handleSynchronizeClick() {
    console.log('Synchronize click.', selectedJobs)
    const jobData = jobs.filter((job) => {
      return selectedJobs.includes(job.name)
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
    console.log('Selected jobs: ', jobData)
    const api = new API()
    api.syncJobs(jobData, async (response) => {
      console.log('Synced jobs.', response)
      navigate("/jobs/sync", { state: {jobData: jobData, credential: credential} })
    })
  }

  function loadPreferredJobs() {
    const api = new API()
    api.fetchPreferredJobs((preferredJobs) => {
      console.log('Preferred jobs: ', preferredJobs)
      setPreferredJobs(preferredJobs)
    })
  }

  useEffect(() => {
    if (maxNumberOfPages !== null) {
      return
    }

    const settingsService = new SettingsService()
    settingsService.all((settingsDictonary) => {
      const numberOfPagesToDownload = parseInt(settingsDictonary['numberOfPagesToDownload'])
      setMaxNumberOfPages(numberOfPagesToDownload)
    })
  }, [countFetchedPages])

  useEffect(() => {
    console.log('Loading jobs: ', countFetchedPages)

    if (countFetchedPages >= maxNumberOfPages) {
      loadPreferredJobs()
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
        setCountFetchedPages(countFetchedPages + 1)        
      }, countFetchedPages + 1)
    })
  }, [maxNumberOfPages, countFetchedPages])
  
    return (
      <LayoutPage>
        <MainContent>
          <LoadingPage 
            text="Downloaded jobs" 
            list={jobs} 
            visible={countFetchedPages < maxNumberOfPages} 
            maxValue={maxNumberOfPages * 20  } />

          <div className={countFetchedPages === maxNumberOfPages ? '' : 'hidden'}>
            <Header text='Jobs avaliable to sync' />
            <JobsToSync jobs={jobs} visible={true} selectedJobsState={[selectedJobs, setSelectedJobs]} preferredJobs={preferredJobs} />
            <div className="flex justify-end">
              <PrimaryButton text="Synchronize" onClick={handleSynchronizeClick}></PrimaryButton>
            </div>
          </div>
          
        </MainContent>
      </LayoutPage>
    )
}