import { FlakioLogo } from './logo.js'
import { Menu } from './menu.js'
import { MainContent } from './main_content.js'

export function Home() {
  return (
    <div>
      <nav className="grid grid-rows-1 p-3 border-b">
        <FlakioLogo />
      </nav>
      <div className="grid grid-rows-1 grid-cols-8 h-[93%]">
        <aside className="border-r">
          <Menu />
        </aside>
        <main className="col-span-7 bg-gray-50">
          <MainContent />
        </main>
      </div>
    </div>
  )
}