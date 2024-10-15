import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import Avatar from "@mui/material/Avatar";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import { SearchOffOutlined } from "@mui/icons-material";
import SidebarChat from "./SidebarChat";
import db from './firebase.js';
import { collection, onSnapshot } from 'firebase/firestore'; // Gerekli Firebase modüllerini içe aktarıyoruz
function Sidebar() {
const [rooms,setRooms] =useState([]);
//firebase connection start
useEffect(() => {
  // 'rooms' koleksiyonuna erişim
  const roomsCollection = collection(db, 'rooms');
  //bu kısım firebase 9 sürümünde kullanılıyor eski sürümlerde collection() fonksiyonuna erişim artık mümkün değil.
  // Snapshot ile verileri dinleme
  const unsubscribe = onSnapshot(roomsCollection, (snapshot) => {
    setRooms(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }))
    );
  });

  // Cleanup: Bileşen unmount edildiğinde snapshot dinleyicisini kaldırıyoruz
  return () => unsubscribe();
}, [db]); // 'db' değiştiğinde yeniden çalıştırılacak
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
        <SearchOffOutlined/>
        <input type="text" placeholder="Search or start new chat"/>
        </div>
       
       
      </div>

      <div className="sidebar__chats">
        <SidebarChat addNewChat/>
        {rooms.map(room =>(
          <SidebarChat key={room.id} id={room.id} name={room.data.name}/>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
