import { useState } from 'react';

export function SyncTable({jobs, visible, selectedJobsState}) {
  const [selectedJobs, setSelectedJobs] = selectedJobsState

  const preferredJobs = [
    "flaky-tests",
    "quarantine-tests",
    "rspec-tests 2/2",
    "rspec-tests 1/2"
  ]

  function toogleJob(e) {
    const el = e.target
    if (el.checked)
      setSelectedJobs([...selectedJobs, el.value])
    else
      setSelectedJobs(selectedJobs.filter((job) => job != el.value))
  }

  function rows() {

    if (!visible) return null;

    const groupedByName = Object.groupBy(jobs, (job) => job.name)

    return Object.keys(groupedByName).map(jobName => {
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={jobName}>
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {jobName}
          </th>
          <td className="px-6 py-4">
            0
          </td>
          <td className="px-6 py-4">
            {groupedByName[jobName].length}
          </td>
          <td className="px-6 py-4">
            <input type="checkbox" name="sync[]" value={jobName} onChange={toogleJob} checked={preferredJobs.includes(jobName)}></input>
          </td>
      </tr>
      )
    });
  }
  
  return (
    <div className={`relative overflow-x-auto pb-6 ${ visible ? '' : 'hidden' }`}>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
                Job Name
            </th>
            <th scope="col" className="px-6 py-3">
                # of Jobs Synchroned
            </th>
            <th scope="col" className="px-6 py-3">
                # of Jobs to Sync
            </th>
            <th scope="col" className="px-6 py-3">
                Synchonize
            </th>
          </tr>
        </thead>
        <tbody>
          {rows()}
        </tbody>
      </table>
    </div>
  )
}