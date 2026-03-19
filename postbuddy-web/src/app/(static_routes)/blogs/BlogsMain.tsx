'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '@/components/molecules/blogs/SkeletonLoader';
import SkeletonGridLoader from '@/components/molecules/blogs/SkeletonGridLoader';

import { FaArrowRight } from 'react-icons/fa6';
import { FaArrowLeft } from 'react-icons/fa';
import { CgArrowTopRight } from 'react-icons/cg';

const BlogsMain = () => {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const featuredPageSize = 3;
  const pageSize = 6;

  const [featuredBlogData, setFeaturedBlogData] = useState<any[]>([]);
  const [nonFeaturedBlogData, setNonFeaturedBlogData] = useState<any[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_STRAPI_BASE_URL;

  const handleBlogDataClick = (metaTitle: any) => {
    const slug = metaTitle?.slug;
    router.push(`/blogs/${slug}`);
  };

  const fetchFeaturedBlog = () => {
    setLoader(true);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      // url: `${baseUrl}/api/blogs?populate=*`,
      url: `${baseUrl}/api/blogs?[populate][image][fields][0]=url&populate[seo]=true&populate=tags&pagination[page]=1&pagination[pageSize]=${featuredPageSize}&filters[isFeatured][$eq]=true`,

      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setFeaturedBlogData(response.data.data);
        } else {
          console.error('Data is not an array:', response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  // Fetch non-featured Blogs
  const fetchNonFeaturedBlog = async (page: any) => {
    setLoader(true);
    const configNonFeatured = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/blogs?[populate][image][fields][0]=url&populate[seo]=true&populate=tags&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[isFeatured][$eq]=false`,
      headers: {},
    };

    axios
      .request(configNonFeatured)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setNonFeaturedBlogData(response.data.data);

          // Update total pages based on the total number of non-featured case studies
          const total = response.data.meta.pagination.total;
          const totalPages = Math.ceil(total / pageSize);
          setPageCount(totalPages); // Set correct page count based on non-featured data
        } else {
          console.error('Data is not an array:', response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchFeaturedBlog();
    fetchNonFeaturedBlog(currentPage);
  }, [currentPage]);

  useEffect(() => {
    featuredBlogData.forEach((blog) => {
      console.log('Full Image URL:', `${baseUrl}${blog?.image?.[0]?.url}`);
    });
  }, [featuredBlogData]);

  // Handle page change and update the URL
  const handleNextPage = () => {
    if (currentPage < pageCount) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      router.push(`/blogs?page=${nextPage}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      router.push(`/blogs?page=${prevPage}`);
      fetchNonFeaturedBlog(prevPage);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    router.push(`/blogs?page=${page}`);
    fetchNonFeaturedBlog(page);
  };

  const randomColor = (id: any) => {
    const colors = [
      '#3538CD',
      '#C11574',
      '#1565c0',
      '#C4320A',
      '#3538CD',
      '#C11574',
    ];
    // Simple hashing function to distribute colors more evenly
    const index = Math.abs((id * 2654435761) % colors.length);
    return colors[index];
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <section className="relative flex flex-col justify-center items-center overflow-hidden">
      <div className="px-3 md:px-10 lg:px-[112px]">
        <div className="section flex flex-col gap-3 items-center w-[100%] px-10 py-[60px] md:py-[96px]">
          <h1 className=" text-[#5f40ab] text-[20px] md:text-[50px] font-[500]">
            Our Blog
          </h1>
          <p className="text-center text-[#ffffff] text-[18px] md:text-[24px] font-[500]">
            Discover tech insights, trends, and expert articles.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-[96px]">
          {currentPage === 1 && (
            <div className="section">
              <div className="flex flex-col">
                <h1 className="text-[#5f40ab] text-[20px] font-[500] md:text-[24px]">
                  Featured blog posts
                </h1>
                <div className="flex flex-col lg:flex-row gap-[30px] mt-8">
                  <div className="lg:w-[50%] flex flex-col gap-[20px] lg:gap-[4%]">
                    {loader ? (
                      <SkeletonLoader />
                    ) : (
                      featuredBlogData?.slice(0, 1).map((blogData, index) => (
                        <div
                          key={index}
                          className="cursor-pointer flex flex-col gap-5 transform transition-transform duration-300 ease-in-out hover:scale-105"
                          onClick={() => handleBlogDataClick(blogData)}
                        >
                          {blogData?.image?.[0]?.url ? (
                            <div className="h-[410px]">
                              <Image
                                src={`${baseUrl}${blogData?.image?.[0]?.url}`}
                                alt={blogData.title || 'Blog Image'}
                                width={1000}
                                height={1000}
                                className="h-[410px] object-cover rounded-[12px]"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-[100%] flex items-center justify-center bg-gray-200">
                              <p className="text-center text-sm text-gray-500">
                                Image not available 1
                              </p>
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            <span className=" flex items-center text-[#5f40ab] text-[16px] font-[500] md:text-[16px]">
                              {blogData?.author}
                              <span className="flex items-center">
                                <p className="mb-2 text-[#5f40ab] text-[20px] font-[500]">
                                  .
                                </p>
                              </span>
                              {new Date(blogData.createdAt).toLocaleDateString(
                                'en-GB',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                },
                              )}
                            </span>
                            <div className="flex justify-between items-start gap-2">
                              <h2 className=" text-[18px] font-[500] md:text-[24px] text-white">
                                {blogData.title}
                              </h2>
                              <div className="text-[20px] text-white">
                                <CgArrowTopRight />
                              </div>
                            </div>
                            <p className="text-white w-[85%] text-[16px] font-[500] md:text-[16px]">
                              {blogData.shortDescription?.slice(0, 500)}...
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {blogData?.tags?.map((tag: any) => (
                              <button
                                key={tag.id}
                                style={{
                                  color: randomColor(tag.id),
                                }}
                                className="text-[14px] font-[500] leading-[20px] bg-[#F9F5FF] rounded-[16px] px-3 py-2 hover:bg-[#EEF4FF] transition duration-300"
                              >
                                {tag.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="lg:w-[50%] flex flex-col gap-[20px] lg:gap-[4%]">
                    {loader ? (
                      <div className="flex flex-col gap-3">
                        <SkeletonGridLoader />
                        <SkeletonGridLoader />
                      </div>
                    ) : (
                      featuredBlogData?.slice(1, 3).map((blogData, index) => (
                        <div
                          key={index}
                          className="cursor-pointer flex flex-col md:flex-row gap-5 h-[48%] transform transition-transform duration-300 ease-in-out hover:scale-105"
                          onClick={() => handleBlogDataClick(blogData)}
                        >
                          <div className="w-full md:w-[50%]">
                            {blogData?.image?.[0]?.url ? (
                              <Image
                                src={`${baseUrl}${blogData?.image?.[0]?.url}`}
                                alt={blogData.title || 'Blog Image'}
                                width={1000}
                                height={1000}
                                className="h-[270px] object-cover rounded-[12px]"
                              />
                            ) : (
                              <div className="w-full h-[100%] flex items-center justify-center bg-gray-200">
                                <p className="text-center text-sm text-gray-500">
                                  Image not available 1
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="w-full md:w-[50%]">
                            <div className="flex flex-col gap-2">
                              <span className=" flex items-center text-[#5f40ab] text-[16px] font-[500] md:text-[16px]">
                                {blogData?.author}
                                <span className="flex items-center">
                                  <p className="mb-2 text-[#5f40ab] text-[20px] font-[500] ">
                                    .
                                  </p>
                                </span>
                                {new Date(
                                  blogData.createdAt,
                                ).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>

                              <h2 className="text-[#ffffff] text-[18px] font-[500] md:text-[24px] ">
                                {blogData.title}
                              </h2>
                              <p className="text-white text-[16px] font-[500] md:text-[16px]">
                                {blogData.shortDescription?.slice(0, 100)}...
                              </p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {blogData?.tags?.map((tag: any) => (
                                <button
                                  key={tag.id}
                                  style={{
                                    color: randomColor(tag.id),
                                  }}
                                  className="text-[14px] font-[500] leading-[20px] bg-[#F9F5FF] rounded-[16px] px-3 py-2 hover:bg-[#EEF4FF] transition duration-300"
                                >
                                  {tag.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="section">
            <div className="flex flex-col gap-[30px]">
              <h1 className="text-[#5f40ab] text-[20px] font-[500] md:text-[24px]">
                All blog posts
              </h1>

              <div className="flex gap-10 md:gap-6 xl:gap-10 flex-wrap">
                {/* {Array.isArray(nonFeaturedBlogData) && */}
                {loader ? (
                  <div className="w-[100%] flex gap-2">
                    {[...Array(3)].map((index) => (
                      <div key={index} className="w-[100%]">
                        <SkeletonLoader />
                      </div>
                    ))}
                  </div>
                ) : nonFeaturedBlogData?.length > 0 ? (
                  nonFeaturedBlogData?.map((blogData, index) => {
                    return (
                      <div
                        key={index}
                        className=" cursor-pointer w-[100%] md:w-[48%] xl:w-[31.1%] gap-2 flex flex-col rounded-[9px] transform transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={() => handleBlogDataClick(blogData)}
                      >
                        {blogData?.image?.[0]?.url ? (
                          <div className="w-full">
                            <Image
                              src={`${baseUrl}${blogData?.image?.[0]?.url}`}
                              alt={blogData.title || 'Blog Image'}
                              width={1000}
                              height={1000}
                              className="h-[300px] object-cover rounded-[12px]"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-[100%] flex items-center justify-center bg-gray-200">
                            <p className="text-center text-sm text-gray-500">
                              Image not available 1
                            </p>
                          </div>
                        )}
                        <div className="flex flex-col gap-4 justify-between h-[calc(100%_-_308px)]">
                          <div className="flex flex-col gap-3">
                            <span className=" flex items-center text-[#5f40ab] text-[16px] font-[500] md:text-[16px]">
                              {blogData?.author}
                              <span className="flex items-center">
                                <p className="mb-2 text-[#5f40ab] text-[20px] font-[500] ">
                                  .
                                </p>
                              </span>
                              {new Date(blogData.createdAt).toLocaleDateString(
                                'en-GB',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                },
                              )}
                            </span>
                            <div className="flex justify-between items-start gap-2">
                              <h2 className="text-[#ffffff] text-[18px] font-[500] md:text-[19px] lg:text-[22px]">
                                {blogData.title?.slice(0, 60)}
                              </h2>
                              <div className="text-white text-[20px]">
                                <CgArrowTopRight />
                              </div>
                            </div>

                            <p className="text-[#ffffff] w-[85%] text-[16px] font-[500] md:text-[16px]">
                              {blogData?.shortDescription?.slice(0, 100)}
                              ...
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {blogData?.tags?.map((tag: any) => (
                              <button
                                key={tag.id}
                                style={{
                                  color: randomColor(tag.id),
                                }}
                                className="text-[14px] font-[500] leading-[20px] bg-[#F9F5FF] rounded-[16px] px-3 py-2 hover:bg-[#EEF4FF] transition duration-300"
                              >
                                {tag.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No Blogs available</p>
                )}
              </div>

              {/* Pagination Controls */}
              <div className=" w-full flex justify-center pt-[40px] md:pt-[40px] xl:my-[100px]">
                <div className="flex gap-2 w-full justify-around">
                  {/* Previous Button */}
                  <div>
                    <button
                      className={`flex items-center gap-1 text-[#5f40ab] text-[14px] md:text-[16px] font-[600] p-3 md:px-[20px] md:py-[10px] rounded-[8px] transition-shadow duration-300 ${
                        currentPage === 1
                          ? 'text-[#785cc0] cursor-not-allowed'
                          : ''
                      }`}
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <FaArrowLeft className="ml-2" />
                      Previous
                    </button>
                  </div>

                  {/* Page Numbers */}
                  <div className="flex gap-3">
                    {[...Array(pageCount)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageClick(i + 1)}
                        className={`px-3 py-2 text-[14px] md:text-[16px] font-[600] rounded-[8px] ${
                          currentPage === i + 1
                            ? 'bg-[#ffffff] text-[#5f40ab] shadow-[0_2px_10px_rgba(0,0,0,0.3)] '
                            : 'bg-white text-[#785cc0]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <div>
                    <button
                      className={`flex items-center gap-1 text-[#5f40ab] text-[14px] md:text-[16px] font-[600] p-3 md:px-[20px] md:py-[10px] rounded-[8px] transition-shadow duration-300 ${
                        currentPage === pageCount
                          ? 'text-[#785cc0] cursor-not-allowed'
                          : ''
                      }`}
                      onClick={handleNextPage}
                      disabled={currentPage === pageCount}
                    >
                      Next
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsMain;
