import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const contactApi = createApi({
    reducerPath: "contactApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}`, credentials: "include" }),
    tagTypes: ["contact"],
    endpoints: (builder) => {
        return {
            getContact: builder.query({
                query: () => {
                    return {
                        url: "/contact-us/get",
                        method: "GET"
                    }
                },
                providesTags: ["contact"]
            }),
            VerifyEmail: builder.mutation({
                query: (body) => ({
                    url: "/admin/auth/forgot-password",
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["contact"],
            }),
            VerifyAndReset: builder.mutation({
                query: (body) => ({
                    url: "/admin/auth/verify-and-reset",
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["contact"],
            }),

        }
    }
})

export const { 
    useGetContactQuery,
    useVerifyEmailMutation,
    useVerifyAndResetMutation
 } = contactApi
