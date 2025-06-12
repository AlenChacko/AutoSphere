import React from 'react'
import Navbar from '../../components/user/Navbar'
import HeroSection from '../../components/user/HeroSection'
import PopularCars from '../../components/user/PopularCars'
import AllBrands from '../../components/user/AllBrands'
import CarSearchBar from '../../components/user/CarSearchBar'

const Home = () => {
  return (
    <div>
        
        <HeroSection/>
        <CarSearchBar/>
        <PopularCars/>
        <AllBrands/>
    </div>
  )
}

export default Home