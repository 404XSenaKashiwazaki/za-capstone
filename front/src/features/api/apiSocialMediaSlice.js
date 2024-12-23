import { apiSlice } from "./apiSlice";

export const apiSocialMediaSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllSocialMedia: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return { url: "social-media?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.socials.length > 0
                ? res.response.socials.map(e=> ({ type: "SocialMedia", id: e.id },{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }))
                : [{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }]
            },
        }),
        findAllSocialMediaFooter: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return { url: "social-media-footer?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.socials.length > 0
                ? res.response.socials.map(e=> ({ type: "SocialMedia", id: e.id },{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }))
                : [{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }]
            },
        }),
        findOneSocialMedia: builder.query({
            query: ({ id }) => {
                return { url: `social-media/${id}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.social
                ? [ {type: "SocialMedia", id: res.response.social.id},{ type: "SocialMedia", id:"LIST-SOCIAL-MEDIA" }] 
                : [{ type: "SocialMedia",id: "LIST-SOCIAL-MEDIA" }]
            }
        }),
        showSocialMedia: builder.query({
            query: () => {
                return { url: "social-media", method: "GET" }
            },
            providesTags: res => {
                return res?.response?.socials.length > 0
                ? res.response.socials.map(e=> ({ type: "SocialMedia", id: e.id },{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }))
                : [{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }]
            },
        }),
        findOneSocialMedia: builder.query({
            query: ({ id }) => {
                return { url: `social-media/${id}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.socials
                ? [ {type: "SocialMedia", id: res.response.socials.id},{ type: "SocialMedia", id:"LIST-SOCIAL-MEDIA" }] 
                : [{ type: "SocialMedia",id: "LIST-SOCIAL-MEDIA" }]
            }
        }),
        // multipel 
        storeMultipelSocialMedia: builder.mutation({
            query(data){
                return { 
                    url:"social-media/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }]
        }),
        updateMultipelSocialMedia: builder.mutation({
            query(data){
                return { 
                    url:"social-media/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }]
        }),
        restoreMultipelSocialMedia: builder.mutation({
            query(data){
                return { 
                    url:"social-media/restore", 
                    method: "PUT", 
                    data: data
                }
            },
            invalidatesTags: [{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }]
        }),
        destroyMultipelSocialMedia: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"social-media/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags: [{ type: "SocialMedia", id: "LIST-SOCIAL-MEDIA" }]
        }),
    })
})

export const {
    useFindAllSocialMediaQuery,
    useFindOneSocialMediaQuery,
    useLazyFindSocialMediaQuery,
    useShowSocialMediaQuery,
    useStoreMultipelSocialMediaMutation,
    useUpdateMultipelSocialMediaMutation,
    useRestoreMultipelSocialMediaMutation,
    useDestroyMultipelSocialMediaMutation,
    useFindAllSocialMediaFooterQuery,
} = apiSocialMediaSlice