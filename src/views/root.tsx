import * as ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from './pages/home'
import { CredentialsPage } from './pages/credentials_page'
import { DownloadPage } from './pages/download_page/download_page'
import { SyncPage } from './pages/sync_page/sync_page'
import { ReportsPage } from './pages/reports_page/reports_page'
import { SettingsPage } from './pages/settings_page'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/credentials/setup" element={<CredentialsPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/jobs/sync" element={<SyncPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
)


