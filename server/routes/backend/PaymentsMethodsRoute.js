import express from "express"
import { destroy, findAll, findOne, restore, store, update } from "../../controllers/backend/PaymentsMethodsController.js"
import { validate } from "../../validators/Validator.js"
import { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, validateDuplicate, validateUpdate } from "../../validators/custom/PaymentsMethodsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/payments-methods")
.get(VerifyToken,findAll)

routes.route("/payments-supports")
.get(findAll)

routes.route("/payments-methods/:id")
.get(VerifyToken,findOne)

routes.route("/payments-methods/add")
.post(VerifyToken,fileUploads("payments_methods","payments","./public/payments").any(),validate(rule),validateDuplicate,store)
routes.route("/payments-methods/update")
.put(VerifyToken,fileUploads("payments_methods","payments","./public/payments").any(),validate(rule),validateDuplicate,validateUpdate,update)

routes.route("/payments-methods/destroy")
.delete(VerifyToken,destroy)

routes.route("/payments-methods/restore")
.put(VerifyToken,restore)

export default routes