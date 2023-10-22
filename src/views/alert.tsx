function AlertPrimaryButton({kind, text, onClick}) {
  const kindClasses ={
    'info': 'bg-blue-800 hover:bg-blue-900 focus:ring-4',
    'warning': 'bg-yellow-800 hover:bg-yellow-900 focus:ring-yellow-300'
  }[kind]

  return (
    <button type="button" className={`text-white focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center ${kindClasses}`} onClick={onClick}>
      {text}
    </button>
  )
}

function AlertSecondaryButton({kind, text, onClick}) {
  if (text === null)
    return (<></>) 
  return (
    <button type="button" className="text-blue-800 bg-transparent border border-blue-800 hover:bg-blue-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-blue-600 dark:border-blue-600 dark:text-blue-400 dark:hover:text-white dark:focus:ring-blue-800" onClick={onClick}>
      {text}
    </button>
  )
}


export function Alert({kind, text, title, primaryAction, primaryActionOnClick, secondaryAction=null, secondaryActionOnClick=null, className='', children}) {
  const kindClasses = {
    'info': 'border-blue-300 bg-blue-50 text-blue-800',
    'warning': 'border-yellow-300 bg-yellow-50 text-yellow-800'
  }[kind]
  return (
    <div id="alert-additional-content-1" className={`p-4 mb-4 border rounded-lg ${kindClasses} ${className}`} role="alert">
      <div className="flex items-center">
        <svg className="flex-shrink-0 w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">{kind}</span>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">
        {children}
      </div>
      <div className="flex">
        <AlertPrimaryButton kind={kind} text={primaryAction} onClick={primaryActionOnClick} />
        <AlertSecondaryButton kind={kind} text={secondaryAction} onClick={secondaryActionOnClick} />
      </div>
    </div>
  )
}