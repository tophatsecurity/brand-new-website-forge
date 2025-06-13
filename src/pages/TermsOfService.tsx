
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/layouts/MainLayout';
import { Separator } from '@/components/ui/separator';

const TermsOfService = () => {
  return (
    <MainLayout paddingTop="large">
      <Helmet>
        <title>Terms of Service | TopHat Security</title>
        <meta name="description" content="Terms of Service for TopHat Security" />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <Separator className="mb-8" />

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a>, operated by Tophat Security Inc, located in Wilmington, DE. By using the website located at <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a>, the related mobile website, and the mobile application (collectively, the "Websites"), you agree to be bound by these Terms of Service whether or not you register as a member of <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a>. If you wish to become a Member and/or make use of the Service, please read this Agreement. If you object to anything in this Terms of Service and Privacy Policy, please do not use our website or services.
          </p>

          <p className="mt-4">
            This Agreement is subject to change by <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> at any time, effective upon posting on the relevant website. Your continued use of the Websites and the Service following <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> posting of revised terms of any section of the Agreement will constitute your express and binding acceptance of and consent to the revised Agreement.
          </p>

          <p className="font-bold mt-6">
            PLEASE READ THIS AGREEMENT CAREFULLY AS IT CONTAINS IMPORTANT INFORMATION REGARDING YOUR LEGAL RIGHTS, REMEDIES AND OBLIGATIONS, INCLUDING VARIOUS LIMITATIONS AND EXCLUSIONS, AND A DISPUTE RESOLUTION CLAUSE THAT GOVERNS HOW DISPUTES WILL BE RESOLVED.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Electronic Agreement</h2>
          <p>
            This Agreement is an electronic contract that sets out the legally binding terms of your use of the Websites and the Service. This Agreement may be modified by <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> from time to time, such modifications to be effective upon posting by <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> on the Websites. By accessing and/or using the Websites or becoming a Member, you accept this Agreement and agree to the terms, conditions and notices contained or referenced herein.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Access and Retention</h2>
          <p>
            In order to access and retain this electronic Agreement, you must have access to the Internet, either directly or through devices that access web-based content, and pay any service fees associated with such access. In addition, you must use all equipment necessary to make such connection to the World Wide Web, including a computer and modem or other access device. Please print a copy of this document for your records. To retain an electronic copy of this Agreement, you may save it into any word processing program.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Commercial Use of Service</h2>
          <p>
            If you are using the Service and/or accessing the Websites on behalf of a company, entity, or organization (collectively, a "Subscribing Entity"), you represent and warrant that:
          </p>
          <ul className="list-disc pl-8 mt-4">
            <li>You are an authorized representative of the Subscribing Entity, and that you have the authority to bind the Subscribing Entity to this Terms of Service;</li>
            <li>You have read and understand this Terms of Service; and</li>
            <li>You agree to this Terms of Service on behalf of the Subscribing Entity.</li>
          </ul>

          <p className="mt-6">
            Illegal and/or unauthorized uses of the Websites include, but are not limited to, browsing or downloading illegal content, collecting usernames and/or email addresses of members by electronic or other means for the purpose of sending unsolicited email, unauthorized framing of or linking to the Websites, sharing or disclosing your username or password to any third party or permitting any third party to access your account, attempting to impersonate another user or person, use of the Websites in any fraudulent or misleading manner, any automated use of the system, such as scraping the Websites, automated scripts, spiders, robots, crawlers, data mining tools or the like, interfering with, disrupting, or creating an undue burden on the Websites or the networks or services connected to the Websites, and using the Websites in a manner inconsistent with any and all applicable laws and regulations. Illegal and/or unauthorized use of the Websites may be investigated, and appropriate legal action may be taken, including without limitation, civil, criminal, and injunctive redress. Use of the Websites and Service is with the permission of <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a>, which may be revoked at any time, for any reason, at <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> sole discretion.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Account Security</h2>
          <p>
            You are responsible for maintaining the confidentiality of the username and password that you designate during the registration process, and you are fully responsible for all activities that occur under your username and password. You agree to (a) immediately notify <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> of any unauthorized use of your username or password or any other breach of security, and (b) ensure that you exit from your account at the end of each session. <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> will not be liable for any loss or damage arising from your failure to comply with this provision. You should use particular caution when accessing your account from a public or shared computer so that others are not able to view or record your password or other personal information. If you share your computer with others, you may wish to consider disabling your auto-login feature if you have it linked to your <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> account.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Your Use of the Websites</h2>
          <p>You agree to the following restrictions and conditions:</p>
          
          <ul className="list-disc pl-8 mt-4 space-y-2">
            <li>You may not browse or download illegal content.</li>
            <li>You must not copy or capture, or attempt to copy or capture, any content from the Websites (the "Content") or any part of the Websites, unless given express permission by <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a></li>
            <li>You must not copy, republish, adapt, make available or otherwise communicate to the public, display, perform, transfer, share, distribute or otherwise use or exploit any Content on or from the Platform, except (i) where such Content is created by you (such content, "Your Content"), or (ii) as permitted under these Terms of Service, and within the parameters set by the person or entity that uploaded the Content (the "Uploader").</li>
            <li>You must not use any Content (other than Your Content) in any way that is designed to create a separate content service or that replicates any part of the Websites' offering.</li>
            <li>You must not employ scraping or similar techniques to aggregate, re-purpose, republish or otherwise make use of any Content.</li>
            <li>You must not employ the use of bots, botnets, scripts, apps, plugins, extensions or other automated means to register accounts, log-in, post comments, or otherwise to act on your behalf, particularly where such activity occurs in a multiple or repetitive fashion.</li>
            <li>You must not alter or remove, or attempt to alter or remove, any trademark, copyright or other proprietary or legal notices contained in, or appearing on, the Websites or any Content appearing on the Websites (other than Your Content).</li>
          </ul>

          <p className="mt-6">
            You must not use the Websites to upload, post, store, transmit, display, copy, distribute, promote, make available or otherwise communicate to the public any content that is offensive, abusive, libelous, defamatory, obscene, racist, sexually explicit, ethnically or culturally offensive, indecent, that promotes violence, terrorism, or illegal acts, incites hatred on grounds of race, gender, religion or sexual orientation, or is otherwise objectionable in <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> sole and reasonable discretion.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Representations and Warranties</h2>
          <p>
            You hereby represent and warrant to <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> that your Content, and each and every part thereof, is an original work by you, or you have obtained all rights, licenses, consents and permissions necessary in order to use, and to authorize <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> to use, Your Content pursuant to these Terms of Service.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Term</h2>
          <p>
            This Agreement will remain in full force and effect while you use the Websites and/or Service. You may terminate your membership and/or subscription at any time by contacting us at <a href="mailto:sales@tophatsecurity.com" className="text-[#cc0c1a] hover:underline">sales@tophatsecurity.com</a>. <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> may terminate your membership and/or subscription for any reason by sending notice to you at the email address you provide in your application for membership.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Copyright Policy</h2>
          <p>
            <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> prohibits the submission or posting of any information that infringes or violates the copyright rights and/or other intellectual property rights (including rights of privacy and publicity) of any person or entity.
          </p>

          <p className="mt-4">
            Pursuant to Title 17, United States Code, Section 512(c)(2) or for any other claim of copyright infringement, you hereby agree that notifications of claimed copyright infringement be sent by certified mail to:
          </p>

          <div className="ml-8 mt-4">
            <p>
              Tophat Security Inc.<br />
              427 N Tatnall St #41266<br />
              Wilmington, Delaware 19801
            </p>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4">Limitation of Liability</h2>
          <p>
            In no event shall <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> be liable for any damages whatsoever, whether direct, indirect, general, special, compensatory, consequential, and/or incidental, arising out of or relating to the Websites or Service, or use thereof.
          </p>

          <p className="mt-4 font-bold">
            UNDER NO CIRCUMSTANCES SHALL <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a>, Tophat Security Inc. ITS OFFICERS, OWNERS, EMPLOYEES OR AGENTS AND THEIR RESPECTIVE HEIRS, SUCCESSORS AND ASSIGNS BE LIABLE FOR ANY DAMAGES, INCLUDING DIRECT, INCIDENTAL, PUNITIVE, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES THAT DIRECTLY OR INDIRECTLY RESULT FROM USE OF, OR INABILITY TO USE, THE WEBSITES OR SERVICE.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Indemnity by You</h2>
          <p>
            You agree to indemnify and hold <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a>, Tophat Security Inc. its subsidiaries, affiliates, officers, agents, and other partners and employees, harmless from any loss, liability, claim, or demand, including reasonable attorneys' fees, arising out of or related to your use of the Service and/or Websites in violation of this Agreement.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Parental or Guardian Permission</h2>
          <p>
            Some of the Content on the Websites may not be appropriate for children. <strong>CHILDREN UNDER THE AGE OF 18 ARE NOT PERMITTED TO USE THE WEBSITES UNLESS A SUPERVISING PARENT OR GUARDIAN IS PRESENT.</strong>
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Privacy</h2>
          <p>
            Please see Tophat Security's Privacy Policy for information about how we collect, use, and protect your personal information.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Jurisdiction and Choice of Law</h2>
          <p>
            If there is any dispute arising out of the Websites and/or the Service, by using the Websites and/or Service, you expressly agree that any such dispute shall be governed by the laws of the State of Delaware, without regard to its conflict of law provisions, and you expressly agree and consent to the exclusive jurisdiction and venue of the state and federal courts of the State of Delaware, for the resolution of any such dispute.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Arbitration Provision/No Class Action</h2>
          <p>
            Except where prohibited by law, as a condition of using the Websites and/or Service, you agree that any and all disputes, claims and causes of action (collectively, "Claim") arising out of or connected with the Websites and/or Service, shall be resolved individually, without resort to any form of class action, exclusively by binding arbitration under the rules of the American Arbitration Association.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Entire Agreement</h2>
          <p>
            This Agreement contains the entire agreement between you and <a href="https://www.tophatsecurity.com/" className="text-[#cc0c1a] hover:underline">https://www.tophatsecurity.com/</a> regarding the use of the Websites and/or the Service.
          </p>

          <p className="mt-8">
            <strong>Effective Date:</strong> This Terms of Service Policy was last updated on April 21st, 2018.
          </p>

          <p className="mt-6 font-bold">
            I HAVE READ THIS AGREEMENT AND AGREE TO ALL OF THE PROVISIONS CONTAINED ABOVE
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Right to Erasure Requests</h2>
          <p>
            If you would like to have your information removed from our system, please email us at <a href="mailto:info@tophatsecurity.com" className="text-[#cc0c1a] hover:underline">info@tophatsecurity.com</a>. Please understand we will need to confirm your identity before beginning the process. The data of a person that can expect to be erased includes — name, address, phone number — and the less obvious, such as tracking numbers and VAT IDs. We will probably need to keep some data for a limited time to comply with contractual obligations and protect ourselves, like keeping tracking IDs to defend against shipping disputes or keeping VAT information for tax audits. Please feel free to reach out to us with questions.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfService;
