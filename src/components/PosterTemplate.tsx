
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Template {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface PosterTemplateProps {
  template: Template;
  featured?: boolean;
}

const PosterTemplate = ({ template, featured = false }: PosterTemplateProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-300 hover-scale",
        featured ? "aspect-[4/3]" : "aspect-[3/4]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      
      <img 
        src={template.imageUrl} 
        alt={template.title}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
      />
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 z-20",
        isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        <h3 className="text-white font-medium mb-1 drop-shadow-md">{template.title}</h3>
        
        <p className="text-white/80 text-sm mb-3 line-clamp-2 drop-shadow-md">
          {template.description}
        </p>
        
        <Link to={`/editor/${template.id}`}>
          <Button 
            variant="secondary" 
            className="w-full justify-center mt-2 bg-white/90 hover:bg-white text-foreground shadow-md"
          >
            Use Template
          </Button>
        </Link>
      </div>
      
      <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full z-10">
        {template.category}
      </div>
    </div>
  );
};

export default PosterTemplate;
