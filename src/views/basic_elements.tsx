export function Header({text, success=false}) {

  function successIcon() {
    return (
      <svg className="w-12 h-12 text-emerald-600 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"></path>
        <path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"></path>
      </svg>
    )
  }

  const icon = success ? successIcon() : null

  return (
    <div className="pb-5 flex">
      <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl flex items-center gap-4">{icon} {text}</h1>
    </div>
  )
}

export function PrimaryButton({text, onClick, disabled=false, size = "md" }) {
  function handleClick(e) {
    e.preventDefault()
    onClick()
  }
  const disabledClasses = "bg-blue-400 cursor-not-allowed"
  const enabledClasses = "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-200"
  const statusClasses = disabled ? disabledClasses : enabledClasses

  const sizeClasses = {
    "sm": "px-5 py-2.5 text-sm",
    "md": "px-4 py-2.5 text-xs"
  }[size]

  return (
    <button type="submit" className={`inline-flex items-center font-medium text-center text-white rounded-lg ${statusClasses} ${sizeClasses}`} disabled={disabled} onClick={handleClick}>
      { text }
    </button>
  )
}

export function Toast({kind, message}) {

  function icon() {
    return (
      <>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span className="sr-only">Check icon</span>
      </>
    )
  }

  function close() {
    document.querySelector("#toast").remove();
  }

  return (
    <div id="toast" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow fixed top-5 right-5" role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
          {icon()}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" aria-label="Close" onClick={close}>
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
      </button>
  </div>
  )
}