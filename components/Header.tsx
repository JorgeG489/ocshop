'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCart } from '@/lib/shopify'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  useEffect(() => {
    const cartId = localStorage.getItem('cartId')
    if (cartId) getCart(cartId).then(c => { if (c) setCartCount(c.totalQuantity) })
  }, [])
  return (
    <header style={{ position:'sticky',top:0,zIndex:100,background:'rgba(10,10,10,0.96)',backdropFilter:'blur(10px)',borderBottom:'1px solid #1a1a1a',padding:'14px 24px' }}>
      <div style={{ maxWidth:1080,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <Link href="/" style={{ fontWeight:900,fontSize:'1.1rem',color:'white',letterSpacing:'-0.5px' }}>OC<span style={{ color:'#3b82f6' }}>Shop</span></Link>
        <nav style={{ display:'flex',gap:28,alignItems:'center' }}>
          <Link href="/products/smart-posture-correction-vest-1" style={{ color:'rgba(255,255,255,0.7)',fontSize:'0.88rem',fontWeight:500 }}>Chaleco IA</Link>
          <Link href="/products/null-1780170563413" style={{ color:'rgba(255,255,255,0.7)',fontSize:'0.88rem',fontWeight:500 }}>Cinturón</Link>
          <Link href="/cart" style={{ position:'relative',color:'white',display:'flex',alignItems:'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
