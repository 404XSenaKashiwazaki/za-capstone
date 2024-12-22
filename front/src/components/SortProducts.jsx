// ProductList.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDownAlt, faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons';

const SortProducts = ({ sortOrder, setSortOrder  }) => {

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')    
    }

    return (
        <div className="mb-3 mt-2 sm:mb-0">
            <button
            className="text-xs font-medium bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center"
            onClick={toggleSortOrder}
            >
            <FontAwesomeIcon
                icon={sortOrder === 'asc' ? faSortAmountUpAlt : faSortAmountDownAlt}
                className="mr-2"
            />
            {sortOrder === 'asc' ? 'Termurah' : 'Termahal'}
            </button>
        </div>
    )
}

export default SortProducts;
