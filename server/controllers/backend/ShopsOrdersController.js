import {
    findAll as findAllService,
    findOne as findOneService,
    store as storeService,
    update as updateService,
    restore as restoreService,
    destroy as destroyService,
    findAllMessage as findAllMessageService,
} from "../../service/backend/ShopsOrdersService.js"
import { CreateResponse } from "../../utils/CreateResponse.js"

export const findAll = async (req,res,next) => {
    try {
        const response = await findAllService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const findAllMessage = async (req,res,next) => {
    try {
        const response = await findAllMessageService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const findOne = async (req,res,next) => {
    try {
        const response = await findOneService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const store = async (req,res,next) => {
    try {
        const response = await storeService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const update = async (req,res,next) => {
    try {
        const response = await updateService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const restore = async (req,res,next) => {
    try {
        const response = await restoreService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}



export const destroy = async (req,res,next) => {
    try {
        const response = await destroyService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


