
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/layouts/MainLayout';
import { Separator } from '@/components/ui/separator';

const UseOfCookies = () => {
  return (
    <MainLayout paddingTop="large">
      <Helmet>
        <title>Use of Cookies | TopHat Security</title>
        <meta name="description" content="Use of Cookies policy for TopHat Security" />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Use of Cookies</h1>
        <Separator className="mb-8" />

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-bold mt-8 mb-4">What are cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">How we use cookies</h2>
          <p>
            TopHat Security uses cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device for a set period).
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Types of cookies we use</h2>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas of the website, and authentication. The website cannot function properly without these cookies.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance and user experience.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Functional Cookies</h3>
          <p>
            These cookies allow the website to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Targeting/Advertising Cookies</h3>
          <p>
            These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Managing cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Third-party cookies</h2>
          <p>
            Some cookies on our site are set by third-party services. We use these services to enhance functionality and improve user experience. These third parties may collect information about your online activities over time and across different websites.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Updates to this policy</h2>
          <p>
            We may update this cookie policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed about our use of cookies.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Contact us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <div className="ml-8 mt-4">
            <p>
              Email: <a href="mailto:info@tophatsecurity.com" className="text-[#cc0c1a] hover:underline">info@tophatsecurity.com</a><br />
              Phone: <a href="tel:18009895718" className="text-[#cc0c1a] hover:underline">1-800-989-5718</a>
            </p>
          </div>

          <p className="mt-8">
            <strong>Effective Date:</strong> This Use of Cookies policy was last updated on December 13th, 2024.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default UseOfCookies;
