import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

const ViewAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getUsedCarById,
    userInfo,
    saveToWishlist,
    removeFromWishlist,
    isInWishlist,
    createConversation,
  } = useUser();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      const res = await getUsedCarById(id);
      if (res.success) {
        setAd(res.data);
        setMainImage(res.data.images?.[0]);
      }
      setLoading(false);
    };
    fetchAd();
  }, [id]);

  useEffect(() => {
    if (ad && userInfo) {
      setIsSaved(isInWishlist(ad._id));
    }
  }, [ad, userInfo]);

  const handleImageClick = (clickedImg) => {
    if (!mainImage || clickedImg.url === mainImage.url) return;
    setMainImage(clickedImg);
  };

  const toggleSave = async () => {
    if (!userInfo) {
      toast.info("Please login to save ads");
      navigate("/auth");
      return;
    }

    if (!isSaved) {
      await saveToWishlist(ad._id);
      setIsSaved(true);
    } else {
      await removeFromWishlist(ad._id);
      setIsSaved(false);
    }
  };

  const startChatWithSeller = async () => {
    if (!userInfo) {
      toast.info("Please login to chat with the seller");
      navigate("/auth");
      return;
    }

    const res = await createConversation(ad.postedBy._id, ad._id);
    if (res.success) {
      navigate(`/chat/${res.conversation._id}`);
    } else {
      toast.error(res.message || "Something went wrong!");
    }
  };

  const isOwner = userInfo?._id === ad?.postedBy?._id;

  if (loading) return <div className="text-center mt-10">Loading ad...</div>;
  if (!ad)
    return <div className="text-center mt-10 text-red-500">Ad not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          {mainImage && (
            <img
              src={mainImage.url}
              alt="main"
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          )}
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {ad.images
              ?.filter((img) => img.url !== mainImage?.url)
              .map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt="thumbnail"
                  className="w-20 h-20 object-cover rounded border cursor-pointer"
                  onClick={() => handleImageClick(img)}
                />
              ))}
          </div>

          {/* Save Ad */}
          {userInfo && !isOwner && (
            <div
              className="mt-4 flex items-center gap-2 cursor-pointer text-indigo-600"
              onClick={toggleSave}
            >
              {isSaved ? (
                <BsBookmarkFill size={20} />
              ) : (
                <BsBookmark size={20} />
              )}
              <span>{isSaved ? "Saved" : "Save Ad"}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {ad.company} {ad.model} ({ad.year})
          </h2>
          <p className="text-xl text-indigo-600 font-semibold mb-4">
            ₹ {ad.price?.toLocaleString("en-IN")}
          </p>

          <div className="space-y-2 text-gray-700 text-[15px]">
            <p>
              <span className="text-gray-600 font-medium">Kilometers Driven:</span>{" "}
              <span className="font-semibold">{ad.kilometersDriven} km</span>
            </p>
            <p>
              <span className="text-gray-600 font-medium">Fuel Type:</span>{" "}
              <span className="font-semibold">{ad.fuelType}</span>
            </p>
            <p>
              <span className="text-gray-600 font-medium">Transmission:</span>{" "}
              <span className="font-semibold">{ad.transmission}</span>
            </p>
            <p>
              <span className="text-gray-600 font-medium">Accident History:</span>{" "}
              <span className="font-semibold">{ad.accidentHistory}</span>
            </p>
            <p>
              <span className="text-gray-600 font-medium">Insurance:</span>{" "}
              <span className="font-semibold">{ad.insuranceAvailable}</span>
            </p>
            <p>
              <span className="text-gray-600 font-medium">Location:</span>{" "}
              <span className="font-semibold">
                {ad.place}, {ad.district}, {ad.state}
              </span>
            </p>
          </div>

          {ad.description && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-1">Description</h4>
              <p className="text-gray-700 whitespace-pre-wrap text-sm">
                {ad.description}
              </p>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 space-y-1">
            <p>
              Posted by:{" "}
              <span className="font-medium text-gray-700">
                {ad.postedBy?.firstName} {ad.postedBy?.lastName || ""}
              </span>
            </p>
            <p>
              Posted on:{" "}
              <span className="font-medium text-gray-700">
                {new Date(ad.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>

          {isOwner ? (
            <button
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded shadow"
              onClick={() => navigate(`/edit-used-car/${ad._id}`)}
            >
              Edit Ad
            </button>
          ) : ad.status?.toLowerCase().trim() === "sold" ? (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg text-lg font-bold text-center shadow">
              🚫 This car is already sold.
            </div>
          ) : (
            <button
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow"
              onClick={startChatWithSeller}
            >
              Chat with Seller
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAd;
