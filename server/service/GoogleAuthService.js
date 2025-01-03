import Users, { User_Role } from "../models/backend/Users.js"
import { CreateErrorMessage } from "../utils/CreateError.js"
import sequelize from "../config/Database.js"
import UsersDetails from "../models/backend/UsersDetails.js"

import env from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Role from "../models/backend/Roles.js"
import Roles from "../models/backend/Roles.js"


export const callback = async (req, res)=> {
    const { name,  _json, id, emails } = req.user
    const username = emails[0].value.substring(0,5)
    const saltRound = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(id,saltRound)
    try {
        let users =  await Users.findOne({ where: { email: _json.email }, paranoid: false  })
        if(!users) {
            await sequelize.transaction(async transaction => {
                users = await Users.create({ 
                    namaDepan: name.givenName, 
                    namaBelakang: name.familyName,
                    password: password,
                    email: _json.email,
                    username: username,
                    token: "" },{ transaction })
                    console.log({ id : users.id });
                    
                await User_Role.create({ RoleId: 3, UserId: users.id },{ transaction })
                await UsersDetails.create({ UserId: users.id,alamat: "" },{ transaction })
            })

            users = await users.reload()
        }
        const accessToken = jwt.sign({ 
            id: users.id,
            username: users.username,
            namaDepan: users.namaDepan,
            namaBelakang: users.namaBelakang,
            email: users.email,
            roles: users.Roles,
            detailUsers: users.UsersDetail
        },
            process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30s"})
    
        const refreshToken = jwt.sign({ 
            id: users.id,
            username: users.username,
            namaDepan: users.namaDepan,
            namaBelakang: users.namaBelakang,
            email: users.email,
            roles: users.Roles,
            detailUsers: users.UsersDetail
        },
            process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "1d"})
        res.cookie("jwt",refreshToken,{httpOnly:true,maxAge: 60*60*24*1000})

        users = await users.update({token: refreshToken})  
        const roles = await Users.findOne({ where: { email: users.email }, include: [{ 
            model: Roles, attributes:["id","name","desk"], 
            through: { attributes:["RoleId","UserId"] } 
        },{ 
            model: UsersDetails
        }] })
    
        const url = roles.Roles.map(t => (t.name.trim().toLowerCase() == "admin") 
        ? "http://localhost:5173/api/dashboard" 
        : "http://localhost:5173")
        return {
            status: 201,
            message: "Login berhasil",
            response: { accessToken, url: url }
        }
    } catch (error) {
        console.log(error);
        throw CreateErrorMessage(error.message,error.statusCode)
    }
}






