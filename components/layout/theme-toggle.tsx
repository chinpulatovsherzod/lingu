"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Read initial theme from localStorage or document class
    const savedTheme = localStorage.getItem("lingu_theme");
    const hasDarkClass = document.documentElement.classList.contains("dark");
    
    if (savedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else if (!hasDarkClass) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lingu_theme", "light");
      // Set cookie as well for server-side if needed
      document.cookie = "lingu_theme=light; path=/; max-age=31536000";
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("lingu_theme", "dark");
      document.cookie = "lingu_theme=dark; path=/; max-age=31536000";
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-white hover:bg-muted/50"
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-warning" />
      ) : (
        <Moon className="h-4 w-4 text-primary" />
      )}
    </Button>
  );
}
