import { check } from "express-validator"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import Diskon from "../../models/backend/Diskon.js"
import SocialMedia from "../../models/backend/SocialMedia.js"

export const validateDuplicate = (req,res,next) => {
    let { socialMedia } = req.body
    const uniqName = []    
    if(socialMedia.length == 0) throw CreateErrorMessage("Permintaan anda tidak valid",400)
    socialMedia = socialMedia.map((e,i)=> {
        const nama = e.nama.split(" ").map(t=> t.charAt(0).toUpperCase() + t.slice(1)).join(" ")
        uniqName.push(nama)
        return { ...e, nama }
    })
    const uniqErr = []
    socialMedia.filter((e,i)=> {
        if(uniqName.indexOf(e.nama) != i) uniqErr.push({
            "value": e.nama,
            "msg": `( ${ e.nama } ) sudah digunakan`,
            "param": `socialMedia[${i}].nama`,
            "location": "body"
        })
    })

    if(uniqErr.length > 0) return res.status(400).json({ errors: [...uniqErr] })
    req.body.socialMedia = socialMedia
    next()
}

export const validateUpdate = async (req,res,next) => {
    let { socialMedia } = req.body
    const namelErr = []
    const usernameErr = []
    
    const allErr = []
    socialMedia = await Promise.all(socialMedia.map(async (e,i)=>{
        const nameInDb = await SocialMedia.findOne({ where: { nama: e.nama }, paranoid: false })
        if(nameInDb && nameInDb.id != e.social_id) namelErr.push({
            "value": e.nama,
            "msg": ` (${ e.nama }) sudah digunakan`,
            "param": `socialMedia[${i}].nama`,
            "location": "body"
        })
        return e
    }))
    if(usernameErr.length > 0) allErr.push(usernameErr)

    if(namelErr.length > 0) allErr.push(namelErr)
    if(allErr.length > 0) return res.status(400).json({ errors: [...allErr] })
    req.body.socialMedia = socialMedia

    next()   
}


export const rule = [
    check("socialMedia.*.nama").trim().notEmpty().withMessage("Nama sosial media tidak boleh kosong").custom( async (name,{ req }) => {
        const inDb = await SocialMedia.findOne({ where: { nama: name }, paranoid: false })
        if(req.method == "POST"){
            if(inDb) throw new Error(`${ name } sudah di gunakan`)
            return
        }
    }),
    check("socialMedia.*.url").trim().notEmpty().withMessage("Url sosial media tidak boleh kosong"),
    check("socialMedia.*.icon").trim().notEmpty().withMessage("Icon sosial media tidak boleh kosong"),
]