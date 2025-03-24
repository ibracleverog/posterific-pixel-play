
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Upload, Trash2, Plus } from "lucide-react";

// Mock templates data
const initialTemplates = [
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

const categories = [
  "Education",
  "Event",
  "Business",
  "Music",
  "Health",
  "Wedding",
  "Other"
];

interface TemplateFormData {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

const Admin = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [formData, setFormData] = useState<TemplateFormData>({
    title: "",
    description: "",
    category: "",
    imageUrl: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      imageUrl: ""
    });
    setEditingId(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.imageUrl) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (editingId) {
      // Update existing template
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === editingId
            ? { ...template, ...formData }
            : template
        )
      );
      toast.success("Template updated successfully");
    } else {
      // Add new template
      const newTemplate = {
        id: `template${Date.now()}`,
        ...formData
      };
      
      setTemplates((prev) => [...prev, newTemplate]);
      toast.success("Template added successfully");
    }
    
    resetForm();
  };
  
  const handleEdit = (id: string) => {
    const templateToEdit = templates.find((template) => template.id === id);
    if (templateToEdit) {
      setFormData({
        title: templateToEdit.title,
        description: templateToEdit.description,
        category: templateToEdit.category,
        imageUrl: templateToEdit.imageUrl
      });
      setEditingId(id);
    }
  };
  
  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id));
    toast.success("Template deleted successfully");
    
    if (editingId === id) {
      resetForm();
    }
  };
  
  return (
    <div className="pt-24 pb-16">
      <div className="container-tight">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage poster templates for your users
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Form */}
          <div className="lg:col-span-1 order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Template" : "Add New Template"}</CardTitle>
                <CardDescription>
                  {editingId
                    ? "Update the details of your existing template"
                    : "Create a new poster template for users"}
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Template Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter template title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your template"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Template Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="Enter image URL"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide a URL to your template image (recommended size: 1000x1000px)
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                  >
                    {editingId ? "Update Template" : "Add Template"}
                  </Button>
                  
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={resetForm}
                    >
                      Cancel Editing
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Card>
          </div>
          
          {/* Templates List */}
          <div className="lg:col-span-2 order-1 lg:order-2 animate-fade-in">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manage Templates</CardTitle>
                  <CardDescription>
                    {templates.length} templates available
                  </CardDescription>
                </div>
                
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </CardHeader>
              
              <CardContent>
                {templates.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-1">No templates yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first template to get started
                    </p>
                    <Button onClick={() => setFormData(formData)}>
                      Add Template
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div key={template.id}>
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-secondary rounded-md overflow-hidden shrink-0">
                            <img
                              src={template.imageUrl}
                              alt={template.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{template.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                              {template.description}
                            </p>
                            <div className="inline-block bg-secondary text-xs rounded-full px-2 py-1">
                              {template.category}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(template.id)}
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Edit</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(template.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <span className="sr-only">Delete</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
