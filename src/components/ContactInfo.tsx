import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Building, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactInfo = () => {
  const locations = [
    {
      title: "Georgia Office",
      address: [
        "Tophat Security",
        "1954 Airport Rd. Suite 130-10",
        "Atlanta, Georgia 30341"
      ],
      fullAddress: "1954 Airport Rd. Suite 130-10, Atlanta, Georgia 30341"
    },
    {
      title: "Alaska Office",
      address: [
        "Tophat Security",
        "821 N ST, STE 102",
        "Anchorage, AK, 99501"
      ],
      fullAddress: "821 N ST, STE 102, Anchorage, AK, 99501"
    },
    {
      title: "Delaware Office",
      address: [
        "Tophat Security",
        "2810 N Church St., PMB 41266",
        "Wilmington, Delaware 19802"
      ],
      fullAddress: "2810 N Church St., PMB 41266, Wilmington, Delaware 19802"
    }
  ];

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "General Information",
      content: "info@tophatsecurity.com",
      link: "mailto:info@tophatsecurity.com"
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Sales",
      content: "sales@tophatsecurity.com",
      link: "mailto:sales@tophatsecurity.com"
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      content: "1-800-989-5718",
      link: "tel:18009895718"
    }
  ];

  const getGoogleMapsLink = (address: string) => {
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  };

  const getAppleMapsLink = (address: string) => {
    return `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-8">Contact Methods</h3>
      
      <div className="space-y-8 mb-8">
        {contactMethods.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="bg-primary/10 p-3 rounded-full mr-4">{item.icon}</div>
            <div>
              <h4 className="font-medium text-lg">{item.title}</h4>
              <a href={item.link} className="text-muted-foreground hover:text-primary transition-colors">
                {item.content}
              </a>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-bold mb-8">Our Offices</h3>
      <div className="space-y-6">
        {locations.map((location, index) => (
          <Card key={index} className="bg-secondary/30 border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">{location.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <div>
                  {location.address.map((line, i) => (
                    <p key={i} className="text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(getGoogleMapsLink(location.fullAddress), '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Google Maps
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(getAppleMapsLink(location.fullAddress), '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Apple Maps
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
