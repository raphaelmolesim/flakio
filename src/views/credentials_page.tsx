import { MainContent } from './main_content.js'
import { LayoutPage } from './layout_page.js'
import { Header } from './basic_elements.js'

export function CredentialsPage() {
  return (
    <LayoutPage>
      <MainContent>
          <Header text="Credentials" />
      </MainContent>
    </LayoutPage>
  )
}