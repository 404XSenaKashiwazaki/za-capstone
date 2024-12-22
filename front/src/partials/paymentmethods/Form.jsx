import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/paymentMethodsSlice"
import Modal from "../../components/Modal_"
import { useFindOnePaymentsMethodsBackQuery, useRestorePaymentsMethodsBackMutation, useStorePaymentsMethodsBackMutation, useUpdatePaymentsMethodsBackMutation } from "../../features/api/apiPaymentMethodsSlice"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const newForm = {
        name: "",
        logo: "default.jpg",
        logoUrl: "http://localhost:8000/payments/default.jpg",
        desk:"",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ payments_methods: [newForm] })
    const { data } = useFindOnePaymentsMethodsBackQuery({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdatePaymentsMethodsBackMutation()
    const [ add, { isLoading: loadingAdd } ] = useStorePaymentsMethodsBackMutation()

    useEffect(() => {
        if(data?.response?.payments_methods) setForm({ payments_methods: [{
            payments_methods_id: data.response.payments_methods.id,
            name: data.response.payments_methods.name,
            logo: data.response.payments_methods.logo,
            logoUrl: data.response.payments_methods.logoUrl,
            desk: data.response.payments_methods.desk,
            logoUrlOld: data.response.payments_methods.logoUrl,
            logoOld: data.response.payments_methods.logo,
            error: null
        }] })
    },[ data ])

    const handleChange = (e,i) => {
        e.preventDefault()
        const { name,value } = e.target
    
        const [...list] = form.payments_methods;
        list[i][name] = value
        setForm({ payments_methods: list })
    }

    
    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.payments_methods.map(val => ({...val, error: ""}))
            let msg = []
            
            if(error?.data?.errors && error?.data?.errors.length != 0){
                error.data.errors.forEach((err) => {
                    const indexErr = err.param.match(/\[([0-9]+)\]/)[1]
                    const title = err.param.match(/\.([A-Za-z]+)/)[1]
                    
                    msg.push([indexErr,err.msg])
                    const d = msg.map((filter) => {
                        if(filter[0] == indexErr) return filter[1]
                    }).filter(v=> v)

                    inpt[indexErr].error = { [title]: d  }
                
                })
            }
            setForm({ payments_methods: inpt })
        }
    }

    const handleChangeFile = (e,i) => {
        e.preventDefault()
        const files = e.target.files[0]

        const reader = new FileReader
        const [...list] = form.payments_methods
        
        if(files?.size > 5*1000*1000){
            list[i].error = {
                logo: "File yang di upload terlalu besar!"
            }
            list[i].logo = "default.jpg"
            list[i].logoUrl = "http://localhost:8000/payments/default.jpg"
            setForm({ users: list })
        }else{
            console.log(list[i].logo);
            const err = list[i].error
            list[i].logo = files
            list[i].error = { ...err, logo: null }
            console.log(list[i]);
            console.log(list[0]);
            reader.addEventListener("load", () => {
                list[i].logoUrl = reader.result
                setForm({ payments_methods: list })
            })
            if(files) reader.readAsDataURL(files)
        }  
    }


    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.payments_methods

        const newList = list.map(() => newForm)
        setForm({ payments_methods: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ payments_methods: [...form.payments_methods, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.payments_methods

        list.splice(i,1)
        setForm({ payments_methods: list })
    }

    const ButtonModal = () => {
        return (
            <div>
            { id 
                ? <>

                    <button 
                        type='button'
                        onClick={handleClickSave}
                        className='
                        bg-blue-800 py-1 px-2 rounded-sm 
                        border-0 text-white
                        h-auto text-sm w-auto
                        font-medium text-center hover:bg-blue-900 mr-1'
                        > { (loadingUpdate) ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faPlusSquare} /> Simpan</span> }
                    </button>
                </>
                : <> 
                    <button 
                        type='submit'
                        onClick={handleClickSave}
                        className='
                        bg-blue-800 py-1 px-2 rounded-sm 
                        border-0 text-white
                        h-auto text-sm w-auto
                        font-medium text-center hover:bg-blue-900 mr-1'
                        > { (loadingAdd) ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faPlusSquare} /> Tambah</span> }
                    </button>
                </>
            }
            </div>
        )
    }

    const ModalTitle = () => {
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Payments Methods </span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Payments Methods</span>
    }

    return (
        <>
        <Modal setId={setId} type="md" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
        <div className='w-full mb-7 p-4 h-auto'> 

            <div>
            { form.payments_methods.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-7 border-b-0 w-full h-2 bg-slate-600 mb-4"></div>) }
                        <div className="flex gap-2">
                            <div className="w-full">
                                <div>
                                    <img src={ item.logoUrl } alt={ item.name } className="rounded-sm w-80 h-80"/>
                                </div>
                            </div>
                            <div className="w-full flex-initial">
                                <div className="w-full mb-2">
                                    <label htmlFor="name" className="font-semibold">Nama</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange(e,index)} 
                                        value={item.name} 
                                        name="name" 
                                        id="name" 
                                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                        placeholder="Nama payment"/>
                                    <ErrorMsg message={item.error?.name || ""} />
                                </div>
                                <div className="w-full mb-2 mt-2">
                                    <label htmlFor="logo" className="font-semibold">Logo</label>
                                    <input 
                                        type="file" 
                                        onChange={(e) => handleChangeFile(e,index)} 
                                        name="logo" 
                                        id="logo" 
                                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" 
                                        placeholder="Logo payment"/>
                                    <ErrorMsg message={item.error?.logo || ""} />
                                </div>
                                <div className="w-full my-2">
                                    <label htmlFor="desk" className="font-semibold">Deskripsi</label>
                                    <textarea 
                                        onChange={(e) => handleChange(e,index)} 
                                        value={item.desk} 
                                        name="desk" 
                                        id="desk" 
                                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" 
                                        placeholder="Deskripsi Slider"/>
                                    <ErrorMsg message={item.error?.desk || ""} />
                                </div>
                                { (index != 0) && (<div className="mt-4 ">
                                <button 
                                    type='button'
                                    onClick={(e) => handleClickDeleteForm(e,index)}
                                    className='
                                    bg-red-800 py-1 px-2 rounded-sm 
                                    border-0 text-white
                                    h-auto text-sm w-auto
                                    font-medium text-center hover:bg-red-900 mr-1'
                                    > <span><FontAwesomeIcon icon={faTrash} /> Hapus</span> 
                                </button>
                                </div>) }
                                <div className="mt-4 flex justify-between gap-1 items-center">
                                { index == (form.payments_methods.length -1) && (<>
                                
                                <div>
                                { !id &&  <button 
                                    type='button'
                                    onClick={handleClickAddForm}
                                    className='
                                    bg-indigo-800 py-1 px-2 rounded-sm 
                                    border-0 text-white
                                    h-auto text-sm w-auto
                                    font-medium text-center hover:bg-indigo-900 mr-1'
                                    > <span><FontAwesomeIcon icon={faPlus} /> Tambah Form</span> 
                                </button> }
                                </div>
                                <div>
                                <button 
                                    type='button'
                                    onClick={handleClickReset}
                                    className='
                                    bg-red-800 py-1 px-2 rounded-sm 
                                    border-0 text-white
                                    h-auto text-sm w-auto
                                    font-medium text-center hover:bg-red-900 mr-1'
                                    > <span><FontAwesomeIcon icon={faRefresh} /> Reset</span> 
                                </button>
                                </div>

                                </>) }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })  }
            </div>
        </div>
        </Modal>
        </>
    ) 
}

export default Form