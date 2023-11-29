import { useState, useEffect } from 'react'
import { API } from '../services/api.js'
import { PrimaryButton } from '../components/basic_elements'

export function RulesList({rules, setRules}) {   
  [jobs, setJobs] = useState([])
  
  useEffect(() => {
    const api = new API()
    api.fetchPreferredJobs((preferredJobs) => {
      console.log('Preferred jobs: ', preferredJobs)
      setJobs(preferredJobs)
    })
  }, [])

  if (rules === null || rules === undefined) {
    return null
  }

  function deleteRule(e) {
    const newRules = rules.filter((rule, idx) => {
      return idx !== parseInt(e.target.closest("li").dataset.id)
    })
    setRules(newRules)
  }

  function updateRule(e) {
    const newRules = rules.map((rule, idx) => {
      const parentLi = e.target.closest("li.parent-li")
      if (idx === parseInt(parentLi.dataset.id)) {
        return {
          unifiedJob: parentLi.querySelector("input[type=text]").value,
          jobs: [...parentLi.closest("ul").querySelectorAll("input[type=checkbox]:checked")]
            .map((checkbox) => checkbox.value)
        }
      } else {
        return rule
      }
    })
    setRules(newRules)
  }

  return (
    <ul id="rules-list">
      {                
        (rules).map((rule, idx) => {
          return (
            <li key={`rule-${idx}`} data-id={idx} className="mt-2 parent-li border border-b border-gray-200 dark:border-gray-600 py-2 px-4">
              <div className="flex items-center">
                <label className="flex-none text-xs font-medium text-gray-900 dark:text-gray-300">Unified job name:</label> 
                <input type='text' defaultValue={rule.unifiedJob} className="flex-1 py-0 px-0 ml-3 mr-3 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer " onChange={updateRule} />
                <PrimaryButton text="Delete" onClick={deleteRule} kind="danger" size="xs" />
              </div>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white my-2">
                {
                  jobs.map((job, jobIdx) => {
                    const checkboxId = `rule-${idx}-${jobIdx}`
                    const checked = rule.jobs.includes(job)
                    return (
                      <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600" key={checkboxId}>
                        <div className="flex items-center ps-3">
                          <input id={checkboxId} type="checkbox" value={job} defaultChecked={checked} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" onChange={updateRule} />
                          <label htmlFor={checkboxId} className="w-full py-2 ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">{job}</label>
                        </div>
                      </li>
                    )
                })
              }
            </ul>

            </li>
          )
        })
      }
    </ul>
  )
}