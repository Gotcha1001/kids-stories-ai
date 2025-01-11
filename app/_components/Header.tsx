"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import MotionWrapperDelay from "./FramerMotionStuff/MotionWrapperDelay";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [isMenuOpen]);

  const MenuList = [
    { name: "Home", path: "/" },
    { name: "Create Story", path: "/create-story" },
    { name: "Explore Stories", path: "/explore" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false); // Close the menu
    router.push(path); // Navigate to the new page
  };

  return (
    <MotionWrapperDelay
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: 0.8 }}
      variants={{
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="gradient-background2 p-4"
        maxWidth="full"
      >
        {/* Brand/Logo */}
        <NavbarBrand>
          <Link
            href="/"
            className="flex items-center gap-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className=" w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={60}
                height={60}
                className="horizontal-rotate"
              />
            </div>
            <h2 className="gradient-title font-bold text-2xl md:text-3xl">
              StoryTime
            </h2>
          </Link>
        </NavbarBrand>

        {/* Navigation Links */}
        <NavbarContent className="hidden md:flex gap-6" justify="center">
          {MenuList.map((item, index) => (
            <NavbarItem key={index}>
              <Link
                href={item.path}
                className="text-lg hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* CTA Button and Mobile Toggle */}
        <NavbarContent justify="end" className="flex items-center">
          <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
            <Button
              color="primary"
              variant="solid"
              className="text-sm hover:text-teal-500"
            >
              {isSignedIn ? "Dashboard" : "Get Started"}
            </Button>
          </Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-16 h-16",
              },
            }}
          />

          {/* Mobile Burger Menu Toggle */}
          <NavbarMenuToggle
            className="md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="text-center pt-16 space-y-7">
          {MenuList.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <button
                className="w-full text-lg py-2 hover:text-primary transition-colors"
                onClick={() => handleNavigation(item.path)}
              >
                {item.name}
              </button>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </MotionWrapperDelay>
  );
};

export default Header;
