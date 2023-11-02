import { Header } from "./basic_elements"
import { useState, useEffect } from "react"
import { API } from "./api"

export function SideModal({testLine}) {
  const [visible, setVisible] = useState(true)
  const [details, setDetails] = useState(null)

  useEffect(() => {
    console.log('Load data for:', testLine)
    if (!testLine) {
      setVisible(false)
      return
    } else {
      const api = new API()
      api.fetchTestDetails(testLine, (response) => {
        console.log('Job report: ', response)
        setDetails(response)
        setVisible(true)
      })
    }
  }, [testLine])

  useEffect(() => {
    console.log('Details: ', details)

  }, [details])

  const visibleClasses = visible ? '' : 'hidden'

  const errorMessages = details && details.map((detail) => {
    return detail.error_messages
  }).flat().map((error, idx) => {
    return <li className="text-xs ml-5 py-2 list-disc" key={idx}>{error.substring(0, 100)}</li>
  })
  const anotherTests = errorMessages && errorMessages.length > 5 ? `Another ${errorMessages.length - 5} errors messages was found.` : null

  return (
    <div className={`fixed top-0 right-0 bg-white w-[580px] h-screen p-10 shadow-2xl rounded-lg border-l-2 ${visibleClasses}`}>
      <div className="flex">
        <Header text="Test Details" />
        <button className="ml-auto relative -top-2" onClick={() => setVisible(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinejoin="round" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div>
        <h1 className="wrap-text text-lg">{details && details[0].name}</h1>
        <br />
        <h2>Test line</h2>
        <p className="text-xs wrap-text">{testLine}</p><br />
        <h3>Errors Messages:</h3>
        <ul>
          {
            errorMessages && errorMessages.slice(0, 5)
          }
        </ul>
        <p className="text-xs italic">{anotherTests}</p><br />
        <h3>Jobs:</h3>
        <ul>
          {
            details && details.map((detail) => {
              return (<li className="text-xs ml-5 py-2 list-disc" key={detail.job_id}>
              <a href={`https://gitlab.com/happyco/hub/-/pipelines/${detail.job_id}`} target="blank">{detail.job_id}</a>
              </li>)
            }).slice(0, 5)
          }
        </ul>
      </div>
    </div>
  )

}