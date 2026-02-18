
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, ChevronDown } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(username, password, role);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Please sign in to continue">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 flex items-center animate-fade-in-up">
                    <span className="mr-2">⚠️</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Selection */}
                <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-gray-700 block ml-1">Login As</label>
                    <div className="relative group">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 text-[15px] appearance-none cursor-pointer"
                        >
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

                <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-gray-700 block ml-1">Username</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                            <User size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-gray-700 block ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
                            <Lock size={18} className="text-gray-400 group-focus-within:text-[#2563EB] transition-colors" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-[15px]"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-[14px] pt-1">
                    <label className="flex items-center text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-gray-300 focus:ring-[#2563EB] cursor-pointer" />
                        <span className="ml-2 font-medium">Remember me</span>
                    </label>
                    <a href="#" className="text-[#2563EB] hover:text-blue-700 font-medium transition-colors hover:underline">Forgot password?</a>
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
                            Sign In <ArrowRight size={18} className="ml-2" />
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Login;
