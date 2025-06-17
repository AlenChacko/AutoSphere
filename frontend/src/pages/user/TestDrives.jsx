import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

const TestDrives = () => {
  const { fetchMyTestDrives } = useUser();
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const getBookings = async () => {
    const data = await fetchMyTestDrives();
    console.log("Fetched test drives:", data); // 🔍 Add this
    setTestDrives(data);
    setLoading(false);
  };

  getBookings();
}, []);


  if (loading) return <div className="p-6 text-center">Loading your bookings...</div>;

  if (testDrives.length === 0) return <div className="p-6 text-center">No test drives booked yet.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Test Drive Bookings</h2>

      {testDrives.map((drive) => (
        <div key={drive._id} className="bg-white p-4 rounded shadow space-y-1">
          <p><strong>Car:</strong> {drive.carModel}</p>
          <p><strong>Preferred Date:</strong> {new Date(drive.preferredDate).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {drive.location}</p>
          <p><strong>Status:</strong> {drive.status || "Pending"}</p>
        </div>
      ))}
    </div>
  );
};

export default TestDrives;
