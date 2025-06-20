import { useState } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaEnvelope,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logoutUser, unreadCount } = useUser();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const profileImage = user?.profilePic || null;

  return (
    <nav className="w-full bg-white shadow-md px-4 md:px-6 py-6 relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-4xl font-bold cursor-pointer group">
          <span className="text-blue-600 group-hover:text-red-600 transition duration-300">
            Auto
          </span>
          <span className="text-red-600 group-hover:text-blue-600 transition duration-300">
            Sphere
          </span>
        </Link>

        {/* Hamburger Icon */}
        <button
          onClick={toggleMobileMenu}
          className="text-3xl text-gray-700 md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-lg">
          {user && (
            <Link
              to="/sell-car"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              SELL CARS
            </Link>
          )}

          <Link
            to="/used-cars"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            USED CARS
          </Link>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search cars..."
              className="px-4 py-2 outline-none text-sm"
            />
            <button className="bg-blue-600 p-2 text-white">
              <FaSearch />
            </button>
          </div>

          {user && (
            <Link
              to="/inbox"
              className="relative flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <FaEnvelope />
              Inbox
              {unreadCount > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <FaUserCircle size={28} />
                )}
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <div className="space-y-1">
            {user && (
              <Link
                to="/sell-car"
                className="block px-2 py-1 hover:bg-gray-100 text-sm text-gray-700"
              >
                SELL CARS
              </Link>
            )}

            <Link
              to="/used-cars"
              className="block px-2 py-1 hover:bg-gray-100 text-sm text-gray-700"
            >
              USED CARS
            </Link>

            <Link
              to="/inbox"
              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 hover:text-blue-600"
            >
              <FaEnvelope />
              Inbox
              {unreadCount > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 hover:text-blue-600 w-full"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <FaUserCircle size={28} />
                  )}
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    <Link
                      to="/profile"
                      className="block px-2 py-1 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-2 py-1 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="block px-2 py-1 hover:bg-gray-100 text-sm text-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
