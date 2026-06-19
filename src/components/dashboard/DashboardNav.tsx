"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

interface DashboardNavProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4"
      style={{
        background: "rgba(6, 13, 31, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gold-500 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 12L6 7L9 10L13 4"
              stroke="#0a1530"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          className="text-white font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}
        >
          Motometrix
        </span>
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/5"
        >
          <div className="text-right hidden md:block">
            <p className="text-white text-sm font-medium leading-tight">{user.name}</p>
            <p className="text-navy-300 text-xs">{user.email}</p>
          </div>
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={36}
              height={36}
              className="rounded-full ring-2 ring-white/10"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-navy-600 flex items-center justify-center text-white text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="text-navy-300"
            style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-48 rounded-xl py-1 z-50"
            style={{
              background: "#0f1f45",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >

            <Link
             href="/settings"
             className="w-full text-left px-4 py-3 text-sm text-navy-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
             onClick={() => setMenuOpen(false)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
               Settings
              </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-3 text-sm text-navy-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
