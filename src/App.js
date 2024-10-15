import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { useState } from "react";
import {useStateValue} from './StateProvider';
import Login from './Login';

function App() {
  const [{user}, dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
     <Login></Login>
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/rooms/:roomId" element={<Chat />} />
              <Route path="/" element={<Chat />} />
            </Routes>
          </Router>
         
        </div>
      )}
      
    </div>
  );
}

export default App;
