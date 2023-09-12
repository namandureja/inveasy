import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvoiceView from './pages/invoices';
import Home from './pages/home-view';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoice" element={<InvoiceView />} />
      </Routes>
    </Router>
  );
}

export default App;

