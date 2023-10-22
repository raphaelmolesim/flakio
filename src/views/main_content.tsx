export function MainContent({children}) {  
  return (
    <div className="pt-6 px-4">
      <article className="border p-6 bg-white rounded">
        {children}
      </article>
    </div>
  )
}