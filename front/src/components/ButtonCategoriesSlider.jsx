import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

const ButtonCategoriesSlider = ({ categories }) => {
    const navigate = useNavigate()
    const buttons = [
        { id: 1, label: "Button 1", action: () => alert("Button 1 clicked!") },
        { id: 2, label: "Button 2", action: () => alert("Button 2 clicked!") },
        { id: 3, label: "Button 3", action: () => alert("Button 3 clicked!") },
        { id: 4, label: "Button 4", action: () => alert("Button 4 clicked!") },
        { id: 5, label: "Button 5", action: () => alert("Button 5 clicked!") },
    ]

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 4, // Number of items visible at a time
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 4,
        },
        tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 4,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3,
        },
    }

    const CustomRightArrow = ({ onClick, ...rest }) => {
        const {
          onMove,
          carouselState: { currentSlide, deviceType }
        } = rest;
        // onMove means if dragging or swiping in progress.
        return <button
            onClick={() => onClick()}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full hover:bg-opacity-80 z-0"
            >
                &#10095;
            </button>
      }
    return (
    <div className="p-0 mt-0 mb-0 sm:mt-2 sm:mb-5 w-full max-w-xl ">
        <Carousel
            responsive={responsive}
            infinite={false} // Carousel loops infinitely
            autoPlay={false} // Autoplay enabled
            autoPlaySpeed={2000} // Speed of autoplay
       
             // Enable dragging with mouse
            className="py-0 px-10 m-0 w-full "
            containerClass="carousel-container "
            customLeftArrow={<button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full hover:bg-opacity-80 z-0" 
                    >
                        &#10094;
                    </button>}
            customRightArrow={<CustomRightArrow />}
        >
        {categories.map((c) => (
            <div key={c.id} className="flex justify-center items-center gap-0">
            <button
                onClick={() => {
                        navigate("?c="+c.nama)
                }}
                className={`w-auto bg-gradient-to-l from-purple-600 to-blue-600 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs py-1 px-4 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}
            >
            { c.nama }
            </button>
            </div>
        ))}
        </Carousel>
    </div>
    )
}

export default ButtonCategoriesSlider