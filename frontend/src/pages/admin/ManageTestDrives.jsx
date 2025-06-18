import React, { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";

const ManageTestDrives = () => {
  const { fetchTestDrives, testDrives, updateTestDriveStatus } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const loadTestDrives = async () => {
      await fetchTestDrives();
      setLoading(false);
    };
    loadTestDrives();
  }, []);

  const handleUpdateChange = (id, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdateSubmit = async (id) => {
    const update = updates[id];
    if (!update) return;

    setSubmitting((prev) => ({ ...prev, [id]: true }));

    const res = await updateTestDriveStatus(id, update);

    if (res.success) {
      await fetchTestDrives();
      setUpdates((prev) => ({ ...prev, [id]: {} }));
    }

    setSubmitting((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-3xl font-semibold mb-6 text-blue-700">
        🚗 Manage Test Drive Bookings
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading test drive bookings...</p>
      ) : testDrives?.length === 0 ? (
        <p className="text-gray-600">No test drive bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-3 px-4 border-b">Booking ID</th>
                <th className="py-3 px-4 border-b">User Name</th>
                <th className="py-3 px-4 border-b">Location</th>
                <th className="py-3 px-4 border-b">Car</th>
                <th className="py-3 px-4 border-b">Preferred Date</th>
                <th className="py-3 px-4 border-b">Booked On</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Assign Date</th>
                <th className="py-3 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {testDrives.map((booking) => (
                <tr key={booking._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {booking._id}
                  </td>
                  <td className="py-3 px-4">
                    {booking.firstName} {booking.lastName}
                  </td>
                  <td className="py-3 px-4">
                    {booking.location?.district}, {booking.location?.state} -{" "}
                    {booking.location?.pin}
                  </td>
                  <td className="py-3 px-4">
                    {booking.car?.company} {booking.car?.model}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={updates[booking._id]?.status || booking.status}
                      onChange={(e) =>
                        handleUpdateChange(
                          booking._id,
                          "status",
                          e.target.value
                        )
                      }
                      className="border px-2 py-1 rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="date"
                      value={
                        updates[booking._id]?.assignedDate ||
                        (booking.assignedDate
                          ? new Date(booking.assignedDate)
                              .toISOString()
                              .split("T")[0]
                          : "")
                      }
                      onChange={(e) =>
                        handleUpdateChange(
                          booking._id,
                          "assignedDate",
                          e.target.value
                        )
                      }
                      className="border px-2 py-1 rounded-md"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleUpdateSubmit(booking._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50"
                      disabled={submitting[booking._id]}
                    >
                      {submitting[booking._id] ? "Updating..." : "Update"}
                    </button>
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

export default ManageTestDrives;
