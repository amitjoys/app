// Mock data for the application

export const mockPricingPlans = [
  {
    id: '1',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    billing: 'forever',
    features: [
      '5 searches per day',
      '3 AI script generations (lifetime)',
      'Real-time insights',
      '3 exports to CSV/PDF per month',
      '3 results per category (combined)',
      'Community support'
    ],
    searchesPerDay: 5,
    aiGenerations: 3,
    exportsPerMonth: 3,
    resultsPerCategory: 3,
    isPopular: false
  },
  {
    id: '2',
    name: 'Standard',
    description: 'For growing creators',
    price: 6.99,
    billing: 'month',
    trialInfo: '7 days free trial for first-time users',
    features: [
      '50 searches per day',
      '25 AI script generations per day',
      'Time period filtering',
      '9 results per category (3 per platform)',
      '30 exports to CSV/PDF per month',
      'Email support'
    ],
    searchesPerDay: 50,
    aiGenerations: 25,
    exportsPerMonth: 30,
    resultsPerCategory: 9,
    isPopular: false
  },
  {
    id: '3',
    name: 'Pro',
    description: 'For serious content creators',
    price: 14.99,
    billing: 'month',
    trialInfo: '7 days free trial for first-time Standard users',
    features: [
      'Unlimited searches',
      'Unlimited AI script generations',
      'Advanced time filtering',
      '15 results per category (5 per platform)',
      'Auto-translation',
      'Priority support',
      'Trend alerts'
    ],
    searchesPerDay: -1,
    aiGenerations: -1,
    exportsPerMonth: -1,
    resultsPerCategory: 15,
    isPopular: true
  }
];

export const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'YouTube Creator',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    rating: 5,
    text: 'ContentInsight helped me discover pain points I never knew existed in my niche. My engagement increased 300% in just 2 months!'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Content Strategist',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    rating: 5,
    text: 'The trending ideas feature is a game-changer. I\'m always ahead of the curve now, creating content before topics explode.'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    role: 'Social Media Manager',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    rating: 5,
    text: 'Managing content for 5 brands became so much easier. The insights are incredibly accurate and actionable.'
  }
];

export const mockInsights = {
  painPoints: [
    {
      id: '1',
      platform: 'Reddit',
      content: 'Finding consistent content ideas is exhausting',
      engagement: 342,
      source: 'r/ContentCreation'
    },
    {
      id: '2',
      platform: 'X',
      content: 'Struggling to understand what my audience actually wants',
      engagement: 156,
      source: '@CreatorTips'
    },
    {
      id: '3',
      platform: 'YouTube',
      content: 'Low engagement despite posting regularly',
      engagement: 89,
      source: 'Creator Community'
    }
  ],
  trendingIdeas: [
    {
      id: '1',
      platform: 'Reddit',
      content: 'AI-powered content research tools',
      trendScore: 95,
      source: 'r/Marketing'
    },
    {
      id: '2',
      platform: 'X',
      content: 'Multi-platform audience analysis',
      trendScore: 87,
      source: '@TechTrends'
    },
    {
      id: '3',
      platform: 'YouTube',
      content: 'Real-time social listening',
      trendScore: 82,
      source: 'Marketing Insights'
    }
  ],
  contentIdeas: [
    {
      id: '1',
      title: 'How to validate content ideas before creating',
      description: 'A step-by-step guide based on audience discussions',
      platforms: ['Reddit', 'X', 'YouTube']
    },
    {
      id: '2',
      title: 'Understanding your audience\'s pain points',
      description: 'Tools and techniques for audience research',
      platforms: ['Reddit', 'X']
    },
    {
      id: '3',
      title: 'Creating content that converts',
      description: 'Data-driven content strategy',
      platforms: ['YouTube', 'X']
    }
  ]
};

export const mockUserData = {
  name: 'John Doe',
  email: 'john@example.com',
  plan: 'Free',
  credits: {
    searchesRemaining: 5,
    aiGenerationsRemaining: 3,
    exportsRemaining: 3
  },
  usage: {
    searchesUsedToday: 0,
    aiGenerationsUsedToday: 0,
    exportsUsedThisMonth: 0
  }
};