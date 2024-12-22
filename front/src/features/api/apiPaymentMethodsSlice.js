import {apiSlice} from "./apiSlice"


const invalidatesTags = [{ type: "paymentMethods", id: "LIST-PAYMENTS-METHODS" }]
const apiPaymentMethodsdSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //backend 
        findAllPaymentsMethodsBack: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return {
                    url: `payments-methods?search=${search}&page=${page}&per_page=${perPage}&type=${restore}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.payments_methods.length > 0
                ? res.response.payments_methods.map(e=> ({ type: "paymentMethods", id: e.id },{ type: "paymentMethods", id: "LIST-PAYMENTS-METHODS" }))
                : [{ type: "paymentMethods", id: "LIST-PAYMENTS-METHODS" }]
            }
        }),
        findOnePaymentsMethodsBack: builder.query({
            query: ({ id }) => ({ url: "payments-methods/"+id, method: "GET" }),
            providesTags: result => {
                return result?.response?.payments_methods
                ? [{ type: "paymentMethods", id: result.response.payments_methods.id },{ type: "paymentMethods", id: "LIST-PAYMENTS-METHODS" }]
                : [{ type: "paymentMethods", id: "LIST-PAYMENTS-METHODS" }]
            }
        }),
        storePaymentsMethodsBack: builder.mutation({
            query(data){  
                return { 
                    url:"payments-methods/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),
        updatePaymentsMethodsBack: builder.mutation({
            query(data){
                return { 
                    url:"payments-methods/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),
        restorePaymentsMethodsBack: builder.mutation({
            query(data){
                return { 
                    url:"payments-methods/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),
        destroyPaymentsMethodsBack: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"payments-methods/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),
    })
})

export const {
    useFindAllPaymentsMethodsBackQuery,
    useFindOnePaymentsMethodsBackQuery,
    useUpdatePaymentsMethodsBackMutation,
    useRestorePaymentsMethodsBackMutation,
    useDestroyPaymentsMethodsBackMutation,
    useStorePaymentsMethodsBackMutation,
} = apiPaymentMethodsdSlice