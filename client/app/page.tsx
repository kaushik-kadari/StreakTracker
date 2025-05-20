import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/animated-section";
import { SiteHeader } from "@/components/site-header";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-1/3 -right-20 w-80 h-80 md:w-96 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 left-0 md:left-20 w-80 h-80 md:w-96 md:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 right-0 md:right-1/4 w-80 h-80 md:w-96 md:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <section className="py-24 md:py-32 relative z-10">
          <div className="container text-center space-y-10">
            <AnimatedSection
              animationType="slide"
              delay={0}
              duration={0.8}
              className="text-5xl md:text-7xl font-extrabold tracking-tight"
            >
              <h1 className="gradient-text">
                Track Your Habits, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  Build Your Streaks
                </span>
              </h1>
            </AnimatedSection>
            <AnimatedSection
              animationType="slide"
              delay={0.2}
              duration={0.8}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              <p>
                StreakTracker empowers you to build consistent habits by
                tracking your daily streaks and managing tasks seamlessly.
              </p>
            </AnimatedSection>
            <AnimatedSection
              animationType="scale"
              delay={0.4}
              duration={0.8}
              className="flex justify-center gap-4 mt-10"
            >
              <div className="space-x-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/80 hover:bg-white text-indigo-600 border-indigo-300 hover:border-indigo-400 px-8 py-6 text-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent opacity-70 -z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))] -z-5"></div>

          <div className="container relative">
            <AnimatedSection
              animationType="slide"
              delay={0}
              duration={0.8}
              className="text-center mb-16"
            >
              <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Why Choose{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                  StreakTracker
                </span>
                ?
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Track Your Progress",
                  description:
                    "Monitor your daily habits and watch your streaks grow. Celebrate milestones to stay motivated!",
                  icon: "🚀",
                },
                {
                  title: "Stay Consistent",
                  description:
                    "Daily reminders and notifications keep you on track to maintain your streaks and build habits.",
                  icon: "🎯",
                },
                {
                  title: "Task Management",
                  description:
                    "Organize tasks alongside streaks for a complete productivity solution in one place.",
                  icon: "📝",
                },
              ].map((feature, index) => (
                <AnimatedSection
                  animationType="slide"
                  delay={index * 0.2}
                  duration={0.6}
                  className="p-8 rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm border border-blue-100/60 hover:border-blue-200/80 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden bg-gradient-to-br from-white/90 to-blue-50/70"
                  key={index}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-500 -z-10 rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-md">
                      <span className="group-hover:scale-125 transition-transform duration-500">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-100/80 via-blue-50 to-indigo-50/80 animate-gradient border-t border-blue-200/50">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "url(" +
                  "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E" +
                  ")",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/5 via-transparent to-transparent"></div>
          </div>
          <div className="container relative">
            <AnimatedSection
              animationType="fade"
              delay={0}
              duration={1}
              className="text-center"
            >
              <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                  Ready to Build Your Streaks?
                </h2>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Join thousands of users transforming their habits with
                  StreakTracker. Start your journey to better habits today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/register" passHref>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-blue-200/50 hover:shadow-blue-200/70"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/login" passHref>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/90 hover:bg-white text-blue-600 border-blue-200 hover:border-blue-300 px-10 py-6 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:text-black"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent -mb-px"></div>
        </section>
      </main>
    </div>
  );
}

export default Home;
