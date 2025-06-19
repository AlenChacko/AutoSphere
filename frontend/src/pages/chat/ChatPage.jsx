import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { FaUserCircle } from "react-icons/fa";
import { PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ChatPage = () => {
  const { conversationId } = useParams();
  const {
    getConversationById,
    getMessages,
    sendMessage,
    userInfo,
  } = useUser();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const convoRes = await getConversationById(conversationId);
      if (convoRes.success) {
        setConversation(convoRes.data);
        const msgRes = await getMessages(conversationId);
        if (msgRes.success) setMessages(msgRes.data);
      }
    };
    fetchData();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ad = conversation?.ad;
  const seller = conversation?.participants?.find(
    (p) => p._id !== userInfo?._id
  );

  const adImage = ad?.images?.[0]?.url || "https://placehold.co/60x60";

  const handleSend = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    let imageUrl = null;

    // TODO: Upload image to Cloudinary here if selectedImage exists
    if (selectedImage) {
      // Example: simulate URL
      imageUrl = previewURL;
    }

    const res = await sendMessage(conversationId, newMessage.trim(), imageUrl);

    if (res.success) {
      const newMsg = {
        ...res.data,
        sender: {
          _id: userInfo._id,
          profilePic: userInfo.profilePic,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
        },
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      setSelectedImage(null);
      setPreviewURL(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[90vh]">
      {/* Header */}
      <div className="border-b pb-3 mb-3">
        <div className="flex items-center gap-2">
          {seller?.profilePic?.url ? (
            <img src={seller.profilePic.url} alt="Seller" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-9 h-9 text-gray-400" />
          )}
          <h2 className="text-xl font-semibold text-gray-800">
            {seller?.firstName} {seller?.lastName}
          </h2>
        </div>
        {ad && (
          <div className="flex gap-3 mt-2 items-center text-sm text-gray-600">
            <img src={adImage} alt="Ad" className="w-14 h-14 object-cover rounded" />
            <div>
              <p className="font-medium">{ad.model} ({ad.year})</p>
              <p className="text-indigo-600 font-bold">₹ {ad.price}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-gray-50 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet</p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender._id === userInfo?._id;
            return (
              <div key={msg._id} className={`flex items-start gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                {!isOwn && (seller?.profilePic?.url ? (
                  <img src={seller.profilePic.url} alt="Seller" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-400" />
                ))}
                <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${isOwn ? "bg-indigo-100 text-gray-800" : "bg-white text-gray-700 border"}`}>
                  {msg.image && (
                    <img src={msg.image} alt="attachment" className="mb-2 max-w-[200px] rounded" />
                  )}
                  {msg.text}
                </div>
                {isOwn && (userInfo?.profilePic?.url ? (
                  <img src={userInfo.profilePic.url} alt="You" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-400" />
                ))}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="flex flex-col gap-2 border-t pt-3">
        {/* Image preview row */}
        {previewURL && (
          <div className="relative w-fit">
            <img src={previewURL} alt="preview" className="w-24 h-24 object-cover rounded border" />
            <button
              onClick={() => {
                setSelectedImage(null);
                setPreviewURL(null);
              }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 border"
            >
              <XMarkIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {userInfo?.profilePic?.url ? (
            <img src={userInfo.profilePic.url} alt="User" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-9 h-9 text-gray-400" />
          )}

          <input
            type="text"
            placeholder="Start chat..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
          />

          {/* 📎 image upload */}
          <button onClick={triggerFileInput}>
            <PaperClipIcon className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            hidden
            onChange={handleImageSelect}
          />

          {/* send icon */}
          <button onClick={handleSend}>
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 16v4h4l10-10-4-4L4 16z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
