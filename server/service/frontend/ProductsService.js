import { Op, Sequelize } from "sequelize"
import Tables from "../../models/backend/Tables.js"
import Products from "../../models/backend/Products.js"
import Reservations from "../../models/front/Reservations.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import Users from "../../models/backend/Users.js"
import { Diskon, ImageProducts, Orders, OrdersItem, Shops } from "../../models/Index.js"
import Categories from "../../models/backend/Categories.js"
import sequelize from "../../config/Database.js"
//============================// 

export const findAll = async (req) => {
  const search = req.query.search || ""
  const seller = req.query.seller || ""
  const categories = req.query.categories
  const sort = req.query.sort || ""
  const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
  
  const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10
  const offset = page > 1 ? (page * limit) - limit : 0
  const paranoid = req.query.type == "restore" ? false : true

  let where = (paranoid) 
  ? { where: {
    [Op.or]: {
      nama_produk: { [Op.like]: `%${search}%` }
    },
    
    deletedAt: {
      [Op.is]: null
    }
  } }
  : { where: {
    [Op.or]: {
      nama_produk: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.not]: null
    }
  } }

  

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const products = await Products.findAll({...where, include:[
    { model: ImageProducts, },
    { model: Diskon },
    { model: Categories, where: (categories) ? { 
    nama: categories
  } : {}},
], paranoid ,limit, offset, 
attributes: {
  include: [
      // Custom field "price" yang merupakan hasil dari perhitungan diskon
      [
          Sequelize.literal("`Products`.`harga_produk` - ((`Products`.`harga_produk` * IFNULL(`Diskon`.`diskon`, 0)) / 100)"),
          "price"
      ]
  ]
},
order: [(sort) ? ["price",sort] : ["id","DESC"],[ImageProducts, "id","ASC"]], subQuery: false})   
  const totals = await Products.count(whereCount)

  const totalsCount = (search == "") ? totals : products.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = products.length
  
  return { 
    status:  200,
    message: "", 
    response: { products,page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { slug } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { slug, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { slug, deletedAt: { [Op.not]: null} }  } }

  const products = await Products.findOne({...where, include: [{ model: ImageProducts },{ model: Categories }], paranoid})
  if(!products) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { products } 
  }

}
export const store = async (req) => {
  const { reservations } = req.body
  await Reservations.create(reservations,{ fields: ["reservation_time","status","TableId","UserId"]})
  return { 
    status:  201,
    message: `${reservations.length} Data berhasil disimpan`, 
    response: { reservations  } 
  }
}

export const update = async (req) => {
  const { id, reservation_time, status, TableId, UserId } = req.body
  const reservations = await Reservations.findOne({ where: { id: id }, paranoid: false, attributes: ["id"] })
  const response = await reservations.update({ reservation_time, status, TableId, UserId },{fields: ["reservation_time","status","TableId","UserId"]})

  if(!reservations) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  201,
    message: `Data berhasil diupdate`, 
    response: { response  } 
  }
}

export const destroy = async (req) => {
  const { id } = req.body
  const force = req.query.permanent == "true" ? true : false

  const reservations = (await Reservations.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  if(reservations.length == 0) throw CreateErrorMessage("Tidak ada data",404)

  await Reservations.destroy({ where: { id: id }, force: force })
  return { 
    status:  200,
    message: `${ reservations.length } Data berhasil dihapus`, 
    response: { reservations  } 
  }
}

export const restore = async (req) => {
  const { id } = req.body
  const reservations = (await Reservations.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  
  if(reservations.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  await Reservations.restore({ where: { id: id } })
  
  return { 
    status:  200,
    message: `${ reservations.length } Data berhasil di restore`,  
    response: { reservations } 
  }
}


export const findAllPopular = async (req) => {
  const topSelingId = (await OrdersItem.findAll({ attributes: [
    "ProductId",
    [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"]
  ], 
group: ["ProductId"],
order: [[sequelize.literal("totalQuantity"), "DESC"]]})).map(e=> e.ProductId)
const products = await Products.findAll({ where: { id: topSelingId }, limit:5, include:[ImageProducts,Diskon]})

  return { 
    status:  200,
    message: "", 
    response: { products  } 
  }
}
