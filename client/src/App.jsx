import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Festival from './pages/Festival.jsx';
import Funds from './pages/Funds.jsx';
import Expenses from './pages/Expenses.jsx';
import Events from './pages/Events.jsx';
import Gallery from './pages/Gallery.jsx';
import Audio from './pages/Audio.jsx';
import Video from './pages/Video.jsx';
import Location from './pages/Location.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import LadduAuction from './pages/LadduAuction.jsx';
import LuckyDip from './pages/LuckyDip.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="festival" element={<Festival />} />
          <Route path="funds" element={<Funds />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="audio" element={<Audio />} />
          <Route path="videos" element={<Video />} />
          <Route path="location" element={<Location />} />
          <Route path="laddu-bid" element={<LadduAuction />} />
          <Route path="lucky-dip" element={<LuckyDip />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
