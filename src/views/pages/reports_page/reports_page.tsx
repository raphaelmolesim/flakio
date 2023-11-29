import { Header, PrimaryButton, ButtonGroup, ButtonGroupElement } from "../../components/basic_elements"
import { MainContent } from "../../components/main_content"
import { LayoutPage } from "../../components/layout_page"
import { useEffect, useState } from "react"
import { API } from "../../services/api"
import { TestReportTable } from "./test_report_table"
import { SideModal } from "./side_modal"
import { JobsService } from "../../services/jobs_service"
import { useLogger } from "../../hooks/use_logger"

export function ReportsPage() {
  const [credential, setCredential] = useState(null)
  const [preferredJobs, setPreferredJobs] = useState([])
  const [tests, setTests] = useState([])
  const [modalSearchData, setModalSearchData] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const logger = useLogger("ReportPage")

  function loadCredential(callback) {
    const api = new API()
    api.fetchCredentials((credentials) => {
      logger.debug(credentials)
      if (credentials.length != 1)
        throw new Error('There should be only one credential.', credentials)
      setCredential(credentials[0])
      callback(credential, api)
    })
  }

  useEffect(() => {
    loadCredential((credential, api) => {
      const jobsService = new JobsService()
      logger.debug('Credential: ', credential)
      jobsService.unifiedJobs((unifiedJobs) => {
        logger.info('Unified jobs: ', unifiedJobs)
        setPreferredJobs(unifiedJobs)
      })
    })
  }, [])

  function handleClick(event, job) {
    logger.info('Click /', job, '/')
    setSelectedJob(job)
    const api = new API()
    api.fetchTestsReport(job, (response) => {
      logger.info('Job report: ', response)
      setTests(response)
    })
  }

  return (
    <LayoutPage>
      <MainContent>
        <Header text="Reports" />

        <p>
          Select the jobs that you want to see the report.
        </p>

        <div className="mt-4">
          <ButtonGroup>
            {
              preferredJobs.sort().map((job) => {
                return <ButtonGroupElement key={job} onClick={event => handleClick(event, job)}>{job}</ButtonGroupElement>
              })
            }
          </ButtonGroup>
        </div>

        <TestReportTable tests={tests} visible={tests.length > 0} modalSM={[modalSearchData, setModalSearchData]} jobName={selectedJob}/>

        <SideModal modalSM={[modalSearchData, setModalSearchData]} />
      </MainContent>
    </LayoutPage>
  )

}