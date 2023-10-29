export function SyncedTestTable({tests, jobs, visible}) {  

  const reducer = (acc, job) => Object.assign(acc, { [job.jobId]: job.name } )
  const jobsMap = jobs.reduce(reducer, {})

  const groupedByJob = Object.groupBy(tests, (test) => {
    return jobsMap[test.jobId]
  })

  function rows() {
    let idx = 0
    return Object.keys(groupedByJob).map(testName => {
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={idx++}>
          <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {testName}
          </td>
          <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {groupedByJob[testName].length}
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
                Job
            </th>
            <th scope="col" className="px-6 py-3">
                # of tests downloaded
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