
import React from 'react';
import SpeechBot from '@/components/SpeechBot';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import EnhancedFooter from '@/components/EnhancedFooter';
import { HomeIcon, InfoIcon, Settings2Icon, SendIcon, MessageSquareTextIcon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-violet-500 py-2 md:py-3 px-3 md:px-6 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <div className="text-white font-bold text-lg md:text-xl">AI Chat Assistant</div>
      </div>
      <div className="hidden md:flex gap-6">
        {[
          { name: 'Home', icon: HomeIcon, href: '#' },
          { name: 'About', icon: InfoIcon, href: '#about' },
          { name: 'Features', icon: Settings2Icon, href: '#about' },
          { name: 'Contact', icon: SendIcon, href: '#contact' },
        ].map(item => (
          <a 
            key={item.name} 
            href={item.href} 
            className="text-white/90 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </a>
        ))}
      </div>
      <div className="relative md:hidden">
        <Button 
          variant="ghost" 
          className="p-2 text-white hover:bg-white/20"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
            {[
              { name: 'Home', icon: HomeIcon, href: '#' },
              { name: 'About', icon: InfoIcon, href: '#about' },
              { name: 'Features', icon: Settings2Icon, href: '#about' },
              { name: 'Contact', icon: SendIcon, href: '#contact' },
            ].map(item => (
              <a 
                key={item.name} 
                href={item.href} 
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-4xl">
          <div className="bg-white rounded-xl p-3 md:p-6 shadow-xl h-[calc(100vh-8rem)] flex flex-col overflow-hidden border border-gray-200">
            <SpeechBot />
          </div>
        </section>
        
        <AboutSection />
        <ContactSection />
      </main>
      <EnhancedFooter />
    </div>
  );
};

export default Index;
