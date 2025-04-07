
import React from 'react';

const PerpetualProcessSteps = () => {
  const steps = [
    {
      number: "01",
      title: "Initial Assessment",
      description: "Comprehensive analysis of your current security posture to establish a baseline and identify critical areas."
    },
    {
      number: "02",
      title: "Security Plan Development",
      description: "Creation of a tailored security roadmap based on your specific business needs and risk profile."
    },
    {
      number: "03",
      title: "Implementation",
      description: "Deployment of security controls, monitoring tools, and establishing baseline security metrics."
    },
    {
      number: "04",
      title: "Continuous Monitoring",
      description: "Ongoing surveillance of your systems with automated alerts for potential security incidents."
    },
    {
      number: "05",
      title: "Regular Reassessment",
      description: "Scheduled security reviews to identify new vulnerabilities and adapt to evolving threats."
    },
    {
      number: "06",
      title: "Continuous Improvement",
      description: "Iterative enhancement of security measures based on assessment findings and emerging best practices."
    }
  ];

  return (
    <section className="mb-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Our Process</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We follow a structured approach to ensure comprehensive and continuous security evaluation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#cc0c1a] text-white text-2xl font-bold p-2 w-12 h-12 flex items-center justify-center">
              {step.number}
            </div>
            <h3 className="text-xl font-bold mb-3 mt-8">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PerpetualProcessSteps;
