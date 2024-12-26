import React, { useEffect, useState } from "react"
import { useFindAllPaymentSupportsQuery } from "../features/api/apiPaymentSupportsSlice"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const PaymentsSupports = ()=> {
  const [ banners, setBanners ] = useState([])
  const [ currentIndex, setCurrentIndex ] = useState(0)
  const [ payments, setPayments ] = useState([])
  const { data, error } = useFindAllPaymentSupportsQuery({ perPage: 10 })

  useEffect(() => {
    if(data?.response?.payments_methods) setPayments(data.response.payments_methods)
  },[ data ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex == banners.length - 1 ? 0 : prevIndex + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners])


  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    )
  }

  const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 3, // Number of items visible at a time
    },
    desktop: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 768, min: 464 },
        items: 3,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
  }
  
  return (
    <div className="relative w-full  mx-0 overflow-hidden">
      <Carousel  
        responsive={responsive}
        infinite={true} // Carousel loops infinitely
        autoPlay={true} // Autoplay enabled
        autoPlaySpeed={4000} // Speed of autoplay
      // Show navigation arrows
        arrows={false}
        swipeable={true} // Enable swipe on touch devices
        draggable={true} // Enable dragging with mouse
        className="p-0 m-0 w-full"
        showDots={true}
        dotListClass=""
        itemClass="px-1 py-5 z-50" >
      { (payments.length > 0) && payments.map((p) => (
          <div key={p.id} className="grid grid-cols-2 p-2 gap-2 mx-1 relative  bg-white shadow-lg rounded-sm hover:scale-95 duration-100 border-gray-200">
            <img
              src={p.logoUrl}
              alt={p.name}
              className="w-20 h-20 object-fill "
            />
            <span className="ml-2 absolute -top-1 -right-1 text-sm font-light bg-gradient-to-r w-auto from-purple-500 to-blue-500 text-white px-2 py-0 bg-slate-800 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-sm">{ p.name  }</span>
            <div className="flex flex-col justify-center items-center  bg-opacity-10 text-slate-900 w-full h-full mt-2">
              <h2 className="text-sm font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap text-gray-900">{p.desk}</h2>
                <div className="text-xs mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-gray-900 flex flex-row">
      
                </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default PaymentsSupports
