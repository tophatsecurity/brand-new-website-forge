import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import AboutSection from '@/components/AboutSection';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, UserRound, QrCode } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Badge } from '@/components/ui/badge';

const About = () => {
  useScrollToTop();

  const founders = [
    {
      name: 'Matt Caldwell',
      position: 'CEO & Founder',
      bio: 'Veteran builder in cybersecurity, leading TopHat\'s mission.',
      initials: 'MC',
      image: '/lovable-uploads/c19a0f81-ce2e-4f42-9922-65f06749af1b.png',
      linkedinUrl: 'https://www.linkedin.com/in/matthew-caldwell-1a1421/'
    },
    {
      name: 'Joe Cardin',
      position: 'Chief Strategy Officer',
      bio: 'Cybersecurity GTM expert focused on executive messaging.',
      initials: 'JC',
      image: '/lovable-uploads/eadb63aa-1b11-404e-b624-0f0241d22574.png',
      linkedinUrl: 'https://www.linkedin.com/in/josephcardin/'
    },
    {
      name: 'Rich Mason',
      position: 'CISO (Ex-CISO, Honeywell)',
      bio: 'Industry legend in ICS/OT security.',
      initials: 'RM',
      image: '/lovable-uploads/be1494fe-58a8-4df1-aa77-293b5cfce159.png',
      linkedinUrl: 'https://www.linkedin.com/in/rich-mason-1a74711/'
    },
    {
      name: 'Christy Henry',
      position: 'Vice President and CFO',
      bio: 'Driving operational excellence and strategic financial initiatives.',
      initials: 'CH',
      image: '/lovable-uploads/37b4abe7-f66c-4cd9-aa7c-46e4aa3665cc.png',
      linkedinUrl: 'https://www.linkedin.com/in/christyhenry/'
    },
    {
      name: 'Gerry D\'Agostino',
      position: 'CRO',
      bio: 'Connects TopHat to Partners, DoD, IC, and critical infrastructure agencies.',
      initials: 'GD',
      image: '/lovable-uploads/ddfcd1d0-8eb9-4ae5-a740-5d1200050e8f.png'
    },
    {
      name: 'Mike Klipstein PHD',
      position: 'Advisor',
      bio: 'Nationally recognized expert in defense technology, space and sigint and AI risk.',
      initials: 'MK',
      image: '/lovable-uploads/8481a3e3-ebb5-459a-8315-279d932658d9.png'
    }
  ];

  return (
    <MainLayout containerClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      {/* About Section */}
      <div className="animate-fade-in mb-16">
        <AboutSection />
      </div>
      
      {/* Team Section */}
      <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-border/30">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
            Our Leadership
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the cybersecurity experts behind TopHat Security's innovative solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {founders.map((founder) => (
            <Card key={founder.name} className="overflow-hidden border shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Avatar className="h-28 w-28 mb-4 bg-[#8E9196] relative group">
                        {founder.image ? (
                          <AvatarImage src={founder.image} alt={founder.name} className="object-cover" />
                        ) : (
                          <AvatarFallback className="text-white text-xl font-semibold bg-[#8E9196] flex items-center justify-center">
                            <UserRound className="h-16 w-16 text-white" />
                          </AvatarFallback>
                        )}
                        {founder.linkedinUrl && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <QrCode className="h-16 w-16 text-white" />
                          </div>
                        )}
                      </Avatar>
                    </HoverCardTrigger>
                    {founder.linkedinUrl && (
                      <HoverCardContent className="w-80 p-4">
                        <div className="flex flex-col items-center space-y-2">
                          <p className="text-sm text-muted-foreground">Scan to view LinkedIn Profile</p>
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(founder.linkedinUrl)}`}
                            alt={`QR Code for ${founder.name}'s LinkedIn`}
                            className="w-48 h-48"
                          />
                        </div>
                      </HoverCardContent>
                    )}
                  </HoverCard>
                  <h3 className="text-xl font-bold mb-1">{founder.name}</h3>
                  <p className="text-sm text-[#cc0c1a] font-medium mb-3">{founder.position}</p>
                  <p className="text-muted-foreground mb-4">{founder.bio}</p>
                  {founder.linkedinUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.open(founder.linkedinUrl, '_blank', 'noopener,noreferrer')}
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="text-center py-16 bg-muted/30 mt-16 rounded-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Join Our Team</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Interested in working with our team of cybersecurity experts? Check out our open positions.
        </p>
        <Link to="/careers">
          <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8">
            View Career Opportunities
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default About;
