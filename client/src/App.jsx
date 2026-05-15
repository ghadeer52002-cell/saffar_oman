import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Attractions from './components/Attractions';
import Booking from './components/Booking';
import Checkout from './components/Checkout';
import History from './components/History';
import EditProfile from './components/EditProfile';

import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageSites from './components/ManageSites';
import ManageBookings from './components/ManageBookings';
import ManageReviews from './components/ManageReviews';

function App() {
  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/history" element={<History />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/sites" element={<ManageSites />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/reviews" element={<ManageReviews />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;