export function MainContent({children}) {  
  return (
    <div className="pt-5 pr-4 flex flex-1">
      <article className="border p-6 bg-white rounded mb-4 w-full h-fit last:ml-4">
        {children}
      </article>
    </div>
  )
}