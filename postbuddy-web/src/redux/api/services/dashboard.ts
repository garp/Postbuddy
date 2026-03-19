import { baseApi } from '../baseApi';

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGraphData: builder.query({
      query: ({ offset }) => ({
        url: `/comment/graph?offset=${offset}`,
        method: 'GET',
      }),
    }),
    getGraphLtsData: builder.query({
      query: (queries) => {
        let queryString = '';
        for (const key in queries) {
          if (queries[key]) {
            queryString = `${queryString}${queryString ? '&' : '?'}${key}=${queries[key]
              }`;
          }
        }
        return {
          url: `/graph/total-graph${queryString}`,
          method: 'GET',
        };
      },
    }),
    getReleaseNotesData: builder.query({
      query: () => ({
        url: `/release-notes`,
        method: 'GET',
      }),
    }),
    getCommentsData: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, platform } = params;
        let platformQuery = '';
        if (platform) {
          platformQuery = `&platform=${platform}`;
        }
        return {
          url: `/comment/commentsData?pageno=${page}&limit=${limit}${platformQuery}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetGraphDataQuery,
  useGetGraphLtsDataQuery,
  useGetReleaseNotesDataQuery,
  useGetCommentsDataQuery,
} = plansApi;
