import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import b1 from '../../assets/images/banner/b1.jpg'
import b2 from '../../assets/images/banner/b2.jpg'
import b3 from '../../assets/images/banner/b3.jpg'
import b4 from '../../assets/images/banner/b4.jpg'
import b5 from '../../assets/images/banner/b5.jpg'

const slides = [
  {
    image: b1,
    text: "Drive the Future with AutoSphere",
  },
  {
    image: b2,
    text: "Explore the Best in New Cars",
  },
  {
    image: b3,
    text: "Find Trusted Used Cars Near You",
  },
  {
    image: b4,
    text: "Performance Meets Style",
  },
  {
    image: b5,
    text: "Your Next Ride Starts Here",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const goToNextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full h-[80vh] relative overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
              {slide.text}
            </h2>
          </div>
        </div>
      ))}

      {/* Prev Button */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 text-gray-800 p-3 rounded-full z-20 transition"
        aria-label="Previous Slide"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 text-gray-800 p-3 rounded-full z-20 transition"
        aria-label="Next Slide"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default HeroSection;
