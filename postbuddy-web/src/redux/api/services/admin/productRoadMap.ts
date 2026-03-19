import { baseApi } from '../../baseApi';

export const roadMapApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    upvote: builder.mutation({
      query: (id:string) => ({
        url: `/admin/product-roadmap/${id}`,
        method: 'PUT',
      }),
    }),
    getAllProductRoadMaps: builder.query({
      query: () => ({
        url: `/admin/product-roadmap`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllProductRoadMapsQuery, useUpvoteMutation } = roadMapApi;
