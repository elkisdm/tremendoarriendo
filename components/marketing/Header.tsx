"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
    className?: string;
}

export function Header({ className = "" }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-xl font-bold text-blue-600 dark:text-blue-400"
                        >
                            Hommie
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/properties" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Propiedades
                        </Link>
                        <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Nosotros
                        </Link>
                        <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Contacto
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-700"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                href="/properties"
                                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Propiedades
                            </Link>
                            <Link
                                href="/about"
                                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Nosotros
                            </Link>
                            <Link
                                href="/contact"
                                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contacto
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
}

