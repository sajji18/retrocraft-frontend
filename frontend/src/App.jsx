import './App.css'
import Landing from './pages/Landing'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import ProducerDashboard from './pages/ProducerDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ProfileProfileDetail from './pages/ProducerProfileDetail';
import ProducerPostDetail from './pages/ProducerPostDetail';

function App() {

  return (
    <Router>
      <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/signup' element={<SignupPage/>} />
          <Route path='/signin' element={<SigninPage/>} />

          <Route path='/freelancer-dashboard' element={<FreelancerDashboard/>} />

          <Route path='/producer-dashboard' element={<ProducerDashboard/>} />
          <Route path='/producer-dashboard/profile/:username' element={<ProfileProfileDetail/>} />
          <Route path='/producer-dashboard/:jobId' element={<ProducerPostDetail/>} />

      </Routes>
    </Router>
  )
}

export default App
