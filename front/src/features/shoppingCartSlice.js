import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    message: null,
    options: localStorage.getItem("shoppingCart") ? JSON.parse(localStorage.getItem("shoppingCart")) : null,
    checkedId: [],
    quantity: localStorage.getItem("shoppingCart") ? JSON.parse(localStorage.getItem("shoppingCart")).orders.orders_item.length : 0,
    carts: [],
    checkouts: localStorage.getItem("checkout") ? JSON.parse(localStorage.getItem("checkout")) : null,
    totals: 0
}

export const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {
        resetState: (state) => {
            // localStorage.clear("shoppingCart")
            // localStorage.clear("checkout")
            // state.options = []
            state.checkedId = []
            state.message = null
            state.quantity = 0
            state.carts = []
            // state.checkouts = []
        },
        setQuantity: (state, action) => {
            state.quantity = action.payload
        },
        setJumlah: (state, action) => {
            state.quantity = action.payload
        },
        removeQuantity: (state) => {
            state.quantity = 0
        },
        removeMessage: (state) => {
            state.message = null
        },
        setMessage: (state,action) => {
            state.message = action.payload
        },
        setOptions: (state,action) => {
            state.options = action.payload
            localStorage.setItem("shoppingCart",JSON.stringify(action.payload))
        },
        setRemoveOption: (state) => {
            localStorage.removeItem("shoppingCart")
            state.options = []
        },
        setCheckout: (state,action) => {
            state.checkouts = action.payload
            localStorage.setItem("checkout",JSON.stringify(action.payload))
        },
        removeCheckout: (state) => {
            localStorage.removeItem("checkout")
            state.checkouts = []
        },

        setCheckedId: (state,action) => {
            state.checkedId = action.payload
        },
        setShoppingCarts: (state, action) => {
            state.carts = action.payload
        },
        resetShoppingCarts: state => {
            state.carts = []
        },
        setTotals: (state, action) =>{  },
        removeTotals: state => { }
    },
    extraReducers: _ =>{
    }
})

export const {
    resetState,
    removeMessage,
    setCheckedId,
    setMessage,
    setOptions,
    setRemoveOption,
    removeQuantity,
    setJumlah,
    setQuantity,
    setShoppingCarts,
    resetShoppingCarts,
    setTotals,
    removeTotals,
    setCheckout,
    removeCheckout,
} = shoppingCartSlice.actions

export default shoppingCartSlice.reducer