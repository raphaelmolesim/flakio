import { useState } from 'react';
import { useEffect } from 'react';

export function TestReportTable({tests, visible}) {

  console.log('===> Test report table: ', tests, visible)

  const statusEnum = {
    1: 'created', 
    2: 'pending', 
    3: 'running', 
    4: 'failed', 
    5: 'success', 
    6: 'canceled', 
    7: 'skipped', 
    8: 'waiting_for_resource', 
    9: 'manual'
  }

  function executionIcon(execution, idx) {
    const classes = 'w-4 h-4 border-solid border-2 rounded'
    if (execution === 'success')
      return (<div className={`bg-emerald-300 border-emerald-500 ${classes}`} key={idx}></div>)
    else if (execution === 'failed')
      return (<div className={`bg-red-300 border-red-500 ${classes}`} key={idx}></div>)
  }

  function rows() {

    if (!visible) return null;

    let idx = 0
    let executionIdx = 0
    return tests.map(test => {
      return (
        <tr className="bg-white border-b" key={idx++}>
          <td scope="row" className="px-6 py-2 font-medium text-gray-900 truncate">
            {test["line"]}
          </td>
          <td className="px-6 py-2 truncate">
            {test["MR"]}
          </td>
          <td className="px-6 py-2 flex gap-2 items-center">
            {test["Executions"].split(',').map((execution) => {
              return executionIcon(statusEnum[parseInt(execution)], `${idx}=>${executionIdx++}`)
            })}
          </td>
      </tr>
      )
    })
  }
  
  return (
    <div className={`relative overflow-x-auto pb-6 mt-6 ${ visible ? '' : 'hidden' }`}>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
                Test Name
            </th>
            <th scope="col" className="px-6 py-3">
                # fails cross MR
            </th>
            <th scope="col" className="px-6 py-3">
                Executions
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