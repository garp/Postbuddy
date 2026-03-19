import axios from 'axios';
import BlogDetails from './BlogDetails';
import Navbar from '@/components/molecules/Home/Navbar';
import Footer from '@/components/molecules/Home/Footer';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_API_STRAPI_BASE_URL;

  // https://cms.postbuddy.ai/api/blogs?filters[slug][$eq]=introduction-to-post-buddy-ai-1&populate=image&populate=seo

  const config = {
    method: 'GET',
    url: `${baseUrl}/api/blogs?filters[slug][$eq]=${slug}&populate=image&populate=seo`,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios.request(config);
    if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
      return {
        title: response.data.data[0].title || 'Default Title',
        description:
          response.data.data[0].shortDescription || 'Default Description',
        keywords: response.data.data[0].metaKeywords || 'default, keywords',
      };
    } else {
      console.error('No blog details data found for the given ID.');
    }
  } catch (error) {
    console.error('Error fetching blog details data:', error);
  }
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const capitalized = slug.replace(/-/g, " ")
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
  return (
    <>
      <head>
        <title>{capitalized}</title>
      </head>

      <div className="bg-[#110f1b]">
        <div className='z-[50] pt-1 pb-4 z-[50] absolute top-0 left-0 w-full  '>
          <Navbar />
        </div>
        <div className='pt-4'>
          <BlogDetails params={{ slug }} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Page;
