import { DataTypes } from "sequelize"
import Database from "../../config/Database.js"

const PaymentsMethods = Database.define("PaymentsMethods",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    logo: {
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "default.jpg",
    },
    logoUrl: {
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "http://localhost:8000/payments/default.jpg",
    },
    desk: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Deskripsi Payment"
    }
},{
    freezeTableName: true,
    paranoid: true
})

export default PaymentsMethods
