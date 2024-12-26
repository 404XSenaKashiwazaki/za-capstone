import { useDispatch, useSelector  } from "react-redux"
import { useFindProfileQuery, useUpdateProfileMutation} from "../features/api/apiProfileSlice"
import { useEffect, useState } from "react"
import { removeMessage } from "../features/profileSlice"
import { setMessage } from '../features/profileSlice'
import { setToken } from '../features/authSlice'
import Swal, { Toast, mySwal } from '../utils/sweetalert'
import FormInputProfilePassword from "../components/FormInputProfilePassword"
import { faBagShopping, faCameraAlt, faBox, faBoxArchive, faBoxes, faBoxesPacking, faCancel, faCar, faLock, faStar, faTruckDroplet, faUserCog, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useLocation, useNavigate } from "react-router-dom"
import AlertProfileRemove from "../components/AlertProfileRemove"
import FormInputProfileModal from "../components/FormInputProfileModal"
import { Helmet } from "react-helmet"
import { useFindAllCityByProvincesQuery, useFindAllProvincesQuery } from "../features/api/apiRajaOngkir"

const Profile = ({ site }) => {
    const [ input, setInput ] = useState({
        id: "",
        namaDepan: "",
        namaBelakang: "",
        username: "",
        email: "",
        password:"",
        passwordOld: "",
        konfirmasiPassword: "",
        noHp: "",
        alamat: "",
        negara: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        kodePos: "",
        profile: "",
        desc: "",
        profileUrl: "",
        profileOld: "",
        error: null
    })
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location
    const queryParams = new URLSearchParams(location.search)
    const page = queryParams.get('p')    
    const pathName = pathname.split("/")[1]
    const [ provinces, setProvinces ] = useState([])
    const [ selectedProvince, setSelectedProvince ] = useState(0)
    const [ selectedCity, setSelectedCity ] = useState(0)
    const [ cities, setCities ] = useState([])
    const { dataUser } = useSelector(state=> state.auth)
    const { data } = useFindProfileQuery({ username: dataUser?.username },{ skip: (dataUser) ? false : true })
    const { data: dataProvince } = useFindAllProvincesQuery()
    const { data: dataCity, refetch } = useFindAllCityByProvincesQuery({ provId: input.provinsi },{ skip: (selectedProvince) ? false: true })
    const { message } = useSelector(state => state.profile)
    const dispatch = useDispatch()
    const [ update, { data: dataUpdate, isError,isLoading,error } ] = useUpdateProfileMutation()
    const [ showModal, setShowModal ] = useState(false)
    const [ showModal2, setShowModal2 ] = useState(false)
    const [ username, setUsername ] = useState(null)
    const [activeTab, setActiveTab] = useState(page ? page : "Profile Settings")

    useEffect(() => {
        if(data?.response?.profiles) {
            setUsername(data.response.profiles.username)
            setInput({
                username: data.response.profiles.username,
                id: data.response.profiles.id,
                namaDepan: data.response.profiles.namaDepan,
                namaBelakang: data.response.profiles.namaBelakang,
                email: data.response.profiles.email,
                noHp: data.response.profiles?.UsersDetail?.noHp,
                alamat: data.response.profiles?.UsersDetail?.alamat,
                negara: data.response.profiles?.UsersDetail.negara,
                provinsi: data.response.profiles?.UsersDetail.provinsi,
                kota: data.response.profiles?.UsersDetail.kota,
                kecamatan: data.response.profiles?.UsersDetail.kecamatan,
                kodePos: data.response.profiles?.UsersDetail.kodePos,
                desc: data.response.profiles?.UsersDetail?.desc,
                profile: data.response.profiles?.UsersDetail?.profile,
                profileOld: data.response.profiles?.UsersDetail?.profile,
                profileUrl: data.response.profiles?.UsersDetail?.profileUrl,
                profileUrlOld: data.response.profiles?.UsersDetail?.profileUrl,
                password:"",
                passwordOld: "",
                konfirmasiPassword: "",
                error: null
            })
            
            setSelectedProvince(data.response.profiles?.UsersDetail.provinsi)
            setSelectedCity(data.response.profiles?.UsersDetail.kota)
        }
    },[data])

    useEffect(() => {
        if(dataProvince?.response?.results) setProvinces(dataProvince.response.results) 
    },[dataProvince])

    useEffect(() => {
        if(dataCity?.response?.results) {
            setCities(dataCity.response.results)
        }        
    },[dataCity])

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message])

    const handleChange = ({ target }) => {
        const { name,value } = target
        setInput(prev => ({...prev, [name]:value}))
    }
    
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await update({ data: input, username: username }).unwrap()
            dispatch(setToken(res.response))
            setInput({ ...input, error: null })
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error);
            const msg = []
            if(error?.data?.errors && error?.data?.errors.length != 0) error.data.errors.map((e,i)=> {
                input.error = []
                const name = e.param.match(/([A-Za-z]+)/)[0]
                
                msg.push(e.msg)
                input.error = { [name.toLowerCase()]: [...new Set(msg)] }
            })
            setInput(input)
        }
    }

    const handleClick = (name) => {
        setActiveTab(name)
        navigate(`${dataUser.roles.map(e=>e.name.toLowerCase()).includes("admin","penjual") && pathName == "api" ? `/api/profile/${dataUser.username}?p=${name}` : `/profile/${dataUser.username}?p=${name}`}`)
    }

    if(!data) return <></>
    return(
        <>
        <Helmet >
        <title>
            { site } Profile
        </title>
        </Helmet>
            <div className="w-full mx-auto mt-1 px-0">
                <div className="h-full bg-white shadow-md rounded-md p-4">
                    <h2 className="text-xl font-bold mb-4">{ page }</h2>

                    { showModal && <FormInputProfileModal username={username} setInput={setInput} input={input} setShowModal={setShowModal} showModal={showModal} /> }
                    { showModal2 && <AlertProfileRemove username={username} setInput={setInput} input={input} setShowModal={setShowModal2} showModal={showModal2} /> }
                    <div className="grid grid-cols-1 xs:grid-cols-[150px_1fr] gap-5 items-center mb-6">
                        <div className="w-52 h-52 flex p-2 items-center relative ">
                            <img
                                className="w-full h-full rounded-full object-cover border-slate-200 border-2"
                                src={input?.profileUrl}
                                alt={input.username }
                            />
                            <div
                                onClick={() => setShowModal(true)}
                                className="border-slate-200 border-2 rounded-full p-1 absolute right-5 md:right-3  lg:right-30 md:bottom-3 bg-slate-100 bottom-5">
                                <FontAwesomeIcon size="2x"  icon={faCameraAlt} />
                            </div>
                        </div>
                        <div className="w-full flex items-center gap-1 mx-5 ml-0 xs:ml-10">
                            <button
                                onClick={() => setShowModal(true)}
                                className="ml-4 px-4 bg-indigo-700 text-white py-1 rounded-sm font-bold text-sm hover:bg-indigo-600 transition">
                                Ganti Foto
                            </button>
                            <button 
                                onClick={() => setShowModal2(true)}
                                disabled={input.profile == "default.jpg" ? true : false }
                                className={`px-4 text-red-500 bg-slate-200  py-1 rounded-sm font-bold text-sm hover:bg-slate-600 transition ${ input.profile == "default.jpg" && `cursor-not-allowed` }`}>Hapus</button>
                        </div>
                    </div>
                    <div className="w-full max-w-md ">
                        {/* Tab buttons */}
                        <div className="flex border-b border-gray-200">
                            <button
                            className={`w-1/2 py-2 text-start text-md font-medium ${
                                activeTab === 'Profile Settings'
                                ? 'border-b-2 border-blue-500 text-blue-500'
                                : 'text-gray-500'
                            }`}
                            onClick={() => handleClick("Profile Settings")}
                            >
                            Profile
                            </button>
                            <button
                            className={`w-1/2 py-2 text-start text-md font-medium ${
                                activeTab === 'Password Settings'
                                ? 'border-b-2 border-blue-500 text-blue-500'
                                : 'text-gray-500'
                            }`}
                            onClick={() => handleClick("Password Settings")}
                            >
                            Password Settings
                            </button>
                        </div>

                        {/* Tab content */}
                        <div className="p-0">
                            {activeTab === 'Profile Settings' && (
                            <div className="mt-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 xs:gap-4 mb-1 xs:mb-3">
                                        <div className="mb-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="namaDepan">Nama Depan*</label>
                                            <input
                                                type="text"
                                                name="namaDepan"
                                                value={input?.namaDepan}
                                                onChange={handleChange}
                                                className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                                placeholder="Nama depan"
                                                required
                                            />
                                        </div>
                                        <div className="mb-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="namaBelakang">Nama Belakang*</label>
                                            <input
                                                type="text"
                                                name="namaBelakang"
                                                value={input?.namaBelakang}
                                                onChange={handleChange}
                                                className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                                placeholder="Nama belakang"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 xs:gap-4 mb-1 xs:mb-3">
                                        <div className="mb-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email*</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={input?.email}
                                                onChange={handleChange}
                                                className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                        <div className="mb-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="noHp">Nomor Telp/Wa*</label>
                                            <input
                                                required
                                                type="number"
                                                name="noHp"
                                                value={input?.noHp}
                                                onChange={handleChange}
                                                className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                                placeholder="08061237890"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Negara</label>
                                    <input
                                        required
                                        type="text"
                                        value={input?.negara}
                                        name="negara"
                                        onChange={handleChange}
                                        className="mt-1 p-1 block w-full border text-slate-900 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    </div>
                                    <div className="mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Provinsi</label>
                                    <select
                                        required
                                        name="provinsi"
                                        className="mt-1 p-1 block w-full border  text-slate-900 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        onChange={(e) => {
                                            setSelectedProvince(e.target.value)
                                            setSelectedCity("")
                                            handleChange(e)
                                        }}
                                        value={input?.provinsi}
                                        >
                                        <option value="">-- Pilih Provinsi --</option>
                                        {provinces.map((p) => (
                                            <option key={p.province_id} value={p.province_id}>
                                            {p.province}
                                            </option>
                                        ))}
                                    </select>
                                    </div>
                                    <div className="mb-1">
                                        <label className="block text-sm font-medium text-slate-700">Kota</label>
                                        <select
                                            required
                                            className="mt-1 p-1 block w-full border text-slate-900 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            onChange={(e) => {
                                                setSelectedCity(e.target.value)
                                                handleChange(e)
                                            }}
                                            value={selectedCity}
                                            name="kota"
                                            >
                                            <option value="">-- Pilih Kota --</option>
                                            {cities.map((e) => (
                                                <option key={e.city_id} value={e.city_id}>
                                                {e.city_name}
                                                </option>
                                            ))}
                                        </select>
                                        </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
                                        <div>
                                        <label className="block text-sm font-medium text-slate-700 ">Kecamatan</label>
                                        <textarea 
                                            required
                                            value={input?.kecamatan}
                                            onChange={handleChange}
                                            name="kecamatan" 
                                            id="kecamatan" 
                                            className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                            placeholder="Kecamatan">
                                        </textarea>
                                        </div>
                                        <div>
                                        <label className="block text-sm font-medium text-slate-700">Kode Pos</label>
                                        <input
                                            required
                                            type="number"
                                            value={input?.kodePos}
                                            name="kodePos"
                                            onChange={handleChange}
                                            className="mt-1 p-1 block w-full border text-slate-900 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="alamat">Alamat*</label>
                                        <textarea 
                                            required
                                            value={input?.alamat}
                                            onChange={handleChange}
                                            name="alamat" 
                                            id="alamat" 
                                            className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                            placeholder="Alamat">
                                        </textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-4 w-auto px-4 py-1 bg-indigo-700 text-white  rounded-sm font-bold text-sm hover:bg-indigo-600 transition">
                                        Simpan
                                    </button>
                                    </form>
                            </div>
                            )}
                            {activeTab === 'Password Settings' && (
                            <div className="mt-5">
                                <FormInputProfilePassword data={data}/>
                            </div>
                            )}
                        </div>
                    </div>
                    {/* <FormInputProfile data={data} username={username} input={input} setInput={setInput}/>  */}
                </div>
            </div>
        </>
    )
}

export default Profile