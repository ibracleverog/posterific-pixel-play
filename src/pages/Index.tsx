
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Upload, Image as ImageIcon, Download } from "lucide-react";
import PosterTemplate from "@/components/PosterTemplate";
import { cn } from "@/lib/utils";

// Mock data for featured templates
const featuredTemplates = [
  {
    id: "template1",
    title: "Graduation Celebration",
    description: "Perfect for celebrating your graduation achievements",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000",
    category: "Education"
  },
  {
    id: "template2",
    title: "Summer Beach Party",
    description: "Bright and vibrant poster for summer events",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000",
    category: "Event"
  },
  {
    id: "template3",
    title: "Business Conference",
    description: "Professional template for business events",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000",
    category: "Business"
  }
];

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [animateSection, setAnimateSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setAnimateSection(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Trigger animation on initial load after a delay
    const timer = setTimeout(() => {
      setAnimateSection(true);
    }, 300);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="hero-section flex items-center relative z-10">
        <div className="container-tight flex flex-col items-center text-center relative z-10">
          <div className={cn(
            "transition-all duration-1000 transform",
            scrolled ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
          )}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance animate-slide-in">
              Create Beautiful <span className="text-primary">Customized Posters</span> in Seconds
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty animate-slide-in" style={{ animationDelay: "100ms" }}>
              Upload your photo, choose a template, customize, and download your personalized poster — perfect for social media campaigns and events.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-slide-in" style={{ animationDelay: "200ms" }}>
              <Link to="/templates">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Start Creating
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/templates">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
      </div>
      
      {/* How It Works Section */}
      <section className="py-24 bg-secondary/50">
        <div className="container-tight">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 animate-slide-in">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in" style={{ animationDelay: "100ms" }}>
              Create your custom poster in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={cn(
              "bg-white rounded-xl p-6 shadow-sm border border-border/40 transition-all duration-700 transform",
              animateSection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Upload Your Photo</h3>
              <p className="text-muted-foreground">
                Start by uploading your favorite photo that you want to include in the poster.
              </p>
            </div>
            
            <div className={cn(
              "bg-white rounded-xl p-6 shadow-sm border border-border/40 transition-all duration-700 transform",
              animateSection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )} style={{ transitionDelay: "200ms" }}>
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Customize the Poster</h3>
              <p className="text-muted-foreground">
                Adjust your photo's position, scale, and rotation to fit perfectly within the template.
              </p>
            </div>
            
            <div className={cn(
              "bg-white rounded-xl p-6 shadow-sm border border-border/40 transition-all duration-700 transform",
              animateSection ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )} style={{ transitionDelay: "400ms" }}>
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Download & Share</h3>
              <p className="text-muted-foreground">
                Download your finished poster as a high-quality image or share it directly to social media.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Templates Section */}
      <section className="py-24">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Templates</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of professionally designed poster templates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTemplates.map((template) => (
              <PosterTemplate 
                key={template.id} 
                template={template} 
                featured
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/templates">
              <Button size="lg" variant="outline">
                View All Templates
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-primary/5 relative overflow-hidden">
        <div className="container-tight relative z-10">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-border/30">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your Custom Poster?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Express yourself and make your photos stand out with our beautiful templates.
              </p>
              <Link to="/templates">
                <Button size="lg" className="px-8">
                  Start Creating Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-0 w-full pointer-events-none opacity-50">
          <div className="absolute w-64 h-64 rounded-full bg-primary/20 blur-3xl -left-32" />
          <div className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl right-0 top-40" />
        </div>
      </section>
    </div>
  );
};

export default Index;
