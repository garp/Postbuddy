import { baseApi } from "../baseApi";

export const brandVoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBrandVoice: builder.mutation({
      query: (data) => ({
        url: `/brandVoice`,
        method: 'POST',
        body: data,
      }),
    }),
    getBrandVoice: builder.query({
      query: () => ({
        url: `/brandVoice`,
        method: 'GET',
      }),
    }),
    activateBrandVoice: builder.mutation({
      query: (id) => ({
        url: `/brandVoice/${id}`,
        method: 'PUT',
      }),
    }),
    deleteBrandVoice: builder.mutation({
      query: (id) => ({
        url: `/brandVoice/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useCreateBrandVoiceMutation, useGetBrandVoiceQuery, useActivateBrandVoiceMutation, useDeleteBrandVoiceMutation } = brandVoiceApi;
