'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCart, formatPrice, type ShopifyCart } from '@/lib/shopify'

export default function CartPage() {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cartId = localStorage.getItem('cartId')
    if (cartId) {
      getCart(cartId).then(c => { setCart(c); setLoading(false) })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <div style={{ padding: '80px 24px', textAlign: 'center', color: '#999' }}>Cargando carrito...</div>

  if (!cart || cart.lines.nodes.length === 0) return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Tu carrito está vacío</h1>
      <Link href="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '14px 40px' }}>
        Ver productos
      </Link>
    </div>
  )

  return (
    <section style={{ padding: '56px 24px' }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 32 }}>Tu carrito</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {cart.lines.nodes.map(line => (
            <div key={line.id} style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#f9f9f9', borderRadius: 12, padding: 16 }}>
              {line.merchandise.image && (
                <Image
                  src={line.merchandise.image.url}
                  alt={line.merchandise.title}
                  width={80} height={80}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{line.merchandise.product.title}</p>
                <p style={{ fontSize: '0.82rem', color: '#888', marginTop: 2 }}>{line.merchandise.title}</p>
                <p style={{ fontWeight: 800, marginTop: 4 }}>
                  {formatPrice(line.merchandise.price)} × {line.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#666' }}>Subtotal</span>
            <span style={{ fontWeight: 700 }}>{formatPrice(cart.cost.subtotalAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Envío</span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>Gratis</span>
          </div>
        </div>

        <a href={cart.checkoutUrl} className="btn-primary" style={{ display: 'block', fontSize: '1rem', padding: 18 }}>
          Finalizar compra — {formatPrice(cart.cost.totalAmount)}
        </a>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#aaa', marginTop: 12 }}>
          ✓ Pago seguro · ✓ Garantía 30 días
        </p>
      </div>
    </section>
  )
}
