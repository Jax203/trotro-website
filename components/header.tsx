"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "./ui";
import { useMotion } from "./use-motion";
const links = [
  ["/parents", "For parents"],
  ["/schools", "For schools"],
  ["/safety", "Our approach to safety"],
  ["/about", "Our story"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const pointerMotion = useRef(false);
  const animate = useMotion();
  const path = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    animate(nav.current, {
      enabled: visible && pointerMotion.current,
      y: -6,
      duration: open ? 200 : 120,
      exit: !open,
      onFinish: () => {
        if (!open) setVisible(false);
      },
    });
  }, [open, visible, animate]);
  useEffect(() => {
    pointerMotion.current = false;
    setVisible(false);
    setOpen(false);
  }, [path]);
  useEffect(() => {
    const desktop = matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => {
      if (desktop.matches) {
        pointerMotion.current = false;
        setVisible(false);
        setOpen(false);
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === "Escape") {
        pointerMotion.current = false;
        setVisible(false);
        setOpen(false);
        button.current?.focus();
      }
    }
    if (open) document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/contact">
          Check ride availability <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
        <button
          ref={button}
          className="menu-button"
          onClick={(event) => {
            pointerMotion.current = event.detail > 0;
            if (!open) setVisible(true);
            setOpen(!open);
          }}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav
        className="mobile-nav"
        id="mobile-nav"
        aria-label="Mobile navigation"
        ref={nav}
        hidden={!visible}
        inert={!open}
        aria-hidden={!open}
      >
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        <Link href="/contact">
          Check ride availability <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
        <Link href="/download">Get the parent app</Link>
      </nav>
    </header>
  );
}
