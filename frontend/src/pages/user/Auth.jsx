import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import {
  loginSchema,
  registerSchema,
} from "../../validations/UserAuthValidation";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { user, loginUser } = useUser();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: isLogin ? loginSchema : registerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const endpoint = isLogin
          ? `${import.meta.env.VITE_BACKEND_URL}/api/user/login`
          : `${import.meta.env.VITE_BACKEND_URL}/api/user/register`;

        const payload = isLogin
          ? { email: values.email, password: values.password }
          : {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
            };

        const { data } = await axios.post(endpoint, payload);

        loginUser(data.user); // ✅ Sets context and localStorage

        toast.success(
          data.message ||
            (isLogin ? "Login successful" : "Registration successful")
        );
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to AutoSphere" : "Register for AutoSphere"}
        </h2>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => alert("Google Sign-In will be handled here")}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <FcGoogle className="text-xl" />
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="h-px flex-1 bg-gray-300"></span>
          <span className="px-2 text-sm text-gray-400">or</span>
          <span className="h-px flex-1 bg-gray-300"></span>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
