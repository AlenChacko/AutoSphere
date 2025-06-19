import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Inbox = () => {
  const { getUserConversations, userInfo } = useUser();
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbox = async () => {
      const res = await getUserConversations();
      if (res.success) {
        setConversations(res.data);
      }
    };
    fetchInbox();
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Inbox</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((convo) => {
            const buyer = convo.participants.find(p => p._id !== userInfo?._id);
            const lastMsg = convo.lastMessage;

            return (
              <div
                key={convo._id}
                className="flex items-center gap-4 p-3 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/chat/${convo._id}`)}
              >
                {buyer?.profilePic?.url ? (
                  <img
                    src={buyer.profilePic.url}
                    alt={buyer.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-gray-400" />
                )}

                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {buyer?.firstName} {buyer?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {lastMsg?.text || "Image 📷"}
                  </p>
                </div>

                <div className="text-xs text-gray-400">
                  {lastMsg?.createdAt ? formatTime(lastMsg.createdAt) : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inbox;
