import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './home';
import { CredentialsPage } from './credentials_page';
import { DownloadPage } from './download_page';
import { SyncPage } from './sync_page';
import { ReportsPage } from './reports_page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/credentials/setup" element={<CredentialsPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/jobs/sync" element={<SyncPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
) 