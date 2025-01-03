 import { Link, useNavigate, useParams } from "react-router-dom"
import { useFindOneProductsQuery } from "../features/api/apiProductsSlice";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRotateBack, faBackspace, faCartShopping, faCheckSquare, faCommentSms, faHashtag, faImage, faMessage, faRankingStar, faSearch, faShop, faShoppingCart, faStar, faTags, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { useFindAnimeOngoingQuery, useHomeFindOneEpisodeQuery } from "../features/api/apiHomeSlice";
import CardSeries from "../components/CardSeries";
import { formatDiskon, formatRp } from "../utils/FormatRp";
import { handleBuyNow } from "../utils/BuyNow";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage, setMessage, setOptions, setQuantity, setShoppingCart } from "../features/shoppingCartSlice"
import { Toast} from '../utils/sweetalert'
import TabProductsDetail from "../components/TabProductsDetail";
import TimeAgo from '../components/TimeAgo'
import ProductsImage from "../components/ProductsImage";
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { Helmet } from 'react-helmet'

const ProductsDetail = ({ site }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { slug } = useParams()
    const { data: dataProducts } = useFindOneProductsQuery({ slug: slug }, { skip: (slug) ? false : true })
    const [ product, setProduct ] = useState([])
    const [ productsImg, setProductImg ] = useState([])
    const [ qty, setQty ] = useState(1)
    const [ poster, setPoster ] = useState(null)
    const [ shops, setShops ] = useState(null)
    const [ perPage,setPerPage ] = useState(12)
    const [ page, setPage ] = useState(1)
    const [ search, setSearch ] = useState("")
    const { data: dataOtherProducts } = useFindAnimeOngoingQuery({ search,page, perPage, categories:"", sort: "" })
    const [ otherProducts, setOtherProducts ] = useState([])
    const { dataUser } = useSelector(state=> state.auth)
    const selector = useSelector(state=>state.shoppingCart)
    const sites = useSelector(state=> state.sites)
    const { message, options } = selector
    const [activeTab, setActiveTab] = useState('deskripsi')
    const [ rating, setRating ] = useState([])
    const [ ratingProd, setRatingProd ] = useState(0)
    
  useEffect(() => {
    if(dataProducts?.response?.products) setProduct({ ...dataProducts.response.products })
    if(dataProducts?.response?.products?.ImageProducts) {
      setProductImg([...dataProducts?.response?.products?.ImageProducts ])
      setPoster({ url: dataProducts?.response?.products?.ImageProducts[0].url_image, nama: dataProducts?.response?.products?.ImageProducts[0].nama_image, index: 0})
    }
    if(dataProducts?.response?.products?.Shop) setShops({...dataProducts?.response?.products?.Shop})
    if(dataProducts?.response?.ratings) setRating(dataProducts.response.ratings)
      
      setRatingProd(dataProducts?.response?.ratingProduct || 0)
  
  },[ dataProducts ])

  useEffect(() => {
    if(dataOtherProducts?.response?.products) setOtherProducts(dataOtherProducts.response.products)
  },[ dataOtherProducts ])

  useEffect(() => {
    if(message) Toast.fire({ text: message, icon: "success"})
    dispatch(removeMessage())
  },[dispatch, message])


  const handleAddToCart =  async ({ id},quantity, UserId) => {
    fnDispatch(setMessage("Produk berhasil ditambahkan"))
    dispatch(setShoppingCart({ ProductId: parseInt(id), UserId: parseInt(UserId), quantity }))
  }

  const fnDispatch = options => dispatch(options)  

  const handleChangeImg = ({ url_image, nama_image }, i) => {
    setPoster({ url: url_image, nama: nama_image, index: i })
  }
  
  const increment = () => {
    setQty(qty + 1);
  }

  const decrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  }

  const RatingIcon = ({ratingProd, size}) => {
    return <div className="flex items-center">
      { Array.from({length:5 },(e,index)=><div key={index} className="text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${size ? size : `h-5 w-5`} cursor-pointer text-xs ${
            index < ratingProd ? "text-yellow-500" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73L6.82 21z"
            />
        </svg>
        </div>)}
    </div>
  }


  const Ratings = ({rating }) => {
    return <div className="mt-0">
      {/* <h2 className="text-sm font-semibold text-gray-900 mt-1 sm:mt-3 mb-2"></h2> */}
      <div className="px-2">
        { rating.length > 0 && rating.map(e=><div key={e.id}>
          <div className="flex items-start gap-2 p-1">
            <div className="w-12">
              <img src={e.image} className="w-10 h-10 rounded-full" alt={e.username} />
            </div>
            <div className="w-full relative">
              <h2 className="text-sm font-semibold mb-1">{e.username}</h2>
              <RatingIcon ratingProd={e.rating} size={"w-3 h-3"}/>
              <div className="text-xs absolute top-0 right-0">
                <TimeAgo date={e?.createdAt}/>
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-200 bg-opacity-50 rounded-md py-1 px-1 mt-1">
            <p className="text-sm">{ e.review }</p>
          </div>
          </div>) } 
      </div>
    </div>
  }

  if(product.length == 0) return <></>
    return <div>
      <Helmet>
          <title>{ site } - Produk</title>
      </Helmet>
      <div className="flex flex-col sm:flex-row gap-2 justify-start p-5 bg-slate-50 w-full">
        {/* Product Images */}
        <div className="sm:p-2 w-60 sm:w-ful">
          <img
            src={ poster?.url }
            alt={ poster?.nama }
            className="w-auto sm:w-full rounded-md sm:h-60 "
          />
          <div className="flex overflow-hidden mt-1 sm:mt-10 space-x-2 ">
            {  (productsImg && productsImg.length != 0) && <ProductsImage handleChangeImg={handleChangeImg} images={productsImg} poster={poster} />}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 mt-1 sm:mt-6  md:ml-10">
          <p className="text-1xl font-bold text-gray-600">
            <FontAwesomeIcon icon={faShop} /> { sites?.site?.title }
          </p>
          <h1 className="md:text-lg sm:text-sm text-md font-bold text-gray-900 mt-1 sm:mt-3">{ product?.nama_produk }</h1>
          
          {/* Pricing */}
          <div className="flex flex-col mt-1 sm:mt-5">
            <div className="flex ">
              <span className="xs:text-sm text-sm md:text-lg font-bold text-gray-900">{ formatRp(formatDiskon(product.harga_produk, product.Diskon.diskon)) }</span>
              <span className="ml-2 text-sm font-semibold text-red-600 px-2 py-1 bg-slate-800 rounded">{ product.Diskon.diskon }% Diskon</span>
            </div>
            <span className="ml-0 md:text-md  text-sm line-through text-gray-500 ">{ formatRp(product.harga_produk)  } </span>
          </div>
          <div className="mt-2">
            <RatingIcon ratingProd={ratingProd} />
          </div>
          <div className="mt-3">
            <Link to={`/?c=${product?.Category?.nama}`} >
                <FontAwesomeIcon icon={faHashtag} /> { product?.Category?.nama} 
            </Link> 
          </div>
          <div className="flex md:items-center flex-col justify-start md:flex-row p-0 md:gap-10 gap-2 mt-2 sm:mt-3">
              {/* Quantity Selector */}
            <div className="flex items-center flex-initial w-1/2 ">
              <button
                onClick={decrement}
                className="px-3 py-1 bg-gray-200 rounded-l-md text-sm font-bold"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b text-sm">{qty}</span>
              <button
                onClick={increment}
                className="px-3 py-1 bg-gray-200 rounded-r-md text-sm font-bold"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <div className="w-full flex md:flex-row flex-col gap-0">
              <div className="flex items-center">
                {/* <button onClick={() => handleAddComment()} className="w-auto px-6 py-1 text-sm font-bold bg-cyan-600 text-white rounded-none hover:bg-cyan-500 transition">
                  <FontAwesomeIcon icon={faMessage} />
                </button> */}

                <button onClick={() => {
                  (dataUser) 
                  ? handleAddToCart(product,qty,dataUser.id,dataUser.username)
                  : navigate("/login")
                }} 
                
                className="w-full px-6 py-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
                  <FontAwesomeIcon icon={faCartShopping} /> Masukkan Keranjang
                </button>
              </div>
              {/* <button onClick={() =>  (dataUser) ? handleBuyNow(product,quantity,dataUser.id,dataUser.username) : navigate("/login")} className="w-auto px-6 py-1 text-sm font-bold bg-indigo-700 text-white rounded-none hover:bg-indigo-600 transition">
                Beli Sekarang
              </button> */}
            </div>
          </div>
          <div className="mt-7 mb-3">
            <TabProductsDetail desk={product?.desk_produk} rat={<Ratings rating={rating}  />}  />
          </div>
        </div>
      </div>

    
      <div className="flex justify-end mt-5">
        <Link to="/" className="w-auto px-6 py-1 text-sm font-medium bg-indigo-700 text-white rounded-sm hover:bg-indigo-600 transition"><FontAwesomeIcon icon={faArrowRotateBack} /> Kembali</Link>
      </div>
      <div className=" w-full p-5 mt-5">
        <h1 className="text-lg font-bold text-gray-900 mt-3"><FontAwesomeIcon icon={faTags} /> Produk Serupa</h1>
        <div className="grid md:grid-cols-5 xl:grid-col-6 sm:grid-cols-3 grid-cols-2 gap-3 overflow-hidden mt-8">
          { 
            otherProducts.length != 0 && <CardSeries items={otherProducts} />
          }
        </div>
      </div>
    </div>
}

export default ProductsDetail 





    


