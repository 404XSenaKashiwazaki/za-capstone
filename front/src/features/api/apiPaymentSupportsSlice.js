import { apiSlice } from "./apiSlice"

export const apiPaymentSupportsSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllPaymentSupports: builder.query({
            query: ({perPage}) => {
                return { 
                    url: `payments-supports?search=&page=&per_page=${perPage}&type=`,
                    method: "GET"
                }
            },
            providesTags: result => {

                return result?.response?.sites != null
                ? [{ type: "PaymentSupports", id: result.response.sites?.id },{ type: "PaymentSupports",id: "LIST-PAYMENT-SUPPORTS" }]
                : [{ type: "PaymentSupports", id: "LIST-PAYMENT-SUPPORTS" }]
            },
        }),
    })
})


export const {
    useFindAllPaymentSupportsQuery
} = apiPaymentSupportsSlice
