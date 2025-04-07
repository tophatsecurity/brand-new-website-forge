
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "What is DDX (Due Diligence Expedited)?",
      answer: "DDX is a software-based platform designed for cyber supply chain risk management, providing assurance against embedded threats in connected devices before deployment. It addresses risks from embedded threats in OEM parts, materials, software, and components that have seen a sharp rise in the last two years."
    },
    {
      question: "What types of equipment can DDX analyze?",
      answer: "The DDX platform provides multi-functional testing for OT, ICS, SCADA, IoT, Weapon Systems, OEM equipment, Firmware, Software, Wireless, Radio Frequency, and Hardware Analysis. It also performs threat and vulnerability correlation across 50,000+ suppliers and 4th party of sub-suppliers."
    },
    {
      question: "How is DDX deployed?",
      answer: "DDX can be installed on servers, laptops, or virtual appliances (VMware/Hyper-V), cloud platforms (AWS/Azure), dedicated hardened appliances, and completely isolated, non-networked environments or remote areas with cellular connectivity."
    },
    {
      question: "What industries does DDX serve?",
      answer: "DDX serves Department of Defense Contractors, US Government Agencies, Financial Services, Medical Device Manufacturers, Oil and Gas Pipelines, Utility and Power Distribution, Healthcare Institutions, Multinational Corporations, Renewable Energy Companies, and Municipal Governments."
    },
    {
      question: "What regulatory frameworks does DDX support?",
      answer: "DDX supports numerous regulatory frameworks including NIST-800-53-R5, CMMC 2.0, ISO/IEC 27001, GDPR, NERC, FISMA, HIPAA, and DFARS."
    },
    {
      question: "How does DDX protect against supply chain threats?",
      answer: "DDX combines multiple proprietary techniques for testing devices and components related to supply chain vulnerabilities. It uses AI/ML, vendor risk management, firmware analysis, quarantine procedures, network capture and forensics, and system integrations to provide comprehensive protection."
    },
    {
      question: "What types of reports and alerts does DDX provide?",
      answer: "DDX provides summary reports for management review, detailed reports for administrators, real-time alerts for critical security risks, and dashboards with aggregated data and risk assessments displayed visually for quick situational awareness."
    }
  ];

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-semibold text-lg">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
