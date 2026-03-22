import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SeatsProvider } from './context/SeatsContext';
import FloorView from './pages/FloorView';
import EntranceView from './pages/EntranceView';

export default function App() {
  return (
    <BrowserRouter>
      <SeatsProvider>
        <Routes>
          <Route path="/floor-view" element={<FloorView />} />
          <Route path="/entrance-view" element={<EntranceView />} />
          <Route path="*" element={<Navigate to="/entrance-view" replace />} />
        </Routes>
      </SeatsProvider>
    </BrowserRouter>
  );
}
