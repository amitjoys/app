import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { MessageSquare, TrendingUp, Lightbulb, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockPricingPlans, mockTestimonials } from '../mock';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Discussions Analyzed', value: '1M+' },
    { label: 'Content Creators', value: '50K+' },
    { label: 'Avg. Engagement Boost', value: '300%' }
  ];

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
      title: 'Pain Point Discovery',
      description: 'Uncover real struggles and challenges your audience faces in real-time across Reddit, X, and YouTube discussions.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      title: 'Trending Ideas',
      description: 'Stay ahead of the curve with emerging trends and topics gaining momentum in your niche.'
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-indigo-600" />,
      title: 'Content Inspiration',
      description: 'Get ready-to-create content ideas based on what your audience is actively requesting.'
    },
    {
      icon: <Search className="w-6 h-6 text-indigo-600" />,
      title: 'Multi-Platform Analysis',
      description: 'Comprehensive real-time insights from Reddit subreddits, X posts, and YouTube comments in one place.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Search Your Topic',
      description: 'Enter any topic, niche, or keyword you want to explore'
    },
    {
      number: '2',
      title: 'AI Analysis',
      description: 'Our AI analyzes millions of conversations across platforms'
    },
    {
      number: '3',
      title: 'Get Insights',
      description: 'Receive organized insights: pain points, trends, and content ideas'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover What Your <br />
            <span className="text-indigo-600">Audience Really Wants</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Uncover pain points, trending ideas, and content opportunities from millions of conversations across Reddit, X, and YouTube in real-time. Create content that truly resonates.
          </p>
          <Button 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6 h-auto"
            onClick={() => navigate('/signup')}
          >
            Get Insights <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Everything You Need to Create Winning Content
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Our AI-powered platform analyzes millions of conversations to give you actionable insights
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Get insights in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Loved by Content Creators Worldwide
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            4.9/5 from 2,000+ reviews
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Choose the plan that fits your content creation needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockPricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.isPopular ? 'border-indigo-600 shadow-lg' : 'border-gray-200'
                }`}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/{plan.billing}</span>
                  </div>
                  {plan.trialInfo && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700">{plan.trialInfo}</p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.isPopular 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                    onClick={() => navigate('/signup')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Content That Converts?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of creators who are already using InsightsSnap to grow their audience
          </p>
          <Button 
            size="lg" 
            className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            onClick={() => navigate('/signup')}
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;