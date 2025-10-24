import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Search, TrendingUp, MessageSquare, Lightbulb, Download } from 'lucide-react';
import { mockInsights, mockUserData } from '../mock';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [insights, setInsights] = useState(mockInsights);
  const [userData] = useState(mockUserData);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a search query',
        variant: 'destructive'
      });
      return;
    }

    setSearching(true);
    
    // Mock search - replace with actual API call
    setTimeout(() => {
      setShowResults(true);
      setSearching(false);
      toast({
        title: 'Success',
        description: 'Insights generated successfully!'
      });
    }, 2000);
  };

  const handleExport = (type) => {
    toast({
      title: 'Export Started',
      description: `Exporting insights as ${type}...`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Current Plan</CardDescription>
              <CardTitle className="text-2xl">{userData.plan}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/pricing')}
                className="w-full"
              >
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Searches Remaining Today</CardDescription>
              <CardTitle className="text-2xl">{userData.credits.searchesRemaining}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(userData.credits.searchesRemaining / 5) * 100} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>AI Generations Left</CardDescription>
              <CardTitle className="text-2xl">{userData.credits.aiGenerationsRemaining}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(userData.credits.aiGenerationsRemaining / 3) * 100} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Search for Insights</CardTitle>
            <CardDescription>Enter a topic, niche, or keyword to discover audience insights</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                placeholder="e.g., content marketing, fitness tips, productivity tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={searching}
              >
                {searching ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Insights for "{searchQuery}"</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            <Tabs defaultValue="painPoints" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="painPoints">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Pain Points
                </TabsTrigger>
                <TabsTrigger value="trending">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Ideas
                </TabsTrigger>
                <TabsTrigger value="content">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Content Ideas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="painPoints" className="space-y-4">
                {insights.painPoints.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-lg font-medium text-gray-900">{item.content}</p>
                        <Badge variant="secondary">{item.platform}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-4">{item.engagement} engagements</span>
                        <span>{item.source}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="trending" className="space-y-4">
                {insights.trendingIdeas.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-lg font-medium text-gray-900">{item.content}</p>
                        <Badge variant="secondary">{item.platform}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-4">Trend Score: {item.trendScore}</span>
                        <span>{item.source}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                {insights.contentIdeas.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                      <div className="flex gap-2">
                        {item.platforms.map((platform, idx) => (
                          <Badge key={idx} variant="outline">{platform}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!showResults && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No searches yet</h3>
                <p className="text-gray-600">Enter a topic above to start discovering audience insights</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;