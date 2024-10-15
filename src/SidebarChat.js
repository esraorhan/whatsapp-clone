import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@mui/material";
import { collection, orderBy, query, onSnapshot,addDoc  } from 'firebase/firestore'; // Gerekli Firebase modüllerini içe aktarıyoruz
import db from './firebase.js';
import { Link } from "react-router-dom";
import { keyboard } from "@testing-library/user-event/dist/keyboard/index.js";

function SidebarChat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");
  useEffect(() => {
    if (id) {
        // 'rooms' koleksiyonuna erişim
        const messagesCollection = collection(db, 'rooms', id, 'messages');
        
        // 'messages' koleksiyonundaki verileri sıralama ve snapshot ile dinleme
        const messagesQuery = query(messagesCollection, orderBy('timestamp', 'desc'));
        
        // Snapshot dinleyicisi
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));
        });

        // Cleanup: Dinleyiciyi kaldırıyoruz
        return () => unsubscribe();
    }
}, [id, db]); // id veya db değiştiğinde yeniden çalıştırılacak
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = () => {
    const roomName = prompt("Please enter name for chat room");

    if (roomName) {
      try {
        // 'rooms' koleksiyonuna yeni bir doküman ekle
         addDoc(collection(db, 'rooms'), {
          name: roomName
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`} key={id}>
    
    <div className="sidebarChat">
      <Avatar src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`} />
      <div className="sidevarChat__info">
        <h2>{name}</h2>
        <p>{messages[0]?.message}</p>
      </div>
    </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Sohbet ekle</h2>
    </div>
  );
}

export default SidebarChat;
