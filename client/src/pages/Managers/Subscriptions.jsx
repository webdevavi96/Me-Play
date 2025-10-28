import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../utils/authContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/components";
import {
  fetchSubscribedChannels,
  unSubscribe,
} from "../../services/dashBoardServices";
import Back from "../../components/Buttons/Back";

function Subscriptions() {
  const { user } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const subscriberId = user._id;
        const { data } = await fetchSubscribedChannels(subscriberId);
        setSubscriptions(data?.channels || []);
      } catch (err) {
        console.error("Failed to fetch subscriptions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [user]);


  // ✅ handle unsubscribe for a specific channel
  const unSubscribeChannel = async (channelId) => {
    if (!window.confirm("Are you sure you want to unsubscribe?")) return;

    try {
      const response = await unSubscribe(channelId);

      if (response.status === 200 || response.success) {
        // Remove unsubscribed channel from UI
        setSubscriptions((prev) =>
          prev.filter((channel) => channel._id !== channelId)
        );
      } else {
        console.error("Failed to unsubscribe", response);
        alert("Failed to unsubscribe. Please try again.");
      }
    } catch (err) {
      console.error("Error unsubscribing:", err);
      alert("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400">
        <Loader />
      </div>
    );
  }

  if (!subscriptions.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-gray-400">
        <img
          src="/images/empty-subscriptions.svg"
          alt="No subscriptions"
          className="w-64 mb-4 opacity-80"
        />
        <p className="text-lg mb-2">
          You haven’t subscribed to any channels yet.
        </p>
        <Back />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
        <h1 className="text-2xl font-bold">Manage Subscriptions</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          ← Back
        </button>
      </div>

      {/* ---------- CHANNEL GRID ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((channel) => (
          <div
            key={channel._id}
            className="bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="p-5 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                <img
                  src={channel.avatar || "/images/default-avatar.jpg"}
                  alt={channel.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
                <div>
                  <h2 className="font-semibold text-lg">{channel.fullName}</h2>
                  <p className="text-sm text-gray-400">@{channel.username}</p>
                </div>
              </div>

              <button
                onClick={() => unSubscribeChannel(channel._id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-500 transition"
              >
                Unsubscribe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;
