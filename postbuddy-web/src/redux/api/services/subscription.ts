import { baseApi } from '../baseApi';

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveSubscription: builder.query({
      query: (id) => ({
        url: `/payment/subscription?customerId=${id}&status=active`,
        method: 'GET',
      }),
    }),
    cancelActiveSubscription: builder.mutation({
      query: ({ reason }) => ({
        url: `/payment/subscription/cancel?reason=${reason}`,
        method: 'POST',
      }),
    }),
    deleteCreatedSubscription: builder.mutation({
      query: (params) => ({
        url: `/payment/subscription?${params}`,
        method: 'DELETE',
      }),
    }),
    lazyCheckActiveSubscription: builder.query({
      query: () => ({
        url: `/payment/subscription/active`,
        method: 'GET',
      })
    }),
  }),
});

export const {
  useGetActiveSubscriptionQuery,
  useCancelActiveSubscriptionMutation,
  useLazyCheckActiveSubscriptionQuery,
  useDeleteCreatedSubscriptionMutation
} = plansApi;
