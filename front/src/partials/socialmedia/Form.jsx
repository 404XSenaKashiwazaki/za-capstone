import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faHashtag, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/SocialMediaSlice"
import Modal from "../../components/Modal_"
import { useFindOneSocialMediaQuery, useStoreMultipelSocialMediaMutation, useUpdateMultipelSocialMediaMutation } from "../../features/api/apiSocialMediaSlice"
import { faFacebook, faGoogle, faInstagram, faPinterest, faTelegram, faTwitter,faWhatsapp } from '@fortawesome/free-brands-svg-icons'


const Form = ({ id, setId, showModal, setShowModal }) => {
    const icon = ["facebook","twitter","instagram","telegram","google","pinterest","hashtag","whatsapp"]
    const newForm = {
        nama: "",
        url: "",
        icon: "hashtag",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ socialMedia: [newForm] })
    const { data } = useFindOneSocialMediaQuery({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdateMultipelSocialMediaMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreMultipelSocialMediaMutation()

    useEffect(() => {
        if(data?.response?.social) setForm({ socialMedia: [{
            social_id: data.response.social.id,
            nama: data.response.social.nama,
            url: data.response.social.url,
            icon: data.response.social.icon,
            error: null
        }] })
    },[ data ])

    const handleChange = (e,i,type="input",single=false) => {
        const { name,value, checked } = e.target
        const list = form.socialMedia

        if(type == "input") list[i][name] = value 
        if(type == "checkbox") {
            if(single && checked) {
                list[i][name] = value
            }else{
                let values = [...list[i][name],value]
                if(checked){
                    values = values.filter((f,fi) => values.indexOf(f) == fi) 
                }else{
                    values = values.filter((f,fi) => f != value)
                }
                list[i][name] = (single) ? "" : values
            }
        }

        setForm({ socialMedia: list })
    }
    
    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            setId(null)
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.socialMedia.map(val => ({...val, error: ""}))
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
            setForm({ socialMedia: inpt })
        }
    }

    const IconType = (type) => {
        let icon = faHashtag
        switch (type.toLowerCase()) {
            case "facebook":
                icon = faFacebook
                break
            case "twitter":
                icon = faTwitter
                break
            case "x":
                icon = faTwitter
                break
            case "instagram":
                icon = faInstagram
                break
            case "telegram":
                icon = faTelegram
                break
            case "google":
                icon = faGoogle
                break
            case "pinterest":
                icon = faPinterest
                break
            case "whatsapp":
                icon = faWhatsapp
                break
            default:
                icon = faHashtag
                break
        }
        return icon
    }

    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.socialMedia

        const newList = list.map(() => newForm)
        setForm({ socialMedia: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ socialMedia: [...form.socialMedia, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.socialMedia

        list.splice(i,1)
        setForm({ socialMedia: list })
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
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Social Media</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Social Media</span>
    }

    return (
        <>
        <Modal setId={setId} type="sm" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
        <div className='w-full mb-7 p-4 h-auto'> 

            <div>
            { form.socialMedia.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-7 border-b-0 w-full h-2 bg-slate-600 mb-4"></div>) }
                        <div className="grid grid-cols-1 xs:grid-cols-[150px_1fr] gap-2">
                            <div className="w-full">
                                <div>
                                    <FontAwesomeIcon size="10x" icon={IconType(item.icon)} />
                                </div>
                            </div>
                            <div className="w-full flex-initial">
                                <div className="w-full mb-2">
                                    <label htmlFor="nama" className="font-semibold">Nama</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange(e,index)} 
                                        value={item.nama} 
                                        name="nama" 
                                        id="nama" 
                                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" 
                                        placeholder="Nama sosial media"/>
                                    <ErrorMsg message={item.error?.nama || ""} />
                                </div>
                                <div className="w-full my-2">
                                    <label htmlFor="url" className="font-semibold">Url</label>
                                    <textarea  
                                        onChange={(e) => handleChange(e,index)} 
                                        value={item.url} 
                                        name="url" 
                                        id="url" 
                                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" 
                                        placeholder="Url sosial media"/>
                                    <ErrorMsg message={item.error?.url || ""} />
                                </div>
                                <div className="w-full my-2 mt-3">
                                    <label htmlFor="icon" className="font-semibold">Icon</label>
                                    <div 
                                        className="w-full grid grid-cols-1 xs:grid-cols-2 h-auto px-5 py-2 border-[1px] border-slate-600 rounded-sm shadow-lg">
                                        { icon.map((status,i) => <div className="flex gap-1 items-center uppercase" key={i}><input checked={item.icon == status} onChange={(e) => handleChange(e,index,"checkbox",true)} type="checkbox" className="p-1" value={status}  name="icon" id="icon" />{ status }</div>) }
                                    </div>
                                    <ErrorMsg message={item.error?.icon || ""} />
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
                                { index == (form.socialMedia.length -1) && (<>
                                
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