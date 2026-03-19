'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ImageLoader from '@/components/molecules/blogs/ImageLoader';
import { Loader } from '@mantine/core';

import { CgArrowTopRight } from 'react-icons/cg';

interface BlogDetailsProps {
  params: {
    slug: string;
  };
}

interface BlogDetail {
  image?: { url: string }[]; // Specify that `image` is an array of objects with a `url` field
  title?: string;
  author?: string;
  createdAt?: string;
  content?: string;
}

interface FeaturedBlog {
  image?: { url: string }[];
  title?: string;
  author?: string;
  createdAt?: string;
  shortDescription?: string;
  tags?: { id: number; name: string }[];
}
const BlogDetails = ({ params }: BlogDetailsProps) => {
  const [imageLoader, setImageLoader] = useState(false);
  const router = useRouter();
  const slug = params.slug;

  const [blogDetailData, setBlogDetailData] = useState<BlogDetail | null>(null);
  const [featuredBlogData, setFeaturedBlogData] = useState<
    FeaturedBlog[] | null
  >(null);
  const featuredPageSize = 3;
  const [loader, setLoader] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_STRAPI_BASE_URL;

  // Function to copy code
  const copyToClipboard = (preElement: any) => {
    const copyButton = preElement.querySelector('.copy-btn');
    if (copyButton) {
      copyButton.style.display = 'none'; // Hide the button
    }
    const code = preElement.innerText;
    navigator.clipboard.writeText(code).then(
      () => {
        alert('Code copied to clipboard!');
      },
      (err) => {
        console.error('Failed to copy code:', err);
      },
    );
    // Restore the copy button after copying
    if (copyButton) {
      copyButton.style.display = 'block'; // Show the button again
    }
  };

  const handleBlogDataClick = (metaTitle: any) => {
    const slug = metaTitle?.slug;
    router.push(`/blogs/${slug}`);
  };

  const fetchFeaturedBlog = () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/blogs?[populate][image][fields][0]=url&[populate][seo]=true&pagination[page]=1&pagination[pageSize]=${featuredPageSize}&filters[isFeatured][$eq]=true`,
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
      });
  };

  useEffect(() => {
    setLoader(true);
    setImageLoader(true);
    if (slug) {
      const fetchBlogDetails = async () => {
        const config = {
          method: 'get',
          url: `${baseUrl}/api/blogs?filters[slug][$eq]=${slug}&populate=image&populate=seo`,
          maxBodyLength: Infinity,
        };

        try {
          const response = await axios.request(config);
          if (
            Array.isArray(response.data?.data) &&
            response.data.data.length > 0
          ) {
            console.log("Data ==> ",response.data.data[0]);
            setBlogDetailData(response.data.data[0]);
          } else {
            console.error('No blog details data found for the given ID.');
          }
        } catch (error) {
          console.error('Error fetching blog details data:', error);
        } finally {
          setLoader(false);
          setImageLoader(false);
        }
      };

      fetchBlogDetails();
    }

    // Fetch featured blogs when the component mounts
    fetchFeaturedBlog();
  }, [slug]);

  useEffect(() => {
    if (blogDetailData?.image && blogDetailData?.image.length > 0) {
      console.log(
        'Full Image URL:',
        `${baseUrl}${blogDetailData.image[0]?.url}`,
      );
    }
  }, [blogDetailData]);

  // Add "Copy" buttons to <pre> tags
  useEffect(() => {
    const container = document.querySelector('.resetcontainer');
    if (!container) return;
    const addCopyButtons = () => {
      const preElements = container.querySelectorAll('pre');
      preElements.forEach((pre) => {
        if (!pre.querySelector('.copy-btn')) {
          const copyButton = document.createElement('button');
          copyButton.innerHTML = '&#x2398; Copy';
          copyButton.className = 'copy-btn';
          copyButton.addEventListener('click', () => {
            copyToClipboard(pre);
          });
          copyButton.style.position = 'absolute';
          copyButton.style.top = '8px';
          copyButton.style.right = '8px';
          copyButton.style.padding = '4px 8px';
          copyButton.style.background = '#444';
          copyButton.style.color = '#fff';
          copyButton.style.border = 'none';
          copyButton.style.cursor = 'pointer';
          copyButton.style.fontSize = '12px';
          pre.style.position = 'relative';
          pre.appendChild(copyButton);
        }
      });
    };

    // Initial addition of copy buttons
    addCopyButtons();

    // Use MutationObserver to watch for changes in the .reset-container container
    const observer = new MutationObserver(() => {
      addCopyButtons();
    });

    observer.observe(container, {
      childList: true, // Watch for direct children changes
      subtree: true, // Watch for all descendant changes
    });

    // Cleanup the observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [blogDetailData]);

  const randomColor = (id: number): string => {
    const colors: string[] = [
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

  return (
    <section className="flex flex-col gap-5">
      <head>
        <title>{blogDetailData?.title}</title>
      </head>
      {loader ? (
        <ImageLoader />
      ) : (
        <>
          <div className="section relative mt-5 bg-blend-overlay w-[100%]">
            {
              imageLoader ? (
                <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center bg-[#110f1b]">
                  <Loader size="xl" color="white" />
                </div>
              ) : (
                blogDetailData?.image && blogDetailData?.image[0]?.url ? (
                  <div className="w-full h-[300px] md:h-[500px] lg:h-[600px] z-[5]">
                    <Image
                      src={`${baseUrl}${blogDetailData?.image[0]?.url}`}
                      alt={blogDetailData.title || 'Blog Image'}
                      layout="fill"
                      className="w-full object-cover"
                      onLoad={() => setImageLoader(false)}
                    />

                    {/* Overlay Effect */}
                    <div className="absolute inset-0 bg-black bg-opacity-50" />

                    <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center text-[20px] md:text-[35px] lg:text-[50px] font-[500] w-[80%] z-10">
                      {blogDetailData?.title}
                    </h1>
                  </div>
                ) : (
                  <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center bg-[#110f1b]">
                    <Loader size="xl" color="white" />
                  </div>
                )
              )
            }
          </div>

          <div className="section text-white">
            <div className="px-[25px] flex flex-col lg:flex-row gap-5 sm:px-[45px] py-3">
              <div className="w-full lg:w-[70%] flex flex-col">
                <span className="text-primary text-[16px] font-[500] md:text-[16px]">
                  {blogDetailData?.author} .{' '}
                  {blogDetailData?.createdAt?.split('T')[0]}
                </span>

                <div className="reset-container" style={{
                  maxWidth: '100%',
                  padding: '0 4px',
                  overflow: 'hidden',
                  overflowX: 'clip',
                  position: 'relative'
                }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blogDetailData?.content || '',
                    }}
                    className=""
                    style={{
                      whiteSpace: 'pre-wrap',
                    }}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[30%]">
                <div className=" flex flex-col gap-5 sticky top-24">
                  <h1 className="text-primary text-[20px] font-[500] md:text-[24px]">
                    Featured blog posts
                  </h1>
                  {featuredBlogData?.map((blogData, index) => (
                    <div
                      key={index}
                      className="cursor-pointer flex flex-col gap-5"
                      onClick={() => handleBlogDataClick(blogData)}
                    >
                      {blogData?.image && blogData?.image[0]?.url ? (
                        <Image
                          src={`${baseUrl}${blogData?.image[0]?.url}`}
                          alt={blogData.title || 'Blog Image'}
                          width={1000}
                          height={1000}
                          className="h-[100%] object-cover rounded-[8px]"
                        />
                      ) : (
                        <div className="w-full h-[100%] flex items-center justify-center bg-gray-200">
                          <p className="text-center text-sm text-gray-500">
                            Image no2t available
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <span className=" flex items-center text-primary text-[16px] font-[500] md:text-[16px]">
                          {blogData?.author}
                          <span className="flex items-center">
                            <p className="mb-2 text-primary text-[20px] font-[500] ">
                              .
                            </p>
                          </span>
                          {blogData.createdAt &&
                            new Date(blogData.createdAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                        </span>
                        <div className="flex justify-between items-start gap-2">
                          <h2 className="text-[#ffffff] text-[18px] font-[500] md:text-[24px]">
                            {blogData.title}
                          </h2>
                          <div className="text-white text-[20px]">
                            <CgArrowTopRight />
                          </div>
                        </div>
                        <p className="text-[#667085] text-[16px] font-[500] md:text-[16px] dark:text-white">
                          {blogData.shortDescription?.slice(0, 100)}...
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {blogData?.tags?.map((tag) => (
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default BlogDetails;
