import { FlakioLogo } from './logo.js'
import { Menu } from './menu.js'

export function LayoutPage({children}){
  return (
    <div>
      <nav className="grid grid-rows-1 p-3 border-b">
        <FlakioLogo />
      </nav>
      <div className="flex flex-row h-[93%]">
        <aside className="border-r w-72 flex ">
          <Menu />
        </aside>
        <main className="bg-gray-50 flex flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}