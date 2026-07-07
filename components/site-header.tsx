"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "#components/theme-toggle";

const navItems = [
  { href: "/posts", label: "博客" },
  { href: "/", label: "关于" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => {
      setScrolled(window.scrollY > 16);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolled);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none relative h-20 w-full opacity-0" />
      <header
        className={`top-0 z-50 w-full transition-[height] duration-300 ease-out ${
          scrolled ? "fixed h-14" : "absolute h-20"
        }`}
      >
        <div
          className={`site-header-frame mx-auto flex h-full max-w-5xl items-center justify-between border-b px-6 select-none transition-colors duration-300 ease-out lg:border-x ${
            scrolled
              ? "border-neutral-300/50 bg-white/80 backdrop-blur-[15px] dark:border-neutral-700/40 dark:bg-neutral-900/60"
              : "border-transparent"
          }`}
        >
          <Link
            href="/"
            aria-label="Xuan"
            className="relative z-30 flex items-center !no-underline transition-opacity duration-200 hover:!opacity-100"
          >
            <img
              src="/icon.svg"
              alt=""
              className="h-8 w-8 object-contain"
            />
          </Link>
          <nav className="relative z-30 ml-auto flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={`relative flex items-center justify-center px-3 py-2 text-center font-medium tracking-wide !no-underline duration-200 ease-out hover:text-neutral-900 hover:!opacity-100 dark:hover:text-white sm:py-0 ${
                    isActive
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <ThemeToggle />
          </nav>
        </div>
      </header>
    </>
  );
}
