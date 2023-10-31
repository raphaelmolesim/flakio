import { useState } from 'react';
import { useEffect } from 'react';

export function TestReportTable({tests, visible}) {

  console.log('===> Test report table: ', tests, visible)
  
  function rows() {

    if (!visible) return null;

    let idx = 0
    return tests.map(test => {
      return (
        <tr className="bg-white border-b" key={idx++}>
          <td scope="row" className="px-6 py-4 font-medium text-gray-900 truncate">
            {test["line"]}
          </td>
          <td className="px-6 py-4 truncate">
            {test["MR"]}
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
          </tr>
        </thead>
        <tbody>
          {rows()}
        </tbody>
      </table>
    </div>
  )
}