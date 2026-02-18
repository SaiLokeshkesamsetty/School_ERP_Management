import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Quote } from 'lucide-react';

const testimonials = [
    {
        quote: "This ERP system has completely transformed how we manage our school. The efficiency gains are remarkable.",
        author: "Sarah Johnson",
        role: "Principal, Westview Academy"
    },
    {
        quote: "The best school management software we've used in 10 years. Intuitive, fast, and reliable.",
        author: "David Chen",
        role: "Administrator, Oakridge High"
    },
    {
        quote: "Parents love the transparency and students find it super easy to check their grades. A game changer!",
        author: "Emily Davis",
        role: "Senior Teacher, Maplewood School"
    }
];

const AuthLayout = ({ children, title, subtitle }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen font-poppins selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A8A] relative overflow-hidden text-white flex-col justify-between p-16">
                {/* Background Gradient & Shapes */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#2563EB] opacity-90"></div>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute top-[40%] -right-[20%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                            <BookOpen size={28} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-xl font-bold tracking-wide text-white/90">School ERP</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-lg mt-12">
                    <h2 className="text-5xl font-bold mb-6 leading-[1.1] tracking-tight">
                        Smart. Secure. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Simplified.</span>
                    </h2>

                    <p className="text-lg text-blue-100/80 leading-relaxed font-light mb-10">
                        Experience the next generation of school management. Streamlined workflows, real-time insights, and a seamless interface designed for modern education.
                    </p>

                    {/* Testimonial Slider */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
                        <Quote className="absolute top-4 right-4 text-white/10 w-8 h-8 rotate-180" />
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <div className="min-h-[100px]">
                            <p className="text-lg font-medium text-white mb-4 italic leading-relaxed transition-opacity duration-500">
                                "{testimonials[currentTestimonial].quote}"
                            </p>
                            <div>
                                <h4 className="font-semibold text-white">{testimonials[currentTestimonial].author}</h4>
                                <p className="text-sm text-blue-200">{testimonials[currentTestimonial].role}</p>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
                            <div className="h-full bg-blue-400/50 w-full animate-[progress_5s_linear_infinite] origin-left"></div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-blue-200/60 font-medium tracking-wide flex justify-between items-center">
                    <span>© 2026 School ERP</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-[#F8FAFC]">
                {/* Mobile Background Header */}
                <div className="absolute lg:hidden top-0 left-0 w-full h-64 bg-[#1E3A8A]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#172554] to-[#2563EB] opacity-90"></div>
                    <div className="p-8 text-white relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={24} className="text-white" />
                            <h1 className="text-xl font-bold">School ERP</h1>
                        </div>
                        <p className="text-blue-100 text-sm">Smart. Secure. Simplified.</p>
                    </div>
                </div>

                <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative z-10 animate-fade-in-up mt-24 lg:mt-0">
                    <div className="p-10 md:p-12">
                        <div className="text-center mb-8">
                            <h2 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">{title}</h2>
                            <p className="text-gray-500 text-[16px]">{subtitle}</p>
                        </div>
                        {children}
                    </div>
                    <div className="bg-gray-50 px-10 py-4 text-center border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            Secure Login with SSL Encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
