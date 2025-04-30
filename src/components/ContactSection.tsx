import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram, Youtube, Facebook } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const formBody = new FormData();
    formBody.append('access_key', '764ec9a4-f4f7-4da3-8eb6-2cb0f0e6a61d');
    formBody.append('subject', 'AI Chat Assistant'); // Custom email subject
    formBody.append('first_name', formData.first_name);
    formBody.append('last_name', formData.last_name);
    formBody.append('email', formData.email);
    formBody.append('message', formData.message);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formBody,
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('Your message has been sent successfully!');
        setFormData({ first_name: '', last_name: '', email: '', message: '' }); // Reset form
      } else {
        setErrorMessage('Failed to send your message. Please try again later.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-10 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Get in Touch
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-t-lg">
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">balukarthik1308@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">+91 9515607788</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-800">Visakhapatnam, India</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-center gap-4">
                <a href="https://www.linkedin.com/in/balu-karthik/" className="rounded-full bg-indigo-100 hover:bg-indigo-200 p-2 inline-flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-indigo-600" />
                </a>
                <a href="https://github.com/Karthi-1211" className="rounded-full bg-indigo-100 hover:bg-indigo-200 p-2 inline-flex items-center justify-center">
                  <Github className="h-5 w-5 text-indigo-600" />
                </a>
                <a href="https://x.com/?lang=en" className="rounded-full bg-indigo-100 hover:bg-indigo-200 p-2 inline-flex items-center justify-center">
                  <Twitter className="h-5 w-5 text-indigo-600" />
                </a>
                <a href="https://www.instagram.com/" className="rounded-full bg-indigo-100 hover:bg-indigo-200 p-2 inline-flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-indigo-600" />
                </a>
                <a href="https://www.youtube.com/" className="rounded-full bg-indigo-100 hover:bg-indigo-200 p-2 inline-flex items-center justify-center">
                  <Youtube className="h-5 w-5 text-indigo-600" />
                </a>
                <a href="https://www.facebook.com/r.php?locale=en_GB" className="rounded-full bg-indigo-100 hover:bg-indigo-200 p-2 inline-flex items-center justify-center">
                  <Facebook className="h-5 w-5 text-indigo-600" />
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-t-lg">
              <CardTitle className="text-xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                  {errorMessage}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Email</label>
                <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[120px]"
                    required
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;