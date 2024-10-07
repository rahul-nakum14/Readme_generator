"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface AuthFormProps {
  type: 'signin' | 'signup'
}

export default function AuthForm({ type }: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (type === 'signin') {
      console.log('Sign in with:', email, password)
    } else {
      console.log('Sign up with:', name, email, password)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="bg-secondary-800 shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-primary-500">
          {type === 'signin' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <form onSubmit={handleSubmit}>
          {type === 'signup' && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-secondary-300 text-sm font-bold mb-2">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 bg-secondary-700 border-secondary-600"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email-address" className="block text-secondary-300 text-sm font-bold mb-2">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 bg-secondary-700 border-secondary-600"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-secondary-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={type === 'signin' ? 'current-password' : 'new-password'}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 bg-secondary-700 border-secondary-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {type === 'signin' && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-700 rounded bg-secondary-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-500 hover:text-primary-400">
                  Forgot your password?
                </a>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              {type === 'signin' ? 'Sign in' : 'Sign up'}
            </motion.button>
          </div>
        </form>
      </div>
      <div className="text-center">
        <p className="text-sm text-secondary-300">
          {type === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Link href={type === 'signin' ? '/signup' : '/signin'} className="font-medium text-primary-500 hover:text-primary-400">
            {type === 'signin' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}