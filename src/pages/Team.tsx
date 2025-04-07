
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

const Team = () => {
  const founders = [
    {
      name: 'Matt Caldwell',
      position: 'CEO & Founder',
      bio: 'Veteran builder in cybersecurity, leading TopHat\'s mission.',
      initials: 'MC'
    },
    {
      name: 'Joe Cardin',
      position: 'Chief Strategy Officer',
      bio: 'Cybersecurity GTM expert focused on executive messaging.',
      initials: 'JC'
    },
    {
      name: 'Rich Mason',
      position: 'CISO (Ex-CISO, Honeywell)',
      bio: 'Industry legend in ICS/OT security.',
      initials: 'RM'
    },
    {
      name: 'Gerry D\'Agostino',
      position: 'CRO',
      bio: 'Connects TopHat to Partners, DoD, IC, and critical infrastructure agencies.',
      initials: 'GD'
    },
    {
      name: 'Mike Klipstein PHD',
      position: 'Advisor',
      bio: 'Nationally recognized expert in defense technology, space and sigint and AI risk.',
      initials: 'MK'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the cybersecurity experts behind TopHat Security's innovative solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {founders.map((founder) => (
              <Card key={founder.name} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-28 w-28 mb-4 bg-[#cc0c1a]">
                      <AvatarFallback className="text-white text-xl font-semibold">
                        {founder.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold mb-1">{founder.name}</h3>
                    <p className="text-sm text-[#cc0c1a] font-medium mb-3">{founder.position}</p>
                    <p className="text-muted-foreground mb-4">{founder.bio}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Linkedin className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="text-center py-16 bg-[#f3f3f3] mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Join Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Interested in working with our team of cybersecurity experts? Check out our open positions.
          </p>
          <Link to="/careers">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-2">
              View Career Opportunities
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Team;
