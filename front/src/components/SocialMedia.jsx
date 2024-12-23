import React, { useEffect, useState } from 'react'
import { useFindAllSocialMediaFooterQuery, } from '../features/api/apiSocialMediaSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { faFacebook, faGoogle, faInstagram, faPinterest, faTelegram, faTwitter, faWhatsapp, } from '@fortawesome/free-brands-svg-icons'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'

const SocialMedia = () => {
    const [ socials, setSocials ] = useState([])
    const { data: dataSocial,isError, isLoading, error } = useFindAllSocialMediaFooterQuery({ restores: false, search: "", page:1, perPage: 10 })
    
    useEffect(() => {
        if(dataSocial?.response){
            const { socials, ...options} = dataSocial.response
            setSocials(socials)
        }
    },[ dataSocial ])

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
    
    return (
        <div className="grid grid-flow-col gap-4 mb-5 cursor-pointer">
            { socials.length > 0 && socials.map(e=> <div key={e.id}>
                <Link to={`${e.url}`}><h2 className="text-lg xs:text-xl"><FontAwesomeIcon size="1x" icon={IconType(e.icon)} /></h2></Link>
            </div>)}
        </div>
    )
}

export default SocialMedia