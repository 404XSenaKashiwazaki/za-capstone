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
            <div className="flex gap-2 w-full p-4">
                <div className="w-1/2">
                    <img src={ payment?.logoUrl } alt={ payment?.name } />
                </div>
                <div className="w-full">
                    <h4 className="text-lg font-bold">{ payment?.name }</h4>
                    <p className="pt-2 text-md">{ payment?.desk }</p>
                </div>
            </div>
        </Modal>
    )
}

export default Detail