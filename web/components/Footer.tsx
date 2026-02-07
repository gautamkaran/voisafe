"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Separator } from "@/components/ui/Separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Documentation", href: "#docs" },
      { label: "Pricing", href: "#pricing" },
    ],
    company: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Blog", href: "#blog" },
    ],
    legal: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Security", href: "#security" },
    ],
  }

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4">VoiSafe</h3>
            <p className="text-sm text-gray-600">
              Anonymous grievance platform for educational institutions.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-900 mb-4 capitalize">
                {category}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom footer */}
        <div className="pb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} VoiSafe. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Made with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for safer
            institutions
          </div>
        </div>
      </div>
    </footer>
  )
}
