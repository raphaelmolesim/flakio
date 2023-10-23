export function JobStatusBadge({kind}) {
  const kindClasses = { 
    'failed' : 'bg-red-100 text-red-800',
    'skipped' : 'bg-gray-100 text-gray-800',
    'manual' : 'bg-purple-100 text-purple-800',
    'success' : 'bg-green-100 text-green-800'
  }[kind]
  return (
      <span className={`text-sm font-medium mr-2 px-2.5 py-0.5 rounded ${kindClasses}`}>{kind}</span>
  )
}


export function ListJobs({ jobs }) {

  parseDateToString = (date) => {
    if (date === null)
      return 'Not Finished'
    let newDate = new Date(date)
    return newDate.toLocaleString('en-GB',{hour12: false})
  }

  function rows() {
    return jobs.map(job => {
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={job.id}>
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {job.name}
          </th>
          <td className="px-6 py-4">
            <JobStatusBadge kind={job.status} />
          </td>
          <td className="px-6 py-4">
            {job.ref}
          </td>
          <td className="px-6 py-4">
            {job.user.name}
          </td>
          <td className="px-6 py-4">
            {parseDateToString(job.finished_at)}
          </td>
      </tr>
      )
    });
  }

  const isVisible = jobs.length > 0

  return (
    <div className={`relative overflow-x-auto pb-6 ${ isVisible ? '' : 'hidden' }`}>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="px-6 py-3">
                      Job Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Stauts
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Merge Request
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Author
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Finished At
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