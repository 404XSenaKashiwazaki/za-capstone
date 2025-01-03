import { useSelector } from "react-redux"
import { Link, NavLink } from "react-router-dom"
import PaymentsSupports from "./PaymentsSupports"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBank, faMoneyBillTransfer, faWallet } from "@fortawesome/free-solid-svg-icons"
import SocialMedia from "../components/SocialMedia"
import { faCopyright } from "@fortawesome/free-regular-svg-icons"

const FooterHome = ({ site }) => {
    const active = "  h-full text-slate-900  "
    const sites = useSelector(state=> state.sites)
   return (
   <>
        <div className="mx-5 max-w-2xl">
            <h2 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faWallet} /> Pembayaran</h2>
            <PaymentsSupports/>
        </div>
        {/* <div className="mx-0 h-auto box-border mt-1">
        <div className="w-full mx-0">
            <footer className="footer py-10  text-base-content mt-5">
                <nav>
                <header className="footer-title text-slate-900">Services</header> 
                    <NavLink className={({isActive}) => (isActive ? active : " text-slate-900")} to={"/dmca"} >DMCA</NavLink>
                </nav> 
                <nav>
                <header className="footer-title text-slate-900">Company</header> 
                <NavLink className={({isActive}) => (isActive ? active : " text-slate-900")} to={"/about"} >About us</NavLink>
                <NavLink  className={({isActive}) => (isActive ? active : " text-slate-900")} to={"/contact"} >Contact</NavLink>
                </nav> 
                <nav>
                <header className="footer-title text-slate-900">Legal</header> 
                <NavLink className={({isActive}) => (isActive ? active : " text-slate-900")} to={"/privacy-police"} >Privacy Plolicy</NavLink>
                </nav>
            </footer> 
        </div>
        </div> */}
        <footer className="footer px-5 py-4 border-t-slate-50  text-base-content border-base-300 mt-5 shadow-2xl">
            <aside className="items-center grid-flow-col text-slate-600 text-md font-bold">
                <div>Copyright </div><FontAwesomeIcon  icon={faCopyright} />
                <Link to={"/"} className="flex gap-1 items-center" >
                    <div>{ new Date().getFullYear() }</div>
                    <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-400  to-blue-500">{ sites?.site?.title }.</h2>
                </Link>
            </aside> 
            <nav className="md:place-self-center md:justify-self-end text-slate-900">
                <SocialMedia />
            </nav>
        </footer>
    </>
   )
}

export default FooterHome