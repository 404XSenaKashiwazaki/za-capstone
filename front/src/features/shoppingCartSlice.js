import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    message: null,
    options: localStorage.getItem("shoppingCart") ? JSON.parse(localStorage.getItem("shoppingCart")) : null,
    checkedId: [],
    quantity: localStorage.getItem("shoppingCart") ? JSON.parse(localStorage.getItem("shoppingCart")).orders.orders_item.length : 0,
    carts: [],
    checkouts: localStorage.getItem("checkout") ? JSON.parse(localStorage.getItem("checkout")) : null,
    totals: 0,
    shoppingCarts: localStorage.getItem("shoppingCarts") ? JSON.parse(localStorage.getItem("shoppingCarts")) : [],
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
        setShoppingCart: (state,action) => { 
            const { UserId, ProductId, quantity, checkedId } = action.payload
            const userOrder = state.shoppingCarts.find((order) => order.UserId == UserId)
            if (userOrder) {
                const ordersItem = userOrder.ordersItem.findIndex((d) => d.ProductId == ProductId);

                (ordersItem != -1) 
                ? userOrder.ordersItem[ordersItem].quantity += quantity
                : userOrder.ordersItem.push({ ProductId, quantity })

                const t = userOrder.ordersItem[ordersItem]?.quantity
                if(t < 1) userOrder.ordersItem.splice(ordersItem,1) 

                userOrder.ordersItem = userOrder.ordersItem.map(e=> {
                    let re = ""
                    if(checkedId){
                        re = checkedId.find(e2 => e2.ProductId == e.ProductId)
                    }
                    return { ...e, checked: re?.checked || false }
                })
                const shoppingCarts = state.shoppingCarts.map((order) => order.UserId == UserId ? { 
                    ...userOrder,
                    qty: userOrder.ordersItem.length 
                } : order)
                state.shoppingCarts = shoppingCarts

                localStorage.setItem("shoppingCarts",JSON.stringify(shoppingCarts))
                localStorage.setItem("checkout",JSON.stringify(userOrder))
            } else {
                const ordersItem = [{ ProductId, quantity }]
                const shoppingCarts = [ ...state.shoppingCarts, { UserId, ordersItem: ordersItem, qty: ordersItem.length }]
                state.shoppingCarts =  shoppingCarts
                localStorage.setItem("shoppingCarts",JSON.stringify(shoppingCarts))
            }
        },
        setShoppingCartOrderItem: (state,action) => {
            let { UserId, ordersItem, checkedId } = action.payload
            ordersItem = ordersItem.map(e=> {
                    let re = ""
                    if(checkedId){
                        re = checkedId.find(e2 => e2.ProductId == e.ProductId)
                    }
                    return { ...e, checked: re?.checked || false }
                })
            const shoppingCarts = state.shoppingCarts.map(e=> e.UserId == UserId ? { ...e, ordersItem, qty: ordersItem.length } : e)
            state.shoppingCarts = shoppingCarts
            const checkoutOrderItems = shoppingCarts.find((order) => order.UserId == UserId)
            localStorage.setItem("shoppingCarts",JSON.stringify(shoppingCarts))
            
            localStorage.setItem("checkout",JSON.stringify(checkoutOrderItems))
        },
        removeShoppingCart: (state,action) => {
            const { UserId, ordersItem } = action.payload
            const shoppingCarts = state.shoppingCarts.map((order) => {
                const delOrdersItems = order.ordersItem.filter((item) => !ordersItem.find(e=> item.ProductId == e.ProductId))
                if(order.UserId == UserId) return { ...order,ordersItem: delOrdersItems,qty: delOrdersItems.length}
                return order
            })
            state.shoppingCarts = shoppingCarts
    
            const checkoutOrderItems = shoppingCarts.find((order) => order.UserId == UserId)
            localStorage.setItem("shoppingCarts",JSON.stringify(shoppingCarts))
            localStorage.setItem("checkout",JSON.stringify(checkoutOrderItems))
        },
        removeTotals: state => { },
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
    setShoppingCart,
    removeShoppingCart,
    setShoppingCartOrderItem,
} = shoppingCartSlice.actions


export default shoppingCartSlice.reducer