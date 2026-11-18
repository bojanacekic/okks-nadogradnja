import { Link } from 'react-router-dom'
import { ArrowRight, Star, Clock, Truck } from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  { icon: <Clock className="text-orange-500" size={28} />, title: 'Fast Delivery', desc: 'Get your food in 30 minutes or less' },
  { icon: <Star className="text-orange-500" size={28} />, title: 'Top Quality', desc: 'Fresh ingredients, amazing taste' },
  { icon: <Truck className="text-orange-500" size={28} />, title: 'Free Delivery', desc: 'On orders over $25' },
]

const cuisines = [
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '🍔', name: 'Burgers' },
  { emoji: '🍣', name: 'Sushi' },
  { emoji: '🍝', name: 'Pasta' },
  { emoji: '🥗', name: 'Salads' },
  { emoji: '🍰', name: 'Desserts' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge bg-orange-100 text-orange-600 mb-4 text-sm">🔥 Where Code Meets Cuisine</span>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-2">
              Zodetron Dining
            </h1>
            <p className="text-orange-500 font-semibold text-lg mb-2 italic">by Hardik</p>
            <p className="text-gray-400 text-sm mb-4 font-medium tracking-wide">Powered by Taste. Driven by Tech.</p>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              Order from your favorite restaurants and get fresh, hot food delivered right to your door in minutes.
            </p>
            <div className="flex gap-4">
              <Link to="/menu" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
                Order Now <ArrowRight size={18} />
              </Link>
              <Link to="/menu" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
                Browse Menu
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
              <div><span className="font-bold text-gray-900 text-lg">500+</span><br />Menu Items</div>
              <div className="w-px h-8 bg-gray-200" />
              <div><span className="font-bold text-gray-900 text-lg">10k+</span><br />Happy Customers</div>
              <div className="w-px h-8 bg-gray-200" />
              <div><span className="font-bold text-gray-900 text-lg">4.9★</span><br />Rating</div>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"
              alt="Delicious food"
              className="rounded-3xl shadow-2xl w-full object-cover h-96"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors">
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisines */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">What are you craving?</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {cuisines.map(c => (
              <Link
                key={c.name}
                to={`/menu?category=${c.name}`}
                className="card p-6 text-center hover:shadow-md hover:border-orange-200 transition-all group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{c.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-orange-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Ready to order?</h2>
        <p className="text-orange-100 mb-1 text-lg">Join thousands of happy customers today</p>
        <p className="text-orange-200 text-sm mb-8 italic">Zodetron Dining by Hardik — Where Code Meets Cuisine.</p>
        <Link to="/register" className="bg-white text-orange-500 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors inline-block">
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm">
        <p className="text-orange-400 font-bold text-lg mb-1">Zodetron Dining</p>
        <p className="text-gray-500 text-xs mb-1 italic">Where Code Meets Cuisine · Powered by Taste. Driven by Tech.</p>
        <p className="text-gray-600 text-xs">Crafted with ❤️ by <span className="text-orange-400 font-semibold">Hardik</span> · © {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  )
}
