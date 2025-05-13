
import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-[#f9f7ff] to-[#f0ebff] dark:from-[#1a1f2c]/80 dark:to-[#1a1f2c]">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#6E59A5] dark:text-[#9b87f5]">
            About TopHat Security
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-6 leading-relaxed">
              At TopHat Security, we're dedicated to protecting your digital assets with cutting-edge cybersecurity solutions.
              Our team of experts has decades of combined experience in identifying vulnerabilities and mitigating risks.
            </p>
            <p className="text-lg mb-8 leading-relaxed">
              Founded in 2010, we've grown from a small consulting firm to a comprehensive security provider,
              serving clients across industries from healthcare and finance to government and education.
              Our mission is to stay one step ahead of emerging threats through continuous innovation and research.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold mb-3 text-[#6E59A5] dark:text-[#9b87f5]">Our Mission</h3>
                <p>To empower organizations with the tools and knowledge needed to defend against evolving cyber threats.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold mb-3 text-[#6E59A5] dark:text-[#9b87f5]">Our Vision</h3>
                <p>A world where digital innovation flourishes without the constraint of security concerns.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold mb-3 text-[#6E59A5] dark:text-[#9b87f5]">Our Values</h3>
                <p>Integrity, innovation, excellence, and a relentless focus on our clients' security needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
