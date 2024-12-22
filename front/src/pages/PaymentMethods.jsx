import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setIsRestore, setMessage} from '../features/paymentMethodsSlice'
import Table from '../partials/paymentmethods/Table'
import TableHeader from '../components/TableHeader'
import { Toast} from '../utils/sweetalert'
import { createBrowserHistory } from 'history'
import ButtonPagination from '../components/ButtonPagination'
import Add from "../partials/paymentmethods/Form"
import Detail from '../partials/paymentmethods/Detail'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag, faMoneyBills, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons'
import {
    useFindAllPaymentsMethodsBackQuery,
    useDestroyPaymentsMethodsBackMutation,
    useRestorePaymentsMethodsBackMutation
} from "../features/api/apiPaymentMethodsSlice"

function PaymentMethods({ site }) {
    const dispatch = useDispatch()
    const selectPerpage = [
        {label: 5, value: 5},
        {label: 25, value: 25},
        {label: 50, value: 50},
        {label: 100, value: 100}
    ]
    const selector = useSelector(state=>state.paymentMethods)
    const { isRestore, message } = selector
    const storagePerpage = localStorage.getItem("cms_perpage_paymentMethods") || 5
    const [ perPage,setPerPage ] = useState(selectPerpage.filter(sl=> sl.value == parseInt(storagePerpage))[0].value)    
    const [ page, setPage ] = useState(1)
    const [ checkedAll, setCheckedAll ] = useState(false)
    const [ search, setSearch ] = useState("")
    const [ checkedId, setCheckedId ] = useState(null)
    const [ id, setId ] = useState(null)
    const [ showModal, setShowModal ] = useState(false)
    const [ showModalDetail, setShowModalDetail ] = useState(false)
    const [ type, setType ] = useState("add")
    const [ data, setData ] = useState([])
    const [ options, setOptions ] = useState({})
    const { data: dataPaymentMethods,isError, isLoading, error } = useFindAllPaymentsMethodsBackQuery({ restores: isRestore, search, page, perPage },{ refetchOnMountOrArgChange: isRestore})
    const [ destroyMultipel ] = useDestroyPaymentsMethodsBackMutation()
    const [ restoreMultipel ] = useRestorePaymentsMethodsBackMutation()
    const sites = useSelector(state=> state.sites)
    const histosy = createBrowserHistory()

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message])

    useEffect(() => {
        if(dataPaymentMethods?.response){
            const { payments_methods, ...options} = dataPaymentMethods.response
            setData(payments_methods)
            setOptions(options)
        }
    },[ dataPaymentMethods ])


    if(isError) return <div className="bg-red-600 text-slate-200 p-1 font-medium">{ error }</div>
    if(isLoading) return <div className="bg-sky-600 text-slate-200 p-1 font-medium">request....</div>

    const handleClikPaginate = (op) => {
        const { selected } = op
        setPage(selected + 1)
        
        setCheckedId(null)
        setCheckedAll(false)
        localStorage.setItem("cms_page_paymentMethods",selected + 1)
    }

    const handleClickAddForm = (e) => {
        e.stopPropagation()
        setShowModal(true)
    } 

    return (
        <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
            <Helmet>
                <title>{ site } - Slider</title>
            </Helmet>
            
            { (showModal) && <Add showModal={showModal} setShowModal={setShowModal} setId={setId} id={id}/> }
            { (showModalDetail) && <Detail showModal={showModalDetail} setShowModal={setShowModalDetail} setId={setId} id={id}/> }
            {/* table header */}
                <TableHeader 
                    title={<span className="text-md"><FontAwesomeIcon icon={faMoneyBills} /> Payment Methods</span>}
                    type="modal"
                    pageName="paymentMethods"
                    search={search}
                    setCheckedAll={setCheckedAll}
                    setCheckedId={setCheckedId}
                    setPerPage={setPerPage}
                    perPage={perPage} 
                    setPage={setPage}
                    setSearch={setSearch}
                    selectPerpage={selectPerpage}
                    fetchDataDestroyAll={destroyMultipel}
                    datas={data}
                    setIsRestore={setIsRestore}
                    isRestore={isRestore}
                    fetchDataRestoreAll={restoreMultipel}
                    checkedId={checkedId}
                    handleClickBtnAdd={handleClickAddForm}
                    setMessage={setMessage}
                />
            {/* end table header */}
            {/* table */}
                <Table 
                    data={data}
                    setType={setType}
                    setShowModal={setShowModal}
                    checkedAll={checkedAll}
                    setCheckedAll={setCheckedAll}
                    setCheckedId={setCheckedId}
                    destroy={destroyMultipel}
                    restore={restoreMultipel}
                    setPage={setPage}
                    checkedId={checkedId}
                    isRestore={isRestore}
                    setId={setId}
                    setMessage={setMessage}
                    setShowModalDetail={setShowModalDetail}
                />
            {/* end table */}
            {/* pagination */}
            { data.length > 0 ? 
                <>
                    <ButtonPagination 
                    data={data} 
                    page={options.page}
                    totalsPage={options.totalsPage}
                    perPage={options.perPage}
                    totals={options.totals}
                    handleClikPaginate={handleClikPaginate}
                    />
                </> 
                : <>
                    <div className="bg-red-800 text-slate-200 p-2 w-full">Tidak ada data</div>
                </>
            }
            {/* end pagination */}
        </div>
    )
}

export default PaymentMethods