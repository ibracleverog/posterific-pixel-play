
import { Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="py-12 border-t border-border/40 mt-auto">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block text-lg font-semibold mb-4 text-primary">
              PosterPlay
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Create beautiful custom posters by uploading your own images to professionally designed templates.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Admin
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>© {year} PosterPlay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
