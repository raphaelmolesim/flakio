export function Header({text}) {
  return (
    <div class="pb-5 flex">
      <h1 class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">{text}</h1>
    </div>
  )
}

export function PrimaryButton({text}) {
  return (

    <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800">
        { text }
    </button>

  )
}