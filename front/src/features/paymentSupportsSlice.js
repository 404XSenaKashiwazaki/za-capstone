import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    message: null,
    options: [],
}

export const paymentSupportsSlice = createSlice({
    name: "paymentSupports",
    initialState,
    reducers: {
        resetState: (state) => {
            state.options = []
            state.message = null
        },
        removeMessage: (state) => {
            state.message = null
        },
        setMessage: (state,action) => {
            state.message = action.payload
        },
        setOptions: (state,action) => {
            state.options = action.payload
        },
    },
    extraReducers: _ =>{
    }
})

export const {
    resetState,
    removeMessage,
    setMessage,
    setOptions,
} = paymentSupportsSlice.actions

export default paymentSupportsSlice.reducer