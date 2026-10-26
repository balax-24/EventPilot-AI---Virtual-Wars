"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Compass, Menu, X, CalendarCheck, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(10, 13, 20, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="container"
        style={{
          height: "4.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
          aria-label="EventPilot AI Home"
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 2px 10px rgba(99, 102, 241, 0.4)",
            }}
          >
            <Compass size={20} />
          </div>
          <div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                background: "linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              EventPilot
            </span>
            <span
              style={{
                marginLeft: "0.3rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          style={{
            display: "none",
            alignItems: "center",
            gap: "1.75rem",
          }}
          className="desktop-nav"
        >
          <Link
            href="/"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              transition: "color var(--transition-fast)",
            }}
          >
            Overview
          </Link>
          <Link
            href="/#features"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              transition: "color var(--transition-fast)",
            }}
          >
            Features
          </Link>
          <Link
            href="/events"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "color var(--transition-fast)",
            }}
          >
            <BookmarkCheck size={16} />
            <span>Saved Plans</span>
          </Link>

          <Link href="/plan/new" style={{ textDecoration: "none" }}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles size={16} />}
              style={{ padding: "0.55rem 1.1rem" }}
            >
              Plan Event
            </Button>
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <div className="mobile-nav-toggle">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Overview
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Features
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <BookmarkCheck size={18} />
            <span>Saved Plans</span>
          </Link>
          <Link
            href="/plan/new"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="primary"
              size="md"
              leftIcon={<Sparkles size={16} />}
              style={{ width: "100%" }}
            >
              Plan an Event
            </Button>
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
