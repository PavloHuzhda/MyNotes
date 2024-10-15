import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateNotePage from "./pages/CreateNotePage";
import UpdateNotePage from "./pages/UpdateNotePage";
//import 'antd/dist/antd.css';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreateNotePage />} />
                <Route path="/update/:id" element={<UpdateNotePage />} />
            </Routes>
        </Router>
    );
};

export default App;