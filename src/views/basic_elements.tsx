export function Header({text}) {
  return (
    <div className="pb-5 flex">
      <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">{text}</h1>
    </div>
  )
}

export function PrimaryButton({text, onClick, disabled=false}) {
  function handleClick(e) {
    console.log('Generic click handler.')
    onClick()
  }
  const disabledClasses = "bg-blue-400 cursor-not-allowed"
  const enabledClasses = "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-200"
  const statusClasses = disabled ? disabledClasses : enabledClasses

  return (
    <button type="submit" className={`inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white rounded-lg ${statusClasses}`} disabled={disabled} onClick={handleClick}>
      { text }
    </button>
  )
}