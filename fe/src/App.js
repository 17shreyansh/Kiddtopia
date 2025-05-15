import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PublicLayout from './components/PublicLayout';

import Home from './pages/Home';
import About from './pages/About';
import Parties from './pages/Parties';
import Login from './pages/Login';

import AdminLayout from './admin/adminLayout';
import Dashboard from './admin/Dashboard';
import EditHomePage from './admin/EditHomePage';

import PrivateRoute from './components/PrivateRoute';
import './App.css';
import Service from './pages/OurServices';
import Franchise from './pages/FranchiseOpportunies';
import AboutContext from './admin/EditAboutUs';
import EditParties from './admin/EditParties';
import Membership from './pages/Membership';
import ContactSection from './pages/ContactUs';
import Gallery from './pages/Gallery';
import BlogPage from './pages/Blog';
import AuthPage from './pages/CreateAccount';
import ServiceEditPage from './admin/ServiceEditPage';
import EditMembershipPlan from './admin/EditMembershipPlan';
import GalleryEdit from './admin/GalleryEdit';
import ContactLeads from './admin/contact';
import AdminFranchiseForms from './admin/franchiseforms';


function App() {
  return (
    <Router>
      
        <Routes>
          {/* Public Layout Wrapper */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/parties" element={<Parties />} />
            <Route path="/services" element={<Service />} />
            <Route path="/franchise" element={<Franchise />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/contact" element={<ContactSection />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/auth" element={<AuthPage />} />






          </Route>

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* ✅ Protected Admin Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="edit/home" element={<EditHomePage />} />
              <Route path="edit/about" element={<AboutContext />} />
              <Route path="edit/parties" element={<EditParties />} />
              <Route path="edit/services" element={<ServiceEditPage />} />
              <Route path="edit/membership" element={<EditMembershipPlan />} />
              <Route path="edit/gallery" element={<GalleryEdit />} />
              <Route path="forms/contact" element={<ContactLeads />} />
              <Route path="forms/franchise" element={<AdminFranchiseForms />} />




              


            </Route>
          </Route>
        </Routes>

      
    </Router>
  );
}

export default App;
