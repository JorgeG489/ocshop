'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { getProduct, addToCart, createCart, formatPrice, type ShopifyProduct, type ShopifyVariant } from '@/lib/shopify'

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>()
  const router = useRouter()

  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!handle) return
    getProduct(handle).then(p => {
      setProduct(p)
      if (p?.variants.nodes[0]) setSelectedVariant(p.variants.nodes[0])
      setLoading(false)
    })
  }, [handle])

  async function handleAddToCart() {
    if (!selectedVariant) return
    setAdding(true)
    try {
      let cartId = localStorage.getItem('cartId')
      let cart
      if (!cartId) {
        cart = await createCart()
        localStorage.setItem('cartId', cart.id)
      }
      cartId = localStorage.getItem('cartId')!
      await addToCart(cartId, selectedVariant.id)
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    } finally {
      setAdding(false)
    }
  }

  async function handleBuyNow() {
    if (!selectedVariant) return
    setAdding(true)
    try {
      let cartId = localStorage.getItem('cartId')
      if (!cartId) {
        const cart = await createCart()
        localStorage.setItem('cartId', cart.id)
        cartId = cart.id
      }
      const cart = await addToCart(cartId, selectedVariant.id)
      window.location.href = cart.checkoutUrl
    } catch {
      setAdding(false)
    }
  }

  if (loading) return (
    <div style={{ padding: '80px 24px', textAlign: 'center', color: '#999' }}>Cargando...</div>
  )
  if (!product) return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <h1>Producto no encontrado</h1>
    </div>
  )

  const price = selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.priceRange.minVariantPrice)
  const compareAt = selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > 0
    ? formatPrice(selectedVariant.compareAtPrice) : null
  const images = product.images.nodes.length > 0 ? product.images.nodes : product.featuredImage ? [product.featuredImage] : []

  // Group options for display
  const hasOptions = product.options.some(o => o.values.length > 1)

  return (
    <section style={{ padding: '56px 24px' }}>
      <div className="container">
        <div className="product-grid" style={{ gap: 48 }}>
          {/* Images */}
          <div>
            {images[activeImage] && (
              <div style={{ marginBottom: 12 }}>
                <Image
                  src={images[activeImage].url}
                  alt={images[activeImage].altText ?? product.title}
                  width={700} height={525}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                  priority
                />
              </div>
            )}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    style={{ border: i === activeImage ? '2px solid #0a0a0a' : '2px solid transparent', borderRadius: 8, overflow: 'hidden', padding: 0, background: 'none', cursor: 'pointer' }}>
                    <Image src={img.url} alt="" width={80} height={60}
                      style={{ width: 80, height: 60, objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ color: '#f59e0b', fontSize: '0.88rem', marginBottom: 10 }}>
              ★★★★★ <span style={{ color: '#999', fontSize: '0.8rem' }}>Compras verificadas</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 14, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
              {product.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: '2rem', fontWeight: 900 }}>{price}</span>
              {compareAt && <span style={{ color: '#ccc', textDecoration: 'line-through', fontSize: '0.95rem' }}>{compareAt}</span>}
              {compareAt && <span className="badge-off">OFERTA</span>}
            </div>

            {/* Variant selector */}
            {hasOptions && product.options.map(option => (
              option.values.length > 1 && (
                <div key={option.name} style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: '#555' }}>
                    {option.name}: <strong style={{ color: '#0a0a0a' }}>
                      {selectedVariant?.selectedOptions.find(o => o.name === option.name)?.value}
                    </strong>
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {option.values.map(value => {
                      const variant = product.variants.nodes.find(v =>
                        v.selectedOptions.some(o => o.name === option.name && o.value === value)
                      )
                      const isSelected = selectedVariant?.selectedOptions.some(o => o.name === option.name && o.value === value)
                      return (
                        <button key={value}
                          className={`variant-option ${isSelected ? 'selected' : ''}`}
                          disabled={!variant?.availableForSale}
                          onClick={() => variant && setSelectedVariant(variant)}>
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <button className="btn-primary" onClick={handleBuyNow} disabled={adding || !selectedVariant?.availableForSale}
                style={{ background: '#0a0a0a' }}>
                {adding ? 'Procesando...' : 'Comprar Ahora'}
              </button>
              <button className="btn-primary" onClick={handleAddToCart} disabled={adding || !selectedVariant?.availableForSale}
                style={{ background: added ? '#16a34a' : '#333' }}>
                {added ? '✓ Agregado al carrito' : 'Agregar al Carrito'}
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.65 }}>
              ✓ Envío gratis · ✓ Garantía 30 días · ✓ Devolución sin preguntas
            </p>

            {product.description && (
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 10 }}>Descripción</h3>
                <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.75 }}>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
