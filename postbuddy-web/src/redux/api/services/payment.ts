import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: (data) => ({
        url: '/payment/transactions/create',
        method: 'POST',
        body: data,
      }),
    }),
    verify: builder.mutation({
      query: (data) => ({
        url: `/payment/transactions/verify`,
        method: "POST",
        body: data
      })
    }),
    paymentStatus: builder.query({
      query: (data) => ({
        url: `/payment/transactions/verify-transaction?gatewayPaymentId=${data.gatewayPaymentId}`,
        method: "GET",
      })
    }),
    createTransaction: builder.mutation({
      query: (data) => ({
        url: `/payment/transactions/create-transaction`,
        method: "POST",
        body: data
      })
    }),
    getTransactions: builder.query({
      query: () => ({
        url: `/payment/transactions`,
        method: "GET",
      })
    }),
  }),
});

export const { useCheckoutMutation, useVerifyMutation, usePaymentStatusQuery, useCreateTransactionMutation, useGetTransactionsQuery } = authApi;
