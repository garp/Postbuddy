import { baseApi } from '../baseApi';

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addApiKey: builder.mutation({
      query: (credentials) => ({
        url: `/apiKey`,
        method: 'POST',
        body: credentials,
      }),
    }),
    getApiKey: builder.query({
      query: () => ({
        url: `/apiKey`,
        method: 'GET',
      }),
    }),
    removeApiKey: builder.mutation({
      query: () => ({
        url: `/apiKey`,
        method: 'DELETE',
      }),
    }),
    getCreds: builder.query({
      query: () => ({
        url: `/comment/count`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAddApiKeyMutation,
  useGetApiKeyQuery,
  useRemoveApiKeyMutation,
  useGetCredsQuery,
} = plansApi;
