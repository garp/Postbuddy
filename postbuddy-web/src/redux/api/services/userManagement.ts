import { baseApi } from '../baseApi';

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvite: builder.mutation({
      query: ({ email, fullName }) => ({
        url: `/organization/invite`,
        method: 'POST',
        body: { email, fullName },
      }),
    }),
    acceptInvite: builder.mutation({
      query: ({ email, organizationId }) => ({
        url: `/organization/accept-invite`,
        method: 'PUT',
        body: { email, organizationId },
      }),
    }),
    getOrganizationUsers: builder.query({
      query: () => ({
        url: `/organization`,
        method: 'GET',
      }),
    }),
    joinOrganization: builder.query({
      query: ({ organizationId, email }) => ({
        url: `/organization/join/${organizationId}?email=${email}`,
        method: 'GET',
      }),
    }),

  }),
});

export const {
  useSendInviteMutation,
  useAcceptInviteMutation,
  useGetOrganizationUsersQuery,
  useJoinOrganizationQuery,
} = plansApi;
