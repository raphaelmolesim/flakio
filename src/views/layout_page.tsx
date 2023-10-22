import { FlakioLogo } from './logo.js'
import { Menu } from './menu.js'

export function LayoutPage({children}){
  return (
    <div>
      <nav className="grid grid-rows-1 p-3 border-b">
        <FlakioLogo />
      </nav>
      <div className="grid grid-rows-1 grid-cols-8 h-[93%]">
        <aside className="border-r xl:col-span-1 lg:col-span-2 md:col-span-2 col-span-3 ">
          <Menu />
        </aside>
        <main className="xl:col-span-7 lg:col-span-6 md:col-span-6 col-span-5 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}