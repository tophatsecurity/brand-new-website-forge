
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ProductsSection from '@/components/ProductsSection';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Shield, Factory, ArrowRight } from 'lucide-react';

const Products = () => {
  useScrollToTop();

  const solutionCategories = [
    {
      icon: Brain,
      title: "AI Security",
      description: "Protect AI systems, GPU operations, and model security",
      products: [
        { name: "PARAGUARD", path: "/paraguard" }
      ],
      color: "from-purple-500/20 to-purple-600/10",
      iconColor: "text-purple-600",
      borderColor: "border-purple-500/30"
    },
    {
      icon: Shield,
      title: "Cyber Supply Chain",
      description: "Secure software & hardware supply chains",
      products: [
        { name: "DDX", path: "/ddx" },
        { name: "ONBOARD", path: "/onboard" },
        { name: "SECONDLOOK", path: "/secondlook" }
      ],
      color: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Factory,
      title: "OT/ICS Security",
      description: "Industrial network simulation & assessment",
      products: [
        { name: "LIGHTFOOT", path: "/lightfoot" },
        { name: "O-RANGE", path: "/orange" },
        { name: "SEEKCAP", path: "/seekcap" }
      ],
      color: "from-orange-500/20 to-orange-600/10",
      iconColor: "text-orange-600",
      borderColor: "border-orange-500/30"
    }
  ];
  
  return (
    <MainLayout fullWidth paddingTop="none">
      <div className="hero-section pt-32">
        <div className="hero-content">
          <div className="text-center">
            <h1 className="hero-title">Our Security Solutions</h1>
            <p className="hero-description mt-4">
              Our innovative cybersecurity products safeguard your organization across multiple domains, 
              from AI systems to supply chain security and comprehensive asset management. Each solution 
              is designed to address emerging threats with cutting-edge technology.
            </p>
          </div>
        </div>
      </div>

      {/* Solution Category Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {solutionCategories.map((category, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden border-2 ${category.borderColor} hover:shadow-xl transition-all duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-50`} />
              <CardContent className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-white shadow-md ${category.iconColor}`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {category.products.map((product, i) => (
                    <Link 
                      key={i} 
                      to={product.path}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/60 hover:bg-white transition-colors group"
                    >
                      <span className="font-medium">{product.name}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#cc0c1a] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <ProductsSection />

        <div className="text-center py-16 bg-muted/30 mt-16 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Need a Customized Security Solution?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Our experts can help you identify the right security tools for your specific needs.
          </p>
          <Link to="/contact">
            <button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-2 rounded-md">
              Contact Our Team
            </button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
