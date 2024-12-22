import { DataTypes } from "sequelize"
import sequelize from "../../config/Database.js"

const SocialMedia = sequelize.define("SocialMedia",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    nama: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
    },
    icon: {
        type: DataTypes.STRING,
        defaultValue: "faHastag"
    }
},{
    freezeTableName: true,
    paranoid: true
})

export default SocialMedia