// services/fileUpload.js
import { baseApi } from '../baseApi';

export const fileUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/file/upload', 
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useUploadFileMutation } = fileUploadApi;
