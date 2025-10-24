import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: 'How to Find Content Ideas That Actually Resonate',
      excerpt: 'Learn the proven strategies for discovering content topics your audience cares about.',
      date: 'Jan 15, 2025',
      category: 'Content Strategy'
    },
    {
      id: 2,
      title: 'The Ultimate Guide to Audience Research',
      excerpt: 'Deep dive into understanding your audience through social listening and AI analysis.',
      date: 'Jan 10, 2025',
      category: 'Research'
    },
    {
      id: 3,
      title: '10 Ways to Boost Engagement with Data-Driven Content',
      excerpt: 'Use insights from real conversations to create content that converts.',
      date: 'Jan 5, 2025',
      category: 'Engagement'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600">
            Insights, tips, and strategies for content creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="text-sm text-indigo-600 font-semibold mb-2">
                  {post.category}
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {post.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;