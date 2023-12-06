import { useState } from 'react';
import { useEffect } from 'react';
import { CheckIcon, FireIcon, SafeIcon, InfoIcon } from '../../components/basic_elements';

export function TestReportTable({tests, visible, modalSM, jobName}) {
  const [modalSearchData, setModalSearchData] = modalSM

  console.log('===> Test report table: ', tests, visible, jobName)

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

  function Tootip({text, id}) {
    return (
      <div id={id} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip ">
        {text}
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    )
  }

  function showTooltip(event) {
    const tooltip = document.getElementById(event.target.dataset.tooltipTarget)
    tooltip.classList.remove('invisible')
    tooltip.classList.remove('opacity-0')
  }

  function hideTooltip(event) {
    const tooltip = document.getElementById(event.target.dataset.tooltipTarget)
    tooltip.classList.add('invisible')
    tooltip.classList.add('opacity-0')
  }

  function showTestDetails(event) {
    event.preventDefault()
    console.log('Show test details', event.target.text, jobName)
    setModalSearchData([event.target.text, jobName])
  }

  function rows() {

    if (!visible) return null;

    let idx = 0
    let executionIdx = 0
    return tests.map(test => {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds      
      const lastFailureDate = Date.parse(test["LastFailure"])
      const today = new Date()
      const daysSinceLastFailure = Math.round(Math.abs((today - lastFailureDate) / oneDay))
      
      let badge = null
      if (daysSinceLastFailure == 0 ) 
        badge = <FireIcon />
      else if (daysSinceLastFailure > 0 && daysSinceLastFailure < 7)
        badge = <InfoIcon />
      else if (daysSinceLastFailure >= 7 && daysSinceLastFailure < 14)
        badge = <CheckIcon />
      else if (daysSinceLastFailure >= 14)
        badge = <SafeIcon />

      return (
        <tr className="bg-white border-b flex" key={idx++}>
          <td scope="row" className="px-6 py-2 font-medium text-gray-900 truncate w-[45%] block">
            <a onClick={showTestDetails} data-tooltip-target={`tooltip-${idx}`} onMouseOver={showTooltip} onMouseOut={hideTooltip} className="cursor-pointer">{test["line"]}</a> 
            <Tootip text={test["line"]} id={`tooltip-${idx}`} />
          </td>
          <td className="px-6 py-2 truncate w-[10%] block flex">
            {daysSinceLastFailure}
            <div className="ml-4">
              {badge}
            </div>
          </td> 
          <td className="px-6 py-2 truncate w-[10%] block">
            {test["MR"]}
          </td>
          <td className="px-6 py-2 flex gap-2 items-center w-[35%] block">
            {test["Executions"].split(',').slice(-18, -1).map((execution) => {
              return executionIcon(statusEnum[parseInt(execution)], `${idx}=>${executionIdx++}`)
            })}
          </td>
      </tr>
      )
    })
  }
  
  return (
    <div className={`relative pb-6 mt-6 ${ visible ? '' : 'hidden' }`}>
      <table className="text-sm text-left text-gray-500 table-fixed w-full">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr className="flex">
            <th scope="col" className="px-6 py-3 w-[45%] block">
                Test Name
            </th>
            <th scope="col" className="px-6 py-3 w-[10%] block">
                # days since last failure
            </th>
            <th scope="col" className="px-6 py-3 w-[10%] block">
                # fails cross MR
            </th>
            <th scope="col" className="px-6 py-3 w-[35%] block">
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