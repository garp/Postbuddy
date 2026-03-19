import { baseApi } from '../baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deactivate: builder.mutation({
      query: (params) => ({
        url: `/user/deactive?reason=${params}`,
        method: 'GET',
      }),
    }),
    updateUser: builder.mutation({
      query: (credentials) => ({
        url: '/user/update',
        method: 'PUT',
        body: credentials,
      }),
    }),
  }),
});

export const { useDeactivateMutation, useUpdateUserMutation } = userApi;
