import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-md bg-blue-600 p-1.5 text-white">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="h-5 w-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" 
                />
              </svg>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Automated Grading System
            </span>
          </Link>
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Login</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-3 p-4">
                  <li>
                    <Link href="/login/student" legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={cn(
                          "flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md dark:from-gray-800 dark:to-gray-900",
                          "hover:bg-gradient-to-b hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-800"
                        )}
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Student Login
                        </div>
                        <p className="text-sm leading-tight text-gray-600 dark:text-gray-400">
                          Access your assignments and grades
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/login/teacher" legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={cn(
                          "flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md dark:from-gray-800 dark:to-gray-900",
                          "hover:bg-gradient-to-b hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-800"
                        )}
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Teacher Login
                        </div>
                        <p className="text-sm leading-tight text-gray-600 dark:text-gray-400">
                          Manage classes and review student work
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="h-5 w-5"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/" className="w-full cursor-pointer">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about" className="w-full cursor-pointer">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login/student" className="w-full cursor-pointer">Student Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login/teacher" className="w-full cursor-pointer">Teacher Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact" className="w-full cursor-pointer">Contact Us</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Desktop Right Side - Removed the Get Started button */}
        <div className="hidden md:ml-auto md:flex">
          {/* Get Started button removed */}
        </div>
      </div>
    </div>
  );
};

export default Navbar; 