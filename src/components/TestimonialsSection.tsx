
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Working with AcmeCorp has been a game-changer for our business. Their team delivered a website that exceeded our expectations and has significantly increased our online conversions.",
      author: "Sarah Johnson",
      position: "CEO, TechStart Inc.",
      avatar: "SJ"
    },
    {
      quote: "The mobile application developed by AcmeCorp has received outstanding feedback from our users. Their attention to detail and focus on user experience is exceptional.",
      author: "Michael Chen",
      position: "Product Manager, InnovateCo",
      avatar: "MC"
    },
    {
      quote: "AcmeCorp's data analytics solution has transformed how we make business decisions. We now have clear insights that have helped us optimize our operations and increase revenue.",
      author: "Jessica Williams",
      position: "Marketing Director, Growth Partners",
      avatar: "JW"
    }
  ];

  return (
    <section id="testimonials" className="section-padding bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Clients Say</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg animate-slide-up opacity-0" style={{ animationDelay: `${index * 100 + 200}ms` }}>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <svg width="45" height="36" className="text-primary/30" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 36H0V22.5C0 16.5 1.125 11.625 3.375 7.875C5.625 4.125 9 1.5 13.5 0V6.75C9 8.25 6.75 11.25 6.75 15.75H13.5V36ZM44.5 36H31V22.5C31 16.5 32.125 11.625 34.375 7.875C36.625 4.125 40 1.5 44.5 0V6.75C40 8.25 37.75 11.25 37.75 15.75H44.5V36Z" />
                  </svg>
                </div>
                <p className="text-foreground mb-6 italic">{testimonial.quote}</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="bg-primary text-white">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
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

export default TestimonialsSection;
