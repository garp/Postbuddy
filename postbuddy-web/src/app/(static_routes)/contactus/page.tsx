import ContactUs from '@/components/molecules/ContactUs';
import Footer from '@/components/molecules/Home/Footer';
import Navbar from '@/components/molecules/Home/Navbar';

export const metadata = {
  title: 'Contact Us | PostBuddy AI',
  description:
    'Have questions about PostBuddy AI or scaling your social media engagement? Reach out to our 24/7 friendly support team and get onboard in minutes. We’re here to help!',
  keywords:
    'Contact PostBuddy AI, customer support, social media engagement questions, AI social media tools, PostBuddy AI help, get in touch, PostBuddy support team, contact page, PostBuddy onboarding',
};

export default function ContactPage() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Contact Us</title>
      </head>
      <div className="bg-[#110f1b] min-h-screen overflow-x-hidden relative text-white">
        <Navbar />
        <div className="bg-[#AA72FE] h-[200px] w-[300px] blur-[300px] absolute left-0 top-0"></div>
        <div className="bg-[#00312b] h-[200px] w-[200px] blur-[160px] absolute right-0 bottom-0"></div>

        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="gradient-text text-4xl font-bold text-center text-[#d06eff] mb-4">
            Contact Us
          </p>
          <p className="text-center text-xs md:text-md lg:text-lg xl:text-xl text-white max-w-xl mb-8">
            Got any questions about the product or scaling on our platform? We are
            here to help. Chat to our friendly team 24/7 and get onboard in less
            than 5 minutes.
          </p>
          <ContactUs />
        </div>
        <Footer />
      </div>
    </>
  );
}
