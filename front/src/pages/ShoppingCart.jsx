import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatDiskon, formatRp } from '../utils/FormatRp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { setOptions, setRemoveOption, removeQuantity, setJumlah,setQuantity, setCheckout, removeCheckout, setShoppingCart, setShoppingCartOrderItem, removeShoppingCart } from "../features/shoppingCartSlice"
import EmptyShoppingCart from '../components/EmptyShoppingCart'
import { useFindAllProductsCartsQuery } from '../features/api/apiShoppingCart'
import { Helmet } from 'react-helmet'

const ShoppingCart = ({ site }) => {
    const dispatch = useDispatch()
    const [ shippingCost, setShippingCost ] = useState(5.00)
    const [ promoCode, setPromoCode ] = useState('')
    const [ total, setTotal ] = useState(0) 
    const [ carts, setCarts ] = useState([])
    const [ productId, setProductId ] = useState([])
    const [ qty, setQty ] = useState(0)
    const [ username, setUsername ] = useState("")
    const [ checkedId, setCheckedId ] = useState(null)
    const [ checkedAll, setCheckedAll ] = useState(false)
    const selector = useSelector(state=>state.shoppingCart)
    const {  shoppingCarts } = selector
    const { dataUser } = useSelector(state=> state.auth) 
    const { data } = useFindAllProductsCartsQuery({ username: dataUser?.username, productId },{ skip: (productId.length == 0)})
    const dataShoppingCarts = shoppingCarts.find(e=> e.UserId == dataUser?.id )
    
    useEffect(() => {
        if(dataShoppingCarts && dataShoppingCarts.ordersItem.length > 0) {
            setProductId(dataShoppingCarts.ordersItem.map(e=> e.ProductId))
        }
        
        if(data?.response?.products && dataShoppingCarts && dataShoppingCarts.ordersItem.length > 0) {
            const res = data.response.products.map((e,i)=> {
                const quantity = dataShoppingCarts.ordersItem.filter(e2=> (e2.ProductId == e.id))[0]?.quantity
                return {
                    ...dataShoppingCarts.ordersItem[i],
                ProductId: e.id,
                price: formatDiskon(e.harga_produk, e.Diskon.diskon),
                quantity: quantity,
                desk_produk: e.desk_produk,
                nama_produk: e.nama_produk,
                slug: e.slug,
                harga_produk: e.harga_produk,
                stok: e.stok_produk,
                image_products: e.ImageProducts[0].url_image,
                total: formatDiskon(e.harga_produk, e.Diskon.diskon) * quantity,
                }
            })
            const totalPrice = res.filter(e=> e.checked).reduce((acu,cure) => acu + cure.total, 0)
            setTotal(totalPrice)
            setCarts(res)
            setCheckedId(res)
            // dispatch(setCheckout(res))
            const cartsChecked = res.filter(e=> e.checked).length
            setQty(cartsChecked)
            setCheckedAll(cartsChecked == res.length ? true : false)
        }
    },[ data, dataShoppingCarts ])

    useEffect(() => {
        if(dataUser) setUsername(dataUser.username)
    },[ dataUser ])

    const updateQuantity = (id, quantity,) => {
        dispatch(setShoppingCart({ ProductId: parseInt(id), UserId: parseInt(dataUser.id), quantity,checkedId }))
    }

    const handleChecked = (evnt,targetId) => {
        const { checked } = evnt.target 
        const t = (checkedId) ? checkedId : carts.map(el=> ({ ...el, checked: false}))
        const id = t.map(e=> {
            if(targetId != "all") return (targetId == e.ProductId) ? { ...e, checked } : e
            return { ...e, checked }
        })
        
        setCheckedId(id);
        const tw = id.filter(e=> e.checked == true);
        (tw.length == carts.length) ? setCheckedAll(true) : setCheckedAll(false)
        setQty(tw.length)
    
        dispatch(setShoppingCartOrderItem({ UserId: parseInt(dataUser.id), ordersItem: id, checkedId: tw }))
        const totalPrice = tw.reduce((acu,cure) => acu + cure.total, 0)
        setTotal(totalPrice)
        handleItemCheckout(tw)
    }

    const handleItemCheckout = (tw) => {
        if(tw.length == 0) {
            dispatch(removeCheckout())
        }else{
            dispatch(setCheckout({ orders: { UserId: parseInt(dataUser.id), ordersItem: tw.map(e=> (e.checked) ? ({ 
                ProductId: e.ProductId, 
                checked: e.checked,
                quantity: e.quantity }) : null).filter(e=>e!=null) 
            }}))   
        }
    }

    const handleDelCartProduct = (id) => {
        let ordersItem = dataShoppingCarts.ordersItem
        ordersItem = ordersItem.filter(e => e.ProductId != id)
        dispatch(setShoppingCartOrderItem({ UserId: parseInt(dataUser.id), ordersItem, checkedId }))
        
        handleItemCheckout(ordersItem)
    }

    return  (
    <>
    <Helmet>
        <title>
            { site }- Keranjang Belanja
        </title>
    </Helmet>
    { (dataShoppingCarts && dataShoppingCarts.ordersItem.length > 0 && carts.length > 0) 
    && ( <div className="flex flex-col md:flex-row md:justify-center py-3 gap-1">
        <div className="w-full bg-white p-6 shadow-md rounded-lg ">
            <h1 className="text-lg font-bold mb-6"><FontAwesomeIcon icon={faShoppingCart} /> Keranjang Belanja</h1>
    
            <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="">
                <tr className="text-left">
                <th className="p-0 pl-1 pb-4 whitespace-nowrap ">
                <div className="font-semibold text-left">
                    <div className="w-full h-full shrink-0">
                    <input 
                        type="checkbox" 
                        disabled={ carts.length < 1 ? true : false } 
                        checked={ checkedAll } 
                        onChange={(e) => handleChecked(e,"all")}
                        id="select_id_users" 
                        className="w-3 h-3 border-slate-400" 
                    />
                    </div>
                </div>
                </th>
                <th className="pb-4 text-sm">Detail Produk</th>
                <th className="pb-4 text-sm">Jumlah</th>
                <th className="pb-4 text-sm">Harga</th>
                <th className="pb-4 text-sm">Sub Harga</th>
                </tr>
            </thead>
            <tbody>
                { carts.map((item, index) => (
                <tr key={item.ProductId} className="border-b">
                    <td className="p-0 pl-1 whitespace-nowrap max-w-[5px] overflow-hidden">
                    <div className="flex items-center">
                        <div className="w-full h-full shrink-0">
                        <input 
                            type="checkbox"  
                            name={ item.ProductId } 
                            value={ item.ProductId } 
                            checked={ (checkedId) && checkedId[index]?.checked || false }  
                            onChange={e => handleChecked(e,item.ProductId)} 
                            id="select_id_episode" 
                            className="w-3 h-3 border-slate-400" 
                        />
                        </div>
                    </div>
                    </td>
                    <td className="py-4 w-full sm:w-60 flex items-center space-x-4" >
                        <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                            <img src={item.image_products} alt={item.nama_produk} className="w-16 h-16 flex-shrink-0" />
                        </Link> 
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap">{item.nama_produk}</h3>
                            <p className=" text-gray-600 text-xs w-full overflow-hidden text-ellipsis whitespace-nowrap">{ item.desk_produk }</p>
                            <button onClick={() => handleDelCartProduct(item.ProductId)} className="text-red-500 text-xs mt-2">Hapus</button>
                        </div>
                    </td>
                    <td className="py-4">
                    <div className="flex items-center">
                        <button onClick={() => updateQuantity(item.ProductId, -1)} className="px-2 h-8 py-1 border rounded-l">-</button>
                        <span className="px-4 w-auto h-8 py-1 border">{item.quantity || ""}</span>
                        <button onClick={() => updateQuantity(item.ProductId, 1)} className="px-2 h-8 py-1 border rounded-r">+</button>
                    </div>
                    </td>
                    <td className="py-4">
                        <p className="text-sm font-medium">{ formatRp(item.price) }</p>
                        <p className="text-xs line-through">{ formatRp(item.harga_produk) }</p>
                    </td>
                    <td className="py-4">{ formatRp(item.total) }</td>
                </tr>
                )) }
            </tbody>
            </table>
            </div>
    
            <div className="mt-6">
            <Link to="/" className="text-indigo-600 text-sm font-semibold">  <FontAwesomeIcon icon={faArrowLeft} /> Lanjutkan Belanja</Link>
            </div>
        </div>
    
        <div className="md:w-1/3 xs:w-full w-full h-full bg-white p-6 md:ml-6  mt-2 shadow-md rounded-lg">
            <h2 className="text-lg font-bold mb-3">Ringkasan Pesanan</h2>
    
            <div className="flex gap-3 mb-1">
            <span className="text-md font-medium">Jumlah Produk: </span>
            <span className="text-md font-medium"> { qty }</span>
            </div>
    
            <div className="flex justify-between font-bold text-lg">
                <div className="border-t border-gray-300 mt-1 pt-2">
                <span className="text-md font-semibold ">Total Pesanan: </span>
                <span className="terxt-sm font-semibold">{ formatRp(total) }</span>
                </div>
            </div>
            <Link to={`/checkouts/${username}`} >
                <button 
                    disabled={qty == 0 ? true : false}
                    className={`${ qty == 0 && `cursor-not-allowed` } w-full mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs py-1 px-1 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}
                >CHECKOUT
                </button>
            </Link>
        </div>
        </div>) 
    
    }
    { (!dataShoppingCarts || dataShoppingCarts?.ordersItem.length == 0) && <EmptyShoppingCart /> }
    </>
    )
}

export default ShoppingCart