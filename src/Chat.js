import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import { AttachFile, MoreVert, SearchOffOutlined } from "@mui/icons-material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import { useParams } from "react-router-dom";
import db from "./firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useStateValue } from "./StateProvider";
function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
    if (roomId) {
      // 'rooms' koleksiyonunda ilgili roomId ile belgeyi getiriyoruz
      const roomDocRef = doc(db, "rooms", roomId);

      // Room adı için snapshot dinleyicisi ekliyoruz
      const unsubscribeRoom = onSnapshot(roomDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setRoomName(snapshot.data().name);
        }
      });

      // Mesajlar için 'messages' koleksiyonunu sıralıyoruz
      const messagesCollectionRef = collection(db, "rooms", roomId, "messages");
      const messagesQuery = query(
        messagesCollectionRef,
        orderBy("timestamp", "asc")
      );

      // Mesajları snapshot ile dinleme
      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });

      // Cleanup: bileşen kaldırıldığında snapshot dinleyicilerini kaldırıyoruz
      return () => {
        unsubscribeRoom(); // Room dinleyicisini temizle
        unsubscribeMessages(); // Messages dinleyicisini temizle
      };
    }
  }, [roomId, db]); // 'roomId' veya 'db' değiştiğinde yeniden çalıştırılır

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();

    addDoc(collection(db, "rooms", roomId, "messages"), {
      message: input,
      name: user.displayName,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        console.log("mesaj başarıyla eklendi.");
      })
      .catch((error) => {
        console.error("error :", error);
      });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`}
        ></Avatar>
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p> Son Görülme{" "}
              {new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toUTCString()}</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOffOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p className={`chat__message ${message.name === user.displayName && "chat__reciever"}`}>
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {" "}
              Last seen{" "}
              {new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toUTCString()}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a Message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
