import { Op } from "sequelize"
import Diskon from "../../models/backend/Diskon.js"
import SocialMedia from "../../models/backend/SocialMedia.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import { formatDateTime } from "../../utils/FormatDate.js"
//============================// 

export const findAll = async (req) => {
    const search = req.query.search || ""
    const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
    const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10

    const offset = page > 1 ? (page * limit) - limit : 0
    const paranoid = req.query.type == "restore" ? false : true
    const where = (paranoid) 
    ? { where: {
        [Op.or]: {
            nama: { [Op.like]: `%${search}%` }
        },
        deletedAt: {
        [Op.is]: null
        }
    } }
    : { where: {
        [Op.or]: {
        nama: { [Op.like]: `%${search}%` }
        },
        deletedAt: {
        [Op.not]: null
        }
    } }

    const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
    const socials = await SocialMedia.findAll({...where, paranoid ,limit, offset, order: [["id","DESC"]]})   
    const totals = await SocialMedia.count(whereCount)

    const totalsCount = (search == "") ? totals : socials.length
    const totalsPage = Math.ceil(totalsCount / limit)
    const totalsFilters = socials.length
    
    return { 
        status:  200,
        message: "", 
        response: { socials, page, offset, limit,totalsPage,totals, totalsFilters } 
    }
}

export const findOne = async (req) => {
    const { id } = req.params
    const paranoid = req.query.type == "restore" ? false : true
    const where = paranoid 
    ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
    : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

    const social = await SocialMedia.findOne({...where, paranoid})
    if(!social) throw CreateErrorMessage("Tidak ada data",404)
    return { 
        status:  200,
        message: "", 
        response: { social } 
    }
}
export const store = async (req) => {
    const { socialMedia } = req.body
    await SocialMedia.bulkCreate(socialMedia,{ fields: ["nama","url","icon"] })
    return { 
        status:  201,
        message: `${socialMedia.length} Data berhasil di simpan`, 
        response: { socialMedia  } 
    }
}



export const update = async (req) => {
    const { socialMedia } = req.body
    const response = (await Promise.all(socialMedia.map(async e =>  {
        const social = await SocialMedia.findOne({ where: { id: e.social_id }, paranoid: false, attributes: ["id"] })
        if(!social) return 
        await social.update(e,{ fields: ["nama","url","icon"] })

        return { id: social.id }
    }))).filter(e=> e != null)
    if(response.length == 0) throw CreateErrorMessage("Tidak ada data",404)
    return { 
        status:  201,
        message: `${response.length} Data berhasil di update`, 
        response: { response  } 
    }
}

export const destroy = async (req) => {
    const { id } = req.body
    const force = req.query.permanent == "true" ? true : false

    const social = (await SocialMedia.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
    if(social.length == 0) throw CreateErrorMessage("Tidak ada data",404)

    await SocialMedia.destroy({ where: { id: id }, force: force })
    return { 
        status:  200,
        message: `${ social.length } Data berhasil di hapus`, 
        response: { social  } 
    }
}

export const restore = async (req) => {
    const { id } = req.body
    const social = (await SocialMedia.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
    
    if(social.length == 0) throw CreateErrorMessage("Tidak ada data",404)
    await SocialMedia.restore({ where: { id: id } })
    
    return { 
        status:  200,
        message: `${ social.length } Data berhasil di restore`,  
        response: { social } 
    }
}
