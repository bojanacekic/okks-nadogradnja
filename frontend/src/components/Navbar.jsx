
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Safely determine the name displayed in the navbar
  const displayName = user?.name || user?.email || 'User'
  const firstName = displayName.split(' ')[0]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-orange-500"
          >
            <UtensilsCrossed size={24} />
            Zodetron Dining
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>

            <Link to="/menu" className="hover:text-orange-500 transition-colors">
              Menu
            </Link>

            {user && (
              <Link
                to="/orders"
                className="hover:text-orange-500 transition-colors"
              >
                My Orders
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 hover:text-orange-500 transition-colors"
              >
                <LayoutDashboard size={16} />
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Shopping cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-orange-50 rounded-full transition-colors"
            >
              <ShoppingCart size={22} className="text-gray-600" />

              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Authenticated user */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-sm text-gray-600 font-medium">
                  Hi, {firstName}
                </span>

                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-500 hover:text-red-500"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (

              /* Guest user */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn-primary text-sm py-1.5 px-3"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}
