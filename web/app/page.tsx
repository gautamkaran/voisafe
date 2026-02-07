"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  MessageSquare,
  Lock,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Zap,
  Users,
  Award,
} from "lucide-react";

import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Trusted by educational institutions across the country
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
                Speak Up
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Safely & Securely
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Anonymous grievance platform for educational institutions.
                Report issues without fear. Your identity is protected.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Submit Complaint
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                >
                  Track Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why VoiSafe?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to protect your privacy while ensuring
              your voice is heard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="relative group p-8 rounded-2xl border border-gray-200 hover:border-blue-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-300 -z-10" />

              <div className="mb-4 inline-block p-3 bg-blue-100 rounded-lg">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Anonymous
              </h3>
              <p className="text-gray-600">
                Your identity is never stored with complaints. Only encrypted
                tracking IDs are used for status updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative group p-8 rounded-2xl border border-gray-200 hover:border-blue-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-300 -z-10" />

              <div className="mb-4 inline-block p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Communication
              </h3>
              <p className="text-gray-600">
                Communicate with committee members through secure, encrypted
                channels while maintaining complete anonymity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative group p-8 rounded-2xl border border-gray-200 hover:border-blue-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-300 -z-10" />

              <div className="mb-4 inline-block p-3 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Enterprise Security
              </h3>
              <p className="text-gray-600">
                Military-grade AES-256 encryption, secure data handling, and
                compliance with institutional standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - Images/Icons */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Protected Privacy
                  </h4>
                  <p className="text-sm text-gray-600">
                    Identity decoupling ensures your personal information is
                    never linked to your complaint
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition">
                <BarChart3 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Track Progress
                  </h4>
                  <p className="text-sm text-gray-600">
                    Monitor complaint status in real-time with detailed updates
                    from the committee
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition">
                <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Multi-Committee Support
                  </h4>
                  <p className="text-sm text-gray-600">
                    Designated committees handle different types of grievances
                    professionally
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Built for Institutions,
                <br />
                Designed for Students
              </h2>
              <p className="text-lg text-gray-600">
                VoiSafe provides a comprehensive solution for managing student
                grievances while maintaining exceptional levels of anonymity and
                security.
              </p>

              <ul className="space-y-3">
                {[
                  "Multi-tenant architecture for multiple organizations",
                  "Role-based access control for admins and committees",
                  "Real-time notifications and updates",
                  "Comprehensive audit logs and reporting",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button size="lg" className="gap-2 mt-4">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Start reporting safely today. Your voice matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="outline" className="gap-2">
                Submit Your First Complaint
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Already have an account? Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
