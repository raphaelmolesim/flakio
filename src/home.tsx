import { FlakioLogo } from './logo.tsx'
import { Menu } from './menu.tsx'
import { MainContent } from './main_content.tsx'

export function Home() {
  return (
    <html lang="en">
      <head>
        <title>Flakio - Flaky test report</title>
        <link rel="stylesheet" href="/public/output.css" />
        <link rel="icon" href="public/flakio-icon.png" type="image/icon type"></link>
      </head>
      <body class="w-screen h-screen">
        <nav class="grid grid-rows-1 p-3 border-b">
          <FlakioLogo />
        </nav>
        <div class="grid grid-rows-1 grid-cols-8 h-[93%]">
          <aside class="border-r">
            <Menu />
          </aside>
          <main class="col-span-7 bg-gray-50">
            <MainContent />
          </main>
          </div>
      </body>
    </html>
  )
}