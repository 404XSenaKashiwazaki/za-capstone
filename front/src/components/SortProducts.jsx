// ProductList.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDownAlt, faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const SortProducts = ({ sortOrder, setSortOrder  }) => {
    const navigate = useNavigate()
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')    
    }

    return (
        <div className="w-full mb-3 mt-2 sm:mb-0 flex justify-end gap-3">
            <div className='flex justify-end'>
                <div>
                    <button
                        onClick={() => {
                                navigate("/")
                        }}
                        className={`w-auto bg-gradient-to-l from-purple-600 to-blue-600 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs py-1 px-4 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}
                    >
                    Semua
                    </button>
                </div>
            </div>
            <div className='flex justify-end '>
               <div>
                <button
                    className="text-xs font-medium bg-gradient-to-r w-auto from-purple-900 via-sky-600 to-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50  py-1 px-4 rounded-sm flex items-center"
                    onClick={toggleSortOrder}
                    >
                    <FontAwesomeIcon
                        icon={sortOrder === 'asc' ? faSortAmountUpAlt : faSortAmountDownAlt}
                        className="mr-2"
                    />
                    {sortOrder === 'asc' ? 'Termurah' : 'Termahal'}
                    </button>
               </div>
            </div>
        </div>
    )
}

export default SortProducts;
