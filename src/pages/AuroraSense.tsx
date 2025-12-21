import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Satellite, 
  Wifi, 
  Shield, 
  BarChart3, 
  AlertTriangle, 
  Globe, 
  Server, 
  Lock,
  Zap,
  CloudOff,
  Database,
  FileJson,
  Plane,
  Ship,
  Truck,
  Radio
} from 'lucide-react';

const AuroraSense = () => {
  useScrollToTop();

  const problems = [
    {
      icon: Wifi,
      title: "Fragmented Sensor Ecosystems",
      description: "Multiple sensor types from different vendors with proprietary APIs, data formats, and dashboards require 4+ separate monitoring systems.",
      solution: "Single unified platform with one dashboard, one API, one authentication system, and automatic data correlation."
    },
    {
      icon: Satellite,
      title: "Starlink Monitoring Gap",
      description: "No built-in historical data, no alerting, no third-party API, limited visibility, and no remote monitoring capabilities.",
      solution: "Continuous performance logging, historical trend analysis, automated alerts, and multi-site monitoring from a single dashboard."
    },
    {
      icon: Globe,
      title: "Remote Site Reliability",
      description: "Physical access is expensive, failures go unnoticed, no proactive maintenance, data loss risks, and security concerns.",
      solution: "Real-time remote monitoring, automated alerts, batch queuing for intermittent connectivity, and predictive maintenance."
    },
    {
      icon: Database,
      title: "Data Accessibility & Analysis",
      description: "Sensor data trapped in proprietary formats, no APIs, manual downloads, no visualization, and limited historical queries.",
      solution: "RESTful API, CSV export, JSON batches, built-in time-series visualization, and SQLite database for SQL queries."
    },
    {
      icon: Lock,
      title: "Lack of Security & Accountability",
      description: "No authentication, no audit trails, plain text passwords, no role separation, and compliance violations.",
      solution: "TLS encryption, bcrypt-hashed passwords, role-based access control, tamper-proof audit logging, and complete compliance trail."
    }
  ];

  const deploymentTypes = [
    {
      icon: Satellite,
      title: "Satellite Systems",
      description: "Starlink, OneWeb, and LEO satellite terminal monitoring with real-time connectivity tracking."
    },
    {
      icon: Plane,
      title: "Aerospace & Drones",
      description: "UAV sensor integration, flight telemetry, and drone cable payload monitoring systems."
    },
    {
      icon: Ship,
      title: "Maritime Deployments",
      description: "Fleet vessel monitoring, offshore platform sensors, and maritime Starlink connectivity."
    },
    {
      icon: Truck,
      title: "Mobile & Fixed Assets",
      description: "Vehicle-mounted sensors, portable field stations, and permanent installation monitoring."
    },
    {
      icon: Radio,
      title: "Remote Infrastructure",
      description: "Weather stations, agricultural sensors, and off-grid industrial monitoring."
    },
    {
      icon: Server,
      title: "Edge Computing",
      description: "Raspberry Pi deployments, embedded systems, and self-hosted edge nodes."
    }
  ];

  const scenarios = [
    {
      title: "Remote Research Station",
      before: ["$3,000/trip quarterly travel costs", "Manual SD card data downloads", "3 months of lost climate data", "Thesis delayed 6 months"],
      after: ["Real-time monitoring from university", "Alerts within 5 minutes of failure", "Zero data loss", "Saved $9,000 in travel costs"]
    },
    {
      title: "Maritime Starlink Fleet",
      before: ["20 vessels with no connectivity visibility", "Lost catch data worth $50,000/season", "Crews don't report connection issues"],
      after: ["Central dashboard for all terminals", "Historical coverage maps", "Optimized routes avoid dead zones"]
    },
    {
      title: "Agricultural Monitoring",
      before: ["Manual checks twice daily", "20% crop loss from inconsistent watering", "High water bills"],
      after: ["Real-time soil moisture monitoring", "30% reduced water usage", "15% increased crop yield"]
    },
    {
      title: "ISP Service Quality",
      before: ["No SLA compliance monitoring", "Customer complaints without data", "Losing customers to competitors"],
      after: ["99.5% availability proven", "Data to negotiate with SpaceX", "Premium tier pricing justified"]
    }
  ];

  const whySelfHosted = [
    {
      icon: Shield,
      title: "Data Sovereignty",
      points: ["Your data stays yours", "GDPR, CCPA, HIPAA compliance", "Competitive advantage protection", "National security requirements"]
    },
    {
      icon: BarChart3,
      title: "Cost Control",
      points: ["No per-device fees", "No bandwidth charges", "Predictable costs", "No vendor lock-in"]
    },
    {
      icon: CloudOff,
      title: "Offline Operation",
      points: ["Works without internet", "Military/maritime deployment ready", "Disaster recovery capable", "Airgap security support"]
    },
    {
      icon: Zap,
      title: "Full Customization",
      points: ["Complete source access", "Add custom sensors", "Enterprise integration", "No feature waiting"]
    }
  ];

  return (
    <MainLayout fullWidth paddingTop="none">
      {/* Hero Section */}
      <div className="hero-section pt-32 pb-16">
        <div className="hero-content">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <Satellite className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="hero-title">AURORA SENSE</h1>
          <p className="hero-description mt-4 max-w-4xl mx-auto">
            Transform disparate IoT sensors into a unified, secure, and accessible monitoring platform 
            with enterprise-grade reliability and user-friendly dashboards. Satellite technology for 
            aerospace systems, drone payloads, fixed and mobile deployments.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/contact">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                Request Demo
              </Button>
            </Link>
            <Link to="/onboard">
              <Button size="lg" variant="outline">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Problems & Solutions */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why AURORA SENSE Exists</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Modern IoT deployments face fragmented ecosystems, monitoring gaps, and security challenges. 
            AURORA SENSE solves these critical problems.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <Card key={index} className="border-l-4 border-l-cyan-500">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-100 text-cyan-600">
                      <problem.icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-destructive mb-1">The Problem:</p>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Our Solution:</p>
                    <p className="text-sm text-muted-foreground">{problem.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Types */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Deployment Options</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            From satellite terminals to drone payloads, AURORA SENSE adapts to any deployment scenario.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deploymentTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                      <type.icon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Scenarios */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Real-World Impact</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            See how AURORA SENSE transforms operations across industries.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map((scenario, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{scenario.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30">
                    <p className="font-medium text-red-600 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Before
                    </p>
                    <ul className="space-y-1">
                      {scenario.before.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                    <p className="font-medium text-green-600 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> With AURORA SENSE
                    </p>
                    <ul className="space-y-1">
                      {scenario.after.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Self-Hosted */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why Self-Hosted?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Unlike cloud IoT platforms, AURORA SENSE gives you complete control over your data and infrastructure.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whySelfHosted.map((reason, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="p-3 rounded-xl bg-cyan-100 text-cyan-600 w-fit mb-4">
                    <reason.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-3">{reason.title}</h3>
                  <ul className="space-y-1">
                    {reason.points.map((point, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-cyan-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <div className="flex items-start gap-4">
              <FileJson className="w-8 h-8 text-cyan-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Cost Comparison</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Cloud IoT Platform:</strong> 10 sensors × 86,400 samples/day × $0.01/1000 = $8.64/day = <span className="text-destructive font-medium">$3,154/year</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>AURORA SENSE:</strong> $75 Raspberry Pi + $0/month = <span className="text-green-600 font-medium">$75 total</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Transform "I hope my sensors are working" into "I know exactly what's happening"
          </h2>
          <p className="text-cyan-100 mb-8 max-w-2xl mx-auto">
            Save money on site visits, save time with automated monitoring, protect your data, 
            meet compliance requirements, and enable research with accessible, analyzable data.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Contact Sales
              </Button>
            </Link>
            <Link to="/onboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Start Onboarding
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AuroraSense;
