
import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, BookOpen, GraduationCap, Briefcase, ChevronDown, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'student',
        name: '',
        // Role specific fields
        class_id: '',
        roll_no: '',
        subject_specialization: '',
        phone: '',
        student_id: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.post('/auth/register', formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join our school management system today.">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 flex items-center">
                    <span className="mr-2">⚠️</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Full Name & Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-gray-700 block ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                <User size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                            </div>
                            <input type="text" name="name" required placeholder="John Doe" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-gray-700 block ml-1">Username</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                <User size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                            </div>
                            <input type="text" name="username" required placeholder="johndoe" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                        </div>
                    </div>
                </div>

                {/* Password & Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-gray-700 block ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                <Lock size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                            </div>
                            <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-gray-700 block ml-1">Role</label>
                        <div className="relative group">
                            <select name="role" onChange={handleChange} value={formData.role} className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 text-[15px] appearance-none cursor-pointer">
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="parent">Parent</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown size={18} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conditional Fields */}
                <div className="pt-2 border-t border-gray-100">
                    {formData.role === 'student' && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                            <div className="space-y-1.5">
                                <label className="text-[14px] font-medium text-gray-700 block ml-1">Class ID</label>
                                <input type="number" name="class_id" placeholder="10" onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[14px] font-medium text-gray-700 block ml-1">Roll No</label>
                                <input type="text" name="roll_no" placeholder="A-101" onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                            </div>
                        </div>
                    )}

                    {formData.role === 'teacher' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="space-y-1.5">
                                <label className="text-[14px] font-medium text-gray-700 block ml-1">Subject Specialization</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                        <BookOpen size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                                    </div>
                                    <input type="text" name="subject_specialization" placeholder="Mathematics" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[14px] font-medium text-gray-700 block ml-1">Phone</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                        <Phone size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                                    </div>
                                    <input type="text" name="phone" placeholder="+1 234 567 890" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.role === 'parent' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="space-y-1.5">
                                <label className="text-[14px] font-medium text-gray-700 block ml-1">Phone</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                        <Phone size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                                    </div>
                                    <input type="text" name="phone" placeholder="+1 234 567 890" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[14px] font-medium text-gray-700 block ml-1">Child's Student ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                                        <GraduationCap size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                                    </div>
                                    <input type="number" name="student_id" placeholder="Student ID" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold h-[48px] rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] transform hover:-translate-y-0.5 text-[16px]"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            Create Account <ArrowRight size={18} className="ml-2" />
                        </>
                    )}
                </button>

                <div className="text-center text-[14px] text-gray-500 mt-8 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#2563EB] hover:text-blue-700 font-semibold hover:underline transition-colors">
                        Sign In
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
