
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Filter } from "lucide-react";
import PosterTemplate, { Template } from "@/components/PosterTemplate";

// Mock data for templates
const allTemplates: Template[] = [
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
  },
  {
    id: "template4",
    title: "Concert Announcement",
    description: "Promote your upcoming music event with this template",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000",
    category: "Music"
  },
  {
    id: "template5",
    title: "Fitness Challenge",
    description: "Motivate participants with this energetic fitness poster",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000",
    category: "Health"
  },
  {
    id: "template6",
    title: "Wedding Announcement",
    description: "Elegant template for wedding invitations and announcements",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
    category: "Wedding"
  }
];

const categories = [
  "All",
  "Education",
  "Event",
  "Business",
  "Music",
  "Health",
  "Wedding"
];

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(allTemplates);
  const navigate = useNavigate();
  
  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory]);
  
  const filterTemplates = () => {
    let filtered = allTemplates;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory
      );
    }
    
    setFilteredTemplates(filtered);
  };
  
  const handleSelectTemplate = (templateId: string) => {
    navigate(`/editor/${templateId}`);
  };
  
  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Template</h1>
          <p className="text-lg text-muted-foreground">
            Browse our collection of professional templates and start creating your custom poster
          </p>
        </div>
        
        {/* Filter and Search */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto py-2 w-full md:w-auto">
              <Filter className="text-muted-foreground h-4 w-4 mr-1 shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
        </div>
        
        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {filteredTemplates.map((template) => (
              <PosterTemplate
                key={template.id}
                template={template}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
