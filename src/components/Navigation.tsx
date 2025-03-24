
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const links = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/templates" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "py-3 bg-white/80 shadow-sm backdrop-blur-lg" : "py-5 bg-transparent"
      )}
    >
      <div className="container-wide flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-semibold flex items-center space-x-2 text-primary"
          onClick={closeMenu}
        >
          <span>PosterPlay</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground hover:bg-accent"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/templates">
            <Button className="ml-4 shadow-sm">
              <span>Create Now</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground p-2 rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ top: "57px" }}
      >
        <nav className="flex flex-col p-8 space-y-5">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "px-4 py-3 rounded-md text-lg font-medium transition-colors",
                location.pathname === link.href
                  ? "text-primary bg-accent"
                  : "text-foreground/80 hover:text-foreground hover:bg-accent"
              )}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/templates" onClick={closeMenu}>
            <Button className="w-full justify-center mt-6 shadow-sm">
              <span>Create Now</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
