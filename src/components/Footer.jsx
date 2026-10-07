import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, Sparkles, Send, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    window.dispatchEvent(new CustomEvent('nocturne_toast', {
      detail: {
        title: 'Invitation Confirmed',
        message: 'You have been enrolled in the Nocturne Gastronomy Journal',
        type: 'success'
      }
    }));
  };

  return (
    <footer className="bg-[#08080A] border-t border-white/5 pt-20 pb-12 text-[#8E8E99] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#881A2D]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center">
                <span className="font-serif text-xl font-bold text-gold-gradient">N</span>
              </div>
              <span className="font-cinzel text-2xl tracking-[0.25em] font-bold text-[#F7F4EE]">
                NOCTURNE
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#A0A0AA]">
              A new generation of dining where Michelin-caliber culinary artistry meets intelligent technology and 3D visual experiences.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#F7F4EE]">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>2 Michelin Stars</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#F7F4EE]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>World's 50 Best</span>
              </div>
            </div>
          </div>

          {/* Gastronomy Links */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#F7F4EE] font-semibold">
              Gastronomy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/menu" className="hover:text-[#D4AF37] transition-colors">Tasting Menu</Link></li>
              <li><Link to="/manual/food" className="hover:text-[#D4AF37] transition-colors">Manual Food Ordering</Link></li>
              <li><Link to="/menu?category=biryani" className="hover:text-[#D4AF37] transition-colors">Dum Pukht Biryani</Link></li>
              <li><Link to="/menu?category=biryani" className="hover:text-[#D4AF37] transition-colors">Dum Pukht Biryani</Link></li>
              <li><Link to="/menu?category=desserts" className="hover:text-[#D4AF37] transition-colors">Pastry Lab</Link></li>
            </ul>
          </div>

          {/* Hospitality Links */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#F7F4EE] font-semibold">
              Hospitality
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/reservation" className="hover:text-[#D4AF37] transition-colors">Interactive 3D Floor Plan</Link></li>
              <li><Link to="/ai/reservation" className="hover:text-[#D4AF37] transition-colors">AI Table Concierge</Link></li>
              <li><Link to="/dashboard/user" className="hover:text-[#D4AF37] transition-colors">Member Dashboard</Link></li>
              <li><Link to="/favorites" className="hover:text-[#D4AF37] transition-colors">Saved Cellar & Dishes</Link></li>
              <li><Link to="/offers" className="hover:text-[#D4AF37] transition-colors">Exclusive Offers & Combos</Link></li>
            </ul>
          </div>

          {/* Private Portals */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#F7F4EE] font-semibold">
              Executive Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/dashboard/owner" className="hover:text-[#EF4444] transition-colors flex items-center gap-1">Kitchen & Owner Live</Link></li>
              <li><Link to="/dashboard/owner/menu" className="hover:text-[#EF4444] transition-colors">Owner Menu CRUD</Link></li>
              <li><Link to="/dashboard/owner/tables" className="hover:text-[#EF4444] transition-colors">Table Real-time Floor</Link></li>
              <li><Link to="/dashboard/admin" className="hover:text-blue-400 transition-colors flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Super Admin Control</Link></li>
              <li><Link to="/dashboard/admin/analytics" className="hover:text-blue-400 transition-colors">Platform Financials</Link></li>
            </ul>
          </div>

        </div>

        {/* Newsletter & Editorial Bar */}
        <div className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-b border-white/5">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F7F4EE] italic">
              "Taste Beyond Imagination."
            </h3>
            <p className="text-xs text-[#8E8E99] mt-1">
              Subscribe to the Nocturne Gastronomy Journal for private invitations and seasonal tasting launches.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md lg:ml-auto w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your VIP email address"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666670] focus:outline-none focus:border-[#D4AF37]/50"
              disabled={subscribed}
            />
            <button
              type="submit"
              disabled={subscribed}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 flex-shrink-0"
            >
              {subscribed ? 'Joined' : 'Subscribe'}
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Bottom Copyright & Fine Print */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} NOCTURNE Haute Gastronomy. Crafted with culinary excellence.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>London Mayfair</span>
            <span>•</span>
            <span>Manhattan Penthouse</span>
            <span>•</span>
            <span>Tokyo Ginza</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
