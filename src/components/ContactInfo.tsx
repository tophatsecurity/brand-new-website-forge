
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Building } from "lucide-react";

const ContactInfo = () => {
  const locations = [
    {
      title: "Delaware Office",
      address: [
        "Tophat Security",
        "2810 N Church St., PMB 41266",
        "Wilmington, Delaware 19802"
      ]
    },
    {
      title: "Alaska Office",
      address: [
        "Tophat Security",
        "821 N ST, STE 102",
        "Anchorage, AK, 99501"
      ]
    },
    {
      title: "Georgia Office",
      address: [
        "Tophat Security",
        "1954 Airport Rd. Suite 130-10",
        "Atlanta, Georgia 30341"
      ]
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

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our team for more information about our cybersecurity solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div className="animate-slide-up opacity-0" style={{ animationDelay: '200ms' }}>
            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
            <div className="space-y-8">
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
          </div>
          
          <div className="animate-slide-up opacity-0" style={{ animationDelay: '400ms' }}>
            <h3 className="text-2xl font-bold mb-8">Business Hours</h3>
            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="space-y-2 text-muted-foreground">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-8 text-center animate-slide-up opacity-0" style={{ animationDelay: '600ms' }}>Our Offices</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <Card key={index} className="animate-slide-up opacity-0" style={{ animationDelay: `${index * 100 + 700}ms` }}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">{location.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                  <div>
                    {location.address.map((line, i) => (
                      <p key={i} className="text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
