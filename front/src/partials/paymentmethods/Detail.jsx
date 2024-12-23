import React, { useEffect, useState } from 'react'
import Modal from "../../components/Modal_"
import { useFindOneSlidersQuery } from '../../features/api/apiSlidersSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useFindOnePaymentsMethodsBackQuery } from "../../features/api/apiPaymentMethodsSlice"

const Detail = ({ id, setId, showModal, setShowModal }) => {
    const { data } = useFindOnePaymentsMethodsBackQuery({ id },{ skip: (id) ? false : true }) 
    const [ payment, setPayment ] = useState(null)

    useEffect(() => {
        if(data?.response?.payments_methods) setPayment(data.response.payments_methods)
    },[ data ])

    const ModalTitle = () => <span><FontAwesomeIcon icon={faSearch}/>  Detail Payment Methods</span>

    return (
        <Modal setId={setId} type="sm" title={<ModalTitle />}  button="" showModal={showModal} setShowModal={setShowModal}>
            <div className="grid grid-cols-1 xs:grid-cols-[150px_1fr] gap-2 w-full p-4">
                <div className="w-full h-20 max-h-20 mb-5 p-1">
                    <img src={ payment?.logoUrl } alt={ payment?.name } className="object-contain w-full h-full"/>
                </div>
                <div className="grid grid-cols-[100px_5px_1fr] gap-2 items-center mb-1 xs:mb-2">
                    <span className="w-1/2 text-sm xs:text-md font-bold"><p >Pembayaran</p></span>:
                    <span className="w-full text-sm xs:text-md font-medium px-2"><p>{ payment?.name }</p></span>
                </div>
                <div className="grid grid-cols-[100px_5px_1fr] gap-2 items-center mb-1 xs:mb-2">
                    <span className="w-1/2 text-sm xs:text-md font-bold"><p >Deskripsi</p></span>:
                    <span className="w-full text-sm xs:text-md font-medium px-2"><p>{ payment?.desk }</p></span>
                </div>
            </div>
        </Modal>
    )
}

export default Detail