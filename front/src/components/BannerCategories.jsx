import React, { useEffect, useState } from "react";
import { useShowSlidersQuery } from "../features/api/apiSlidersSlice";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"
import { useFindAllCategoriesFrontQuery } from "../features/api/apiCategoriesSlice";
import { useNavigate } from "react-router-dom";

const BannerCategories = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const { data: dataCategories } = useFindAllCategoriesFrontQuery();

    useEffect(() => {
        if (dataCategories?.response?.categories) setBanners(dataCategories.response.categories);
    }, [dataCategories]);

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    }

    

    if (banners.length === 0) return <></>;

    return (
        <div className="relative w-full mx-0 overflow-hidden mt-1">
            <Carousel
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={5000}
                keyBoardControl={true}
                arrows={false}
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px"
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="min-w-full flex-shrink-0 px-20 py-1">
                        <button
                            onClick={() => {
                                navigate("?c=" + banner.nama);
                            }}
                            className="w-auto bg-gradient-to-l from-purple-600 to-blue-600 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs py-1 px-4 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        >
                            {banner.nama}
                        </button>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default BannerCategories;
