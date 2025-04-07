
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Careers = () => {
  const careers = [
    {
      title: "Full Time Quality Assurance Engineer",
      description: "If planning and implementing strategies for quality management and testing are your specialties, we want to hear from you. Tophat Security's Quality Assurance Engineer will be able to create test cases and implement them using a wide variety of tools. Could this be what you've been looking for?",
      requirements: "Candidate needs to be a resident of Georgia or Alaska, a U.S. Citizen and able to pass a background check.",
      contactEmail: "hr@tophatsecurity.com"
    },
    {
      title: "Full Time Business Development Representative",
      description: "Tophat Security is looking for a BDR who's interested in working for a sophisticated tech organization as an entry level Inside Sales Representative. Our BDR will be responsible for qualifying leads and prospecting through existing business accounts to engage with prospective buyers.",
      requirements: "Candidate needs to be a resident of Georgia or Alaska, a U.S. Citizen and able to pass a background check.",
      contactEmail: "hr@tophatsecurity.com"
    },
    {
      title: "Full Time Senior Sales Engineer",
      description: "If your super powers involve fusing engineering, sales and marketing together, we need to chat! Tophat Security's Senior Sales Engineer would also be involved with product demonstrations and explaining the benefits of Tophat's awesomeness both remote and in person.",
      requirements: "Candidate needs to be a resident of Georgia or Alaska, a U.S. Citizen and able to pass a background check.",
      contactEmail: "hr@tophatsecurity.com"
    },
    {
      title: "Full Time Systems Engineer",
      description: "Is ensuring the highest levels of systems and infrastructure availability your thing? Do you have a background in systems engineering and administration, data management, orchestration, networking, scalable architectures, and Infrastructure as a Service (IaaS)?",
      requirements: "Candidate needs to be a resident of Georgia or Alaska, a U.S. Citizen and able to pass a background check.",
      contactEmail: "hr@tophatsecurity.com"
    },
    {
      title: "Full Time Partner Sales Engineer",
      description: "Do you have that special something that allows you to interact with customers, sales teams and engineers? Tophat Security is looking for an individual with a mix of specialized technical and business experience who can lead in initiatives and programs related to solutions, integrations, partner training and technical architecture and strategies.",
      requirements: "Candidate needs to be a resident of Georgia or Alaska, a U.S. Citizen and able to pass a background check.",
      contactEmail: "hr@tophatsecurity.com"
    },
    {
      title: "Full Time Senior Sales Executive",
      description: "Tophat Security is searching for just the right person for our Senior Sales Executive position. You would be responsible for achieving success by identifying, qualifying and selling to prospective clients and exploring new business opportunities with current ones.",
      requirements: "Candidate needs to be a resident of Georgia or Alaska, a U.S. Citizen and able to pass a background check.",
      contactEmail: "hr@tophatsecurity.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Careers at Tophat Security</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join our team of security experts and help protect businesses from emerging cyber threats.
            </p>
          </div>
          
          <div className="mb-16">
            <div className="bg-[#f8f9fa] p-8 rounded-xl border border-gray-200 mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center text-[#cc0c1a]">Which Hat is Right for You?</h2>
              <p className="text-lg text-center max-w-3xl mx-auto mb-6">
                At Tophat Security, we're looking for talented individuals who are passionate about cybersecurity 
                and ready to make an impact in a fast-growing industry.
              </p>
              <div className="flex justify-center">
                <Badge className="bg-[#cc0c1a]">Now Hiring</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {careers.map((job, index) => (
                <Card key={index} className="overflow-hidden border-t-4 border-t-[#cc0c1a]">
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-[#cc0c1a] font-medium">
                      Full Time Position
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="mb-4">{job.description}</p>
                    <div className="bg-[#f8f9fa] p-3 rounded-md mb-4 text-sm">
                      <strong>Requirements:</strong> {job.requirements}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <strong>Contact:</strong> {job.contactEmail}
                      </div>
                      <a href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`}>
                        <Button className="bg-[#cc0c1a] hover:bg-[#a80916]">
                          Apply Now
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="bg-[#f3f3f3] p-8 rounded-xl text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Don't see the right position?</h2>
            <p className="mb-6">
              We're always looking for talented individuals to join our team. Send your resume to{" "}
              <a href="mailto:hr@tophatsecurity.com" className="text-[#cc0c1a] hover:underline">
                hr@tophatsecurity.com
              </a>
              {" "}and we'll keep you in mind for future opportunities.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;
