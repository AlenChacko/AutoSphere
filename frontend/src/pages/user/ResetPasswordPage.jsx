import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useFormik } from "formik";
import { resetPasswordSchema } from "../../validations/UserAuthValidation"; // adjust path as needed

const ResetPasswordPage = () => {
  const { id } = useParams(); // user ID
  const { resetPassword } = useUser();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      resetPassword(id, values);
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Current Password */}
        <label className="block mb-2 font-medium">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full mb-1 px-4 py-2 border rounded-lg"
        />
        {formik.touched.currentPassword && formik.errors.currentPassword && (
          <p className="text-sm text-red-600 mb-3">
            {formik.errors.currentPassword}
          </p>
        )}

        {/* New Password */}
        <label className="block mb-2 font-medium">New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full mb-1 px-4 py-2 border rounded-lg"
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <p className="text-sm text-red-600 mb-3">
            {formik.errors.newPassword}
          </p>
        )}

        {/* Confirm Password */}
        <label className="block mb-2 font-medium">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full mb-1 px-4 py-2 border rounded-lg"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-sm text-red-600 mb-4">
            {formik.errors.confirmPassword}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
