
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AboutSection = () => {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
            About Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            About TopHat Security
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-6 leading-relaxed text-muted-foreground">
              At TopHat Security, we're dedicated to protecting your digital assets with cutting-edge cybersecurity solutions.
              Our team of experts has decades of combined experience in identifying vulnerabilities and mitigating risks.
            </p>
            <p className="text-lg mb-8 leading-relaxed text-muted-foreground">
              Founded in 2010, we've grown from a small consulting firm to a comprehensive security provider,
              serving clients across industries from healthcare and finance to government and education.
              Our mission is to stay one step ahead of emerging threats through continuous innovation and research.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-[#cc0c1a]">Our Mission</h3>
            <p className="text-muted-foreground">To empower organizations with the tools and knowledge needed to defend against evolving cyber threats.</p>
          </Card>
          <Card className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-[#cc0c1a]">Our Vision</h3>
            <p className="text-muted-foreground">A world where digital innovation flourishes without the constraint of security concerns.</p>
          </Card>
          <Card className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-[#cc0c1a]">Our Values</h3>
            <p className="text-muted-foreground">Integrity, innovation, excellence, and a relentless focus on our clients' security needs.</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
