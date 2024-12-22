import React, { useEffect, useState } from 'react'
import Modal from "../../components/Modal_"
import { useFindOneSlidersQuery } from '../../features/api/apiSlidersSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useFindOneSocialMediaQuery } from "../../features/api/apiSocialMediaSlice"

const Detail = ({ id, setId, showModal, setShowModal }) => {
    const { data } = useFindOneSocialMediaQuery({ id },{ skip: (id) ? false : true }) 
    const [ social, setSocial] = useState(null)

    useEffect(() => {
        if(data?.response?.social) setSocial(data.response.social)
    },[ data ])

    const ModalTitle = () => <span><FontAwesomeIcon icon={faSearch}/>  Detail Social Media</span>

    
    return (
        <Modal setId={setId} type="sm" title={<ModalTitle />}  button="" showModal={showModal} setShowModal={setShowModal}>
            <div className="flex gap-2 w-full p-4">
                <div className="w-1/2">
                    <FontAwesomeIcon icon={ social?.icon } />
                </div>
                <div className="w-full">
                    <h4 className="text-lg font-bold">{ social?.nama }</h4>
                    <p className="pt-2 text-md">{ social?.url }</p>
                </div>
            </div>
        </Modal>
    )
}

export default Detail