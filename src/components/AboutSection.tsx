
import React from 'react';
import { CheckCircle, Award, Zap, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">About AI Chat Assistant</h2>
          <p className="text-gray-600 leading-relaxed">
          AI Chat Assistant is a cutting-edge voice interaction platform that uses advanced 
            artificial intelligence to create natural, responsive voice experiences. Our mission 
            is to make technology more accessible and intuitive through voice.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            { 
              icon: CheckCircle, 
              title: "Easy Integration", 
              description: "Simple to incorporate into your existing applications with minimal setup."
            },
            { 
              icon: Zap, 
              title: "Lightning Fast", 
              description: "Optimized for performance with near-instantaneous voice recognition and response."
            },
            { 
              icon: Award, 
              title: "Highly Accurate", 
              description: "Industry-leading accuracy in understanding various accents and environments."
            },
            { 
              icon: Users, 
              title: "Multilingual Support", 
              description: "Supports over 30 languages to reach global audiences effectively."
            }
          ].map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-500 p-3 rounded-full">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Technology</h3>
            <p className="text-gray-600 mb-6">
            AI Chat Assistant is powered by a combination of advanced natural language processing, 
              machine learning, and neural networks that continuously improve through usage.
            </p>
            <ul className="space-y-3">
              {[
                "Advanced Speech Recognition",
                "Natural Language Understanding",
                "Contextual Response Generation",
                "Voice Biometrics & Security",
                "Custom Voice Training"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-r from-indigo-100 to-violet-100 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h3>
            <p className="text-gray-700 italic mb-4">
              "To create voice interfaces so natural and intuitive that technology 
              feels like a conversation with a friend."
            </p>
            <p className="text-gray-600">
              We believe that voice is the most natural form of human communication, and our goal 
              is to make technology adapt to humans rather than humans adapting to technology.
            </p>
            <p className="text-gray-600 mt-4">
              By focusing on accessibility, privacy, and personalization, we're building a future 
              where technology understands us better than ever before.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
