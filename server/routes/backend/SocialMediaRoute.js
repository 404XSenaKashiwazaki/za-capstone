import express from "express"
import { destroy, findAll, findOne, restore, store, update } from "../../controllers/backend/SocialMediaController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, validateDuplicate, validateUpdate } from "../../validators/custom/SocialMediaCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/social-media")
.get(VerifyToken,findAll)

routes.route("/social-media/:id")
.get(VerifyToken,findOne)

routes.route("/social-media/add")
.post(fileUploads("socialMedia","profile","").any(),validate(rule),validateDuplicate,store)
routes.route("/social-media/update")
.put(VerifyToken,fileUploads("socialMedia","profile","").any(),validate(rule),validateDuplicate,validateUpdate,update)

routes.route("/social-media/destroy")
.delete(VerifyToken,destroy)

routes.route("/social-media/restore")
.put(VerifyToken,restore)

export default routes