import Layout from "./Layout.jsx";

import Welcome from "./Welcome";

import Scanner from "./Scanner";

import Collection from "./Collection";

import Profile from "./Profile";

import MyStand from "./MyStand";

import AdminWhitelist from "./AdminWhitelist";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Welcome: Welcome,
    
    Scanner: Scanner,
    
    Collection: Collection,
    
    Profile: Profile,
    
    MyStand: MyStand,
    
    AdminWhitelist: AdminWhitelist,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Welcome />} />
                
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/Scanner" element={<Scanner />} />
                
                <Route path="/Collection" element={<Collection />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/MyStand" element={<MyStand />} />
                
                <Route path="/AdminWhitelist" element={<AdminWhitelist />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}