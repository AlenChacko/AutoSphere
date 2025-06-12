import { useState } from "react";
import { FaSearch, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="w-full bg-white shadow-md px-4 md:px-6 py-6 relative z-50"> {/* Increased padding */}
  <div className="flex items-center justify-between">
    {/* Logo */}
    <Link to={"/"} className="text-4xl font-bold cursor-pointer group"> {/* Increased text size */}
      <span className="text-blue-600 group-hover:text-red-600 transition duration-300">
        Auto
      </span>
      <span className="text-red-600 group-hover:text-blue-600 transition duration-300">
        Sphere
      </span>
    </Link>

    {/* Hamburger Icon (Mobile Only) */}
    <button
      onClick={toggleMobileMenu}
      className="text-3xl text-gray-700 md:hidden focus:outline-none"
    >
      {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
    </button>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center space-x-8 text-lg"> {/* Slightly increased spacing and font */}
      <Link to="/new-cars" className="text-gray-700 hover:text-blue-600 font-medium">
        New Cars
      </Link>
      <Link to="/used-cars" className="text-gray-700 hover:text-blue-600 font-medium">
        Used Cars
      </Link>

      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search cars..."
          className="px-4 py-2 outline-none text-sm" // increased padding
        />
        <button className="bg-blue-600 p-2 text-white">
          <FaSearch />
        </button>
      </div>

      <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
        Contact
      </Link>
      <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
        About
      </Link>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
        >
          <FaUserCircle size={28} /> {/* Slightly larger icon */}
          <span className="font-medium">John Doe</span>
        </button>

        {isDropdownOpen && (
         <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
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
              onClick={() => alert("Logging out")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="md:hidden mt-4 space-y-4">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search cars..."
          className="px-4 py-2 outline-none text-sm w-full"
        />
        <button className="bg-blue-600 p-2 text-white">
          <FaSearch />
        </button>
      </div>

      <div className="space-y-1 border-t pt-3">
        <Link to="/profile" className="block px-2 py-1 hover:bg-gray-100 text-sm text-gray-700">
          Profile
        </Link>
        <Link to="/wishlist" className="block px-2 py-1 hover:bg-gray-100 text-sm text-gray-700">
          Wishlist
        </Link>
        <button
          onClick={() => alert("Logging out")}
          className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm text-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )}
</nav>
  );
};

export default Navbar;
