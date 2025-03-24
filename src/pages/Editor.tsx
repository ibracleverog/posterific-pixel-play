
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PosterEditor from "@/components/PosterEditor";
import { toast } from "sonner";

// Mock data for templates
const templates = [
  {
    id: "template1",
    title: "Graduation Celebration",
    description: "Perfect for celebrating your graduation achievements",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000",
  },
  {
    id: "template2",
    title: "Summer Beach Party",
    description: "Bright and vibrant poster for summer events",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000",
  },
  {
    id: "template3",
    title: "Business Conference",
    description: "Professional template for business events",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000",
  },
  {
    id: "template4",
    title: "Concert Announcement",
    description: "Promote your upcoming music event with this template",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000",
  },
  {
    id: "template5",
    title: "Fitness Challenge",
    description: "Motivate participants with this energetic fitness poster",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000",
  },
  {
    id: "template6",
    title: "Wedding Announcement",
    description: "Elegant template for wedding invitations and announcements",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
  }
];

const Editor = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating API call to fetch template data
    setLoading(true);
    
    setTimeout(() => {
      const found = templates.find((t) => t.id === templateId);
      
      if (found) {
        setTemplate(found);
      } else {
        toast.error("Template not found");
      }
      
      setLoading(false);
    }, 800);
  }, [templateId]);
  
  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container-tight">
          <div className="animate-pulse space-y-4 max-w-xs">
            <div className="h-8 bg-secondary rounded w-3/4"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
          </div>
          
          <div className="flex flex-col items-center justify-center mt-16">
            <div className="w-full max-w-2xl h-96 bg-secondary rounded-xl animate-pulse"></div>
            <div className="mt-8 w-full max-w-md">
              <div className="h-10 bg-secondary rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!template) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container-tight text-center">
          <h2 className="text-2xl font-bold mb-4">Template Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The template you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/templates">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Browse Templates
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16">
      <div className="container-tight">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in">
          <div>
            <Link 
              to="/templates" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Templates
            </Link>
            <h1 className="text-3xl font-bold">{template.title}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <PosterEditor template={template} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
