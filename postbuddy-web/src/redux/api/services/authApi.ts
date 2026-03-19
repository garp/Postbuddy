import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/loginWithOtp',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/user/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (credentials) => ({
        url: `/user/verifyOtp`,
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `/user/forgetPassword`,
        method: 'POST',
        body: email,
      }),
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: `/user/updatePassword`,
        method: 'POST',
        body: credentials,
      }),
    }),
    resendOtp: builder.mutation({
      query: (params) => ({
        url: `/user/resendOtp?email=${params.email}`,
        method: 'GET',
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useUpdatePasswordMutation,
  useResendOtpMutation,
  useGetUserQuery,
} = authApi;
