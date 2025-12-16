import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (body) => ({
        url: "/admin/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    
    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/admin/auth/logout",
        method: "POST",
      }),
    })

  }),

});

export const {
  useLoginAdminMutation,
  useLogoutAdminMutation
} = authApi;
