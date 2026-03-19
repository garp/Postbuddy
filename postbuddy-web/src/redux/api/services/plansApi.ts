import { baseApi } from '../baseApi';

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlans: builder.query({
      query: (type) => ({
        url: `/plans?type=${type}`,
        method: 'GET',
      }),
    }),
    getPlan: builder.query({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllPlansQuery, useGetPlanQuery } = plansApi;
