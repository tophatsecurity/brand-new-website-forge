
import React from 'react';
import { HardDrive, Server, Laptop } from 'lucide-react';

interface DeploymentOptionProps {
  title: string;
  icon: React.ReactNode;
  features: string[];
}

const deploymentOptions: DeploymentOptionProps[] = [
  {
    title: "On-Premise Virtual Machine (VM) Deployment on VSX",
    icon: <HardDrive className="h-6 w-6 text-[#cc0c1a]" />,
    features: [
      "SEEKCAP can be installed as a virtual machine (VM) within an on-premise VSX environment.",
      "This setup provides full control over security, data privacy, and system configurations.",
      "Ideal for organizations requiring a high degree of customization and integration with existing infrastructure.",
      "Supports scalable deployment, allowing multiple instances to run within the VSX framework."
    ]
  },
  {
    title: "Client-Server Deployment Within Customer's Environment",
    icon: <Server className="h-6 w-6 text-[#cc0c1a]" />,
    features: [
      "SEEKCAP can be set up in a client-server model where the server component is hosted within the customer's infrastructure.",
      "Ensures compliance with internal security policies by keeping data within the customer's controlled environment.",
      "Supports integration with enterprise authentication and network security protocols."
    ]
  },
  {
    title: "Hardened Laptop Deployment for Specialized Use Cases",
    icon: <Laptop className="h-6 w-6 text-[#cc0c1a]" />,
    features: [
      "SEEKCAP can be pre-installed on a hardened laptop for field operations.",
      "Designed for forensic investigations, asset inventory management, and risk assessment planning.",
      "Allows investigators and security professionals to operate in remote or restricted environments with minimal infrastructure dependency."
    ]
  }
];

const DeploymentOptions = () => {
  return (
    <div className="bg-[#f3f3f3] p-8 rounded-xl mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Deployment Options</h2>
      <p className="mb-6 text-center max-w-3xl mx-auto">
        SEEKCAP offers flexible deployment models to meet various operational requirements and security constraints.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {deploymentOptions.map((option, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              {option.icon}
              <h3 className="ml-3 text-lg font-semibold">{option.title}</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {option.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentOptions;
