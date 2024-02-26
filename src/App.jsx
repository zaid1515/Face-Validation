
import CamPage from './pages/CamPage/CamPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CamPage history={history} />} />
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;
