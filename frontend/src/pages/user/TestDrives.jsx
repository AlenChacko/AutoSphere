import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

const TestDrives = () => {
  const { getUserTestDrives } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestDrives = async () => {
      setLoading(true);
      const { success, data, message } = await getUserTestDrives();
      if (success) {
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sorted);
        console.log("🚘 Test Drive Bookings:", sorted);
      } else {
        console.error("❌ Failed to fetch:", message);
        setBookings([]);
      }
      setLoading(false);
    };

    fetchTestDrives();
  }, [getUserTestDrives]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Test Drive Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No test drives booked yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border text-sm bg-white shadow rounded-md">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 w-56 text-left">Booking ID</th>
                <th className="p-3 w-32 text-left">Image</th>
                <th className="p-3 w-56 text-left">Car</th>
                <th className="p-3 w-32 text-left">Booked On</th>
                <th className="p-3 w-36 text-left">Preferred Date</th>
                <th className="p-3 w-24 text-left">Status</th>
                <th className="p-3 w-36 text-left">Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 break-all">{booking._id}</td>
                  <td className="p-3">
                    {booking.car?.images?.[0]?.url ? (
                      <img
                        src={booking.car.images[0].url}
                        alt={`${booking.car.company} ${booking.car.model}`}
                        className="w-24 h-16 object-cover rounded-md border"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    {booking.car?.company} {booking.car?.model}
                  </td>
                  <td className="p-3">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 capitalize">{booking.status}</td>
                  <td className="p-3">
                    {booking.assignedDate
                      ? new Date(booking.assignedDate).toLocaleDateString()
                      : <span className="text-gray-400 italic">Not assigned</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestDrives;
