
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/layouts/MainLayout';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  return (
    <MainLayout paddingTop="large">
      <Helmet>
        <title>Privacy Policy | TopHat Security</title>
        <meta name="description" content="Privacy policy for TopHat Security" />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <Separator className="mb-8" />

        <div className="prose dark:prose-invert max-w-none">
          <p>
            <strong>TOPHAT|SECURITY</strong> understands the importance of your personal privacy. Therefore, we have created this Privacy Policy so that you know how we use and disclose your information when you make it available to us. The Privacy Policy below discloses our practices regarding information collection and usage for the website located at <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a>, the related mobile website, and the mobile application (collectively, the "Websites") and the service provided thereon (the "Service").
          </p>
          
          <p className="font-bold mt-6">
            By using or accessing the Websites and the Service, you signify your agreement to be bound by this Privacy Policy. IF YOU DO NOT AGREE TO THIS PRIVACY POLICY YOU MAY NOT ACCESS OR OTHERWISE USE OUR SERVICE OR PARTICIPATE IN OUR SERVICES.
          </p>
          
          <p className="mt-6">
            Key aspects of our privacy practices described in this Privacy Policy include the following explanations:
          </p>
          
          <ul className="list-disc pl-8 mt-4">
            <li>The information we collect and why we collect it;</li>
            <li>How we use that information;</li>
            <li>How we share information; and</li>
            <li>The choices we offer.</li>
          </ul>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Personally Identifiable Information That We Collect:</h2>
          <p>
            We may ask you for, or you may voluntarily submit, personally identifiable information when you are using the Service. The personally identifiable information which you may provide to us could include, but is not limited to:
          </p>
          
          <ul className="list-disc pl-8 mt-4">
            <li>Your name</li>
            <li>Your contact information (including, without limitation, address and email address);</li>
            <li>Your IP address; and</li>
            <li>Other personal information.</li>
          </ul>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Non-Personal Or Aggregate Information That We Collect:</h2>
          <p>
            When you access our Service, we may automatically collect non-personally identifiable information from you, such as IP host address, web pages viewed, browser type, operating system, referring service, search information, device type, page views, usage and browsing habits on the Service and similar data. We may also aggregate demographic information collected from our users (such as the number of users in a particular geographical location) in a manner which does not identify any one individual. We may also aggregate information collected offline in connection with the Service, obtain non-personally identifiable information from third party sources and develop aggregate information by anonymizing previously collected personally identifiable information.
          </p>
          
          <p className="mt-4">
            It is possible at times when collecting non-personally identifiable information through automatic means that we may unintentionally collect or receive personally identifiable information that is mixed in with the non-personally identifiable information. While we will make reasonable efforts to prevent such incidental data collection, the possibility still exists. If you believe that we have inadvertently collected your personal information, please notify us at <a href="mailto:info@tophatsecurity.com" className="text-[#cc0c1a] hover:underline">info@tophatsecurity.com</a>.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Information Usage:</h2>
          <p>
            We will only use your personally identifiable information as described below, unless you have specifically consented to another type of use, either at the time the personally identifiable information is collected from you or through some other form of consent from you or notification to you:
          </p>
          
          <ul className="list-disc pl-8 mt-4">
            <li>We may share your personally identifiable information collected in connection with providing the Service.</li>
            <li>We may use your personally identifiable information to respond to your inquires or requests.</li>
            <li>We may use your personally identifiable information to send you emails from time to time about our services, but we will not provide your personally identifiable information to third parties for them to contact you directly unless otherwise permitted by this Privacy Policy or you provide your consent.</li>
            <li>We may share your personally identifiable information with third parties (collectively, the "Third Party Vendors") to further the purpose for which you provided such information to us. For example, we may share your information with Elastic Email, for the purpose of sending emails. We urge you to read the privacy practices of all of our Third Party Vendors before submitting any personally identifiable information through the Service.</li>
            <li>We may disclose personally identifiable information as required by law or legal process.</li>
            <li>We may disclose personally identifiable information to investigate suspected fraud, harassment or other violations of any law, rule or regulation, or the terms or policies for our services or our sponsors.</li>
            <li>We may transfer your personally identifiable information in connection with the sale or merger or change of control of TOPHAT|SECURITY or the division responsible for the services with which your personally identifiable information is associated.</li>
            <li>We may share your personally identifiable information with an affiliate of TOPHAT|SECURITY who is in the same corporate family as us as long as their privacy practices are substantially similar to ours.</li>
          </ul>
          
          <p className="mt-4">
            Non-personally identifiable or aggregate information may be used by us for any purposes permitted by law and may be shared with any number of parties, provided that such information shall not specifically identify you.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Cookies and Similar Technologies:</h2>
          <p>
            "Cookies" are pieces of information that may be placed on your computer by a service for the purpose of facilitating and enhancing your communication and interaction with that service. Many services use cookies for these purposes. We may use cookies (and similar items such as clear gifs, web beacons, tags, etc.) on our Service to customize your visit and for other purposes to make your visit more convenient or to enable us to enhance our Service. We may also use and place cookies (and similar items) on your computer from our third party service providers in connection with the Service, such as an analytics provider that helps us manage and analyze Service usage, as described more fully below. In addition, our advertisers and business partners may set cookies and similar items on your computer when you use our Service. You may stop or restrict the placement of cookies on your computer or flush them from your browser by adjusting your web browser preferences, in which case you may still use our Service, but it may interfere with some of its functionality. Cookies and similar items are not used by us to automatically retrieve personally identifiable information from your computer without your knowledge.
          </p>
          
          <p className="mt-4">
            If you delete your cookies, change browsers or use a different cookie, our cookie (or an opt-out cookie) may no longer work and you will have to reinput (or opt-out) again.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Analytics and Conversion Tracking:</h2>
          <p>
            We may use analytics services that use cookies, javascript and similar technologies to help us analyze how users use the Service. The information generated by these services about your use of the Service (including your IP address or a truncated version of your IP address) is transmitted to and stored by analytics service providers on their servers. Those service providers will use this information for the purpose of evaluating your, and other users', use of the Service, compiling reports for us on website activity and providing other services relating to website activity and Internet usage.
          </p>
          
          <p className="mt-4">
            We may collect information about your computer, including your IP address, operating system and browser type, for system administration and in order to create reports. This is statistical data about our users' browsing actions and patterns, and does not identify any individual.
          </p>
          
          <p className="mt-4">
            For example, we use cookies on our site for Google Analytics (the "Analytics Service"). The Analytics Service is a web-based analytics tool that helps website owners understand how visitors engage with their website. The Analytics Service customers can view a variety of reports about how visitors interact with their website so that they can improve it.
          </p>
          
          <p className="mt-4">
            Like many services, the Analytics Service uses first-party cookies to track visitor interactions as in our case, where they are used to collect information about how visitors use our site. We then use the information to compile reports and to help us improve our site.
          </p>
          
          <p className="mt-4">
            Cookies contain information that is transferred to your computer's hard drive. These cookies are used to store information, such as the time that the current visit occurred, whether the visitor has been to the site before and what site referred the visitor to the web page.
          </p>
          
          <p className="mt-4">
            The Analytics Service collects information anonymously. They report website trends without identifying individual visitors. You can opt out of the Analytics Service without affecting how you visit our site. For more information on opting out of being tracked by Google Analytics across all websites you use, visit <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#cc0c1a] hover:underline">https://tools.google.com/dlpage/gaoptout</a>.
          </p>
          
          <p className="mt-4">
            We may also use Google conversion tracking and/or similar services to help us understand your and other users' use of the Service.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Automatically Collected Information:</h2>
          <p>
            When you access the Service or open one of our HTML emails, we may automatically record certain information from your system by using cookies and other types of tracking technologies. This "automatically collected" information may include Internet Protocol address ("IP Address"), a unique user ID, device type, device identifiers, browser types and language, referring and exit pages, platform type, version of software installed, system type, the content and pages that you access on the Service, the number of clicks, the amount of time spent on pages, the dates and times that you visit the Service, and other similar information. Depending on the law of your country of residence, your IP address may legally be considered personally identifiable information.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Security:</h2>
          <p>
            The security of your personally identifiable information is very important to us. When we collect your personally identifiable information online, we use reasonable efforts to protect it from unauthorized access. However, due to the inherent open nature of the Internet, we cannot guarantee that your personally identifiable information will be completely free from unauthorized access by third parties such as hackers and your use of our Service demonstrates your assumption of this risk. We have put in place reasonable physical, electronic, and managerial procedures to safeguard the information we collect. Only those employees who need access to your information in order to perform their duties are authorized to have access to your personally identifiable information. For more information on protecting your privacy, please visit <a href="http://www.ftc.gov/privacy" className="text-[#cc0c1a] hover:underline">www.ftc.gov/privacy</a>.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Your Disclosures In Blogs And Other Social Media:</h2>
          <p>
            You should be aware that personally identifiable information which you voluntarily include and transmit online on the Service or in a publicly accessible blog, chat room, social media platform or otherwise online, or that you share in an open forum such as an in-person panel or survey, may be viewed and used by others without any restrictions. We are unable to control such uses of your personally identifiable information, and by using the Service or any other online services you assume the risk that the personally identifiable information provided by you may be viewed and used by third parties for any number of purposes.
          </p>
          
          <p className="mt-4">
            If you login to the Websites and/or Service through your Facebook account, connect to a third party service such as Facebook or Twitter through an icon or link on the Service or otherwise link your TOPHAT|SECURITY account with a third party service, we may share the contents of your post and associated information (such as your user name, the fact that your connection originated from the Service, and other relevant usage and diagnostic information) with such third party. With your one-time consent, we may also send information about the content you watch and your activities on the Service to such third parties. Once such information is shared, the use of your information will be subject to that service's privacy policy and this Privacy Policy will not apply.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Protection for Children:</h2>
          <p>
            We generally do not collect personally identifiable information from children under the age of 13. If at any time in the future we plan to collect personally identifiable information from children under 13, such collection and use, to the extent applicable, shall, when required, be done in compliance with the Children's Online Privacy Protection Act ("COPPA") and appropriate consent from the child's parent or guardian will be sought where required by COPPA. When we become aware that personally identifiable information from a child under 13 has been collected without such child's parent or guardian's consent, we will use all reasonable efforts to delete such information from our database.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Other Services:</h2>
          <p>
            As a convenience to you, we may provide links to third-party Services from within our Service. We are not responsible for the privacy practices or content of these third-party sites. When you link away from our Service, you do so at your own risk.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Changes to this Privacy Policy:</h2>
          <p>
            We reserve the right, at our discretion, to change, modify, add, or remove portions from this Privacy Policy at any time. However, if at any time in the future we plan to use personally identifiable information in a way that materially differs from this Privacy Policy, including sharing such information with more third parties, we will post such changes here and provide you the opportunity to opt-out of such differing uses. Your continued use of the Service and our services following the posting of any changes to this Privacy Policy means you accept such changes.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Opt-Out Process:</h2>
          <p>
            All unsubscribe or opt-out requests may be made by clicking the "unsubscribe" link at the bottom of the relevant email. We will process your request within a reasonable time after receipt. However, we are not responsible for, and in some cases we are incapable of, removing your personally identifiable information from the lists of any third party who has previously been provided your information in accordance with this Privacy Policy or your consent. You should contact such third parties directly. If you would like to update or correct any personally identifiable information that you have provided to us, please email us at <a href="mailto:info@tophatsecurity.com" className="text-[#cc0c1a] hover:underline">info@tophatsecurity.com</a> and once we confirm your information, we will update such information within a reasonable amount of time.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Communications with TOPHAT|SECURITY:</h2>
          <p>
            By providing your contact information to us (including, without limitation, your email address, physical address, and phone number) (collectively the "Channels") to us, you expressly consent to receive communications from us. We may use the Channels to communicate with you, to send information that you have requested or to send information about other products or services developed or provided by us or our business partners, provided that, we will not give your contact information to another party to promote their products or services directly to you without your consent or as set forth in this Privacy Policy.
          </p>
          
          <p className="mt-4">
            By using the Service, you expressly consent to receive in-product communications from us (including, without limitation, push notifications on the App).
          </p>
          
          <p className="mt-4">
            By providing your phone number to us, you expressly consent to receive phone calls and/or text messages from us. We will not give your phone number to another party to promote their products or services directly to you without your consent or as set forth in this Privacy Policy.
          </p>
          
          <p className="mt-4">
            Any phone calls and/or text messages delivered to your phone or device may cause you to incur extra data, text messaging, or other charges from your wireless carrier. MESSAGE AND DATA RATES MAY APPLY. You are solely responsible for any carrier charges incurred as a result of phone and/or text communications from TOPHAT|SECURITY.
          </p>
          
          <p className="mt-4">
            Any communication or material you transmit to us by email or otherwise, including any data, questions, comments, suggestions, or the like is, and will be treated as, non-confidential and nonproprietary. Except to the extent expressly covered by this Privacy Policy, anything you transmit or post may be used by us for any purpose, including but not limited to, reproduction, disclosure, transmission, publication, broadcast and posting. Furthermore, you expressly agree that we are free to use any ideas, concepts, know-how, or techniques contained in any communication you send to us, as well as any data developed using the content of such communication, without compensation and for any purpose whatsoever, including but not limited to, developing, manufacturing and marketing products and services using such information.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">No Rights of Third Parties:</h2>
          <p>
            This Privacy Policy does not create rights enforceable by third parties, nor does it require disclosure of any personal information relating to users of the Service.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Site Terms of Use:</h2>
          <p>
            Use of this Service is governed by, and subject to, the Terms of Use located in the Terms of Service Agreement above. This Privacy Policy is incorporated into the Terms. Your use, or access, of the Service constitutes your agreement to be bound by these provisions. IF YOU DO NOT AGREE TO THE TERMS AND THIS PRIVACY POLICY YOU MAY NOT ACCESS OR OTHERWISE USE THE SERVICE.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Servers:</h2>
          <p>
            Our servers are maintained in the United States. By using the Service, you freely and specifically give us your consent to export your personally identifiable information to the United States and to store and use it in the United States as specified in this Privacy Policy. You understand that data stored in the United States may be subject to lawful requests by the courts or law enforcement authorities in the United States.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Governing Law:</h2>
          <p>
            This Privacy Policy and our legal obligations hereunder are subject to the laws of the State of Delaware regardless of your location. You hereby consent to the exclusive jurisdiction of and venue in the courts located in the State of Delaware, County of New Castle, in all disputes arising out of or relating to the Services.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Contact:</h2>
          <p>
            For questions or concerns relating to privacy, we can be contacted at <a href="mailto:info@tophatsecurity.com" className="text-[#cc0c1a] hover:underline">info@tophatsecurity.com</a>.
          </p>
          
          <p className="mt-4">
            <strong>Effective Date:</strong> This Privacy Policy was last updated on April 21st, 2018.
          </p>
          
          <p className="mt-6 font-bold">
            I HAVE READ THIS AGREEMENT AND AGREE TO ALL OF THE PROVISIONS CONTAINED ABOVE
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Right to Erasure requests:</h2>
          <p>
            If you would like to have your information removed from our system, please email us at <a href="mailto:info@tophatsecurity.com" className="text-[#cc0c1a] hover:underline">info@tophatsecurity.com</a>. Please understand we will need to confirm your identity before beginning the process. The data of a person that can expect to be erased includes — name, address, phone number — and the less obvious, such as tracking numbers and VAT IDs. We will probably need to keep some data for a limited time to comply with contractual obligations and protect ourselves, like keeping tracking IDs to defend against shipping disputes or keeping VAT information for tax audits. Please feel free to reach out to us with questions.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
