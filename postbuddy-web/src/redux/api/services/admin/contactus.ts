import { baseApi } from '../../baseApi';

export const contactUsApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    contactus: builder.mutation({
      query: (data: any) => ({
        url: `/admin/contactus`,
        method: 'POST',
        body: data,
      }),
    }),
    talkToSales: builder.mutation({
      query: (data: any) => ({
        url: `/admin/talkToSales`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useContactusMutation, useTalkToSalesMutation } = contactUsApi;
