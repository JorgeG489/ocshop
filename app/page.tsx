import Image from 'next/image'
import Link from 'next/link'
import { getProducts, formatPrice } from '@/lib/shopify'

// Vest handle → smart-posture-correction-vest-1
// Belt handle → null-1780170563413

export const revalidate = 60

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getProducts>> = []
  try { products = await getProducts(10) } catch {}

  const vest = products.find(p => p.handle.includes('smart-posture')) ?? null
  const belt = products.find(p => p.handle.includes('1780170563413')) ?? null

  const vestPrice = vest ? formatPrice(vest.priceRange.minVariantPrice) : '$79.99'
  const beltPrice = belt ? formatPrice(belt.priceRange.minVariantPrice) : '$29.99'
  const vestCompare = vest?.compareAtPriceRange.minVariantPrice.amount && parseFloat(vest.compareAtPriceRange.minVariantPrice.amount) > 0
    ? formatPrice(vest.compareAtPriceRange.minVariantPrice)
    : '$129.99'

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%)', color: 'white', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: '0.78rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.45)', marginBottom: 20, fontWeight: 700 }}>
            ★★★★★ MAS DE 5000 CLIENTES SATISFECHOS
          </p>
          <h1 style={{ fontSize: 'clamp(2rem,6vw,3.8rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 20 }}>
            Di adiós al dolor<br />de espalda.
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 32px' }}>
            Productos diseñados para corregir tu postura y eliminar el dolor. Resultados en 2 semanas o devolvemos tu dinero.
          </p>
          <div className="hero-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link href="/products/smart-posture-correction-vest-1" className="btn-white">
              Chaleco IA — {vestPrice}
            </Link>
            <Link href="/products/null-1780170563413" className="btn-outline">
              Cinturón — {beltPrice}
            </Link>
          </div>
          <p style={{ marginTop: 18, fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
            Envío gratis · Garantía 30 días · Devolución sin preguntas
          </p>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section style={{ background: '#f8f9fa', borderBottom: '1px solid #e8e8e8', padding: '14px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 36px', alignItems: 'center' }}>
          {['🏆 GARANTÍA 30 DÍAS', '⭐ 4.9/5 · +5000 RESEÑAS', '🚚 ENVÍO GRATIS +$50', '🔒 PAGO SEGURO'].map(t => (
            <span key={t} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#222' }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── Product 1: Vest ── */}
      <section style={{ background: 'white', padding: '72px 24px' }}>
        <div className="container">
          <div className="product-grid">
            <div style={{ position: 'relative' }}>
              <Image
                src="https://cdn.shopify.com/s/files/1/0737/9940/1561/files/photo-1571019613454-1cb2f99b2d8b.jpg?v=1780120701"
                alt="Smart Posture Correction Vest"
                width={600} height={450}
                style={{ width: '100%', height: 'auto', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
                priority
              />
              <span className="badge-sold" style={{ position: 'absolute', top: 14, left: 14 }}>MÁS VENDIDO</span>
            </div>
            <div>
              <div style={{ color: '#f59e0b', fontSize: '0.88rem', marginBottom: 10 }}>
                ★★★★★ <span style={{ color: '#999', fontSize: '0.8rem' }}>4.9 (2,847 reseñas)</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 14, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                Smart Posture<br />Correction Vest
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.75, marginBottom: 22 }}>
                El chaleco con IA que aprende tu patrón postural único y te corrige suavemente. Tan delgado que nadie sabe que lo usas.
              </p>
              <div className="feature-chips">
                {['🧠 IA Adaptativa', '🧣 Invisible', '🔋 10h Batería', '🏥 Certificado'].map(f => (
                  <div key={f} style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700 }}>{f}</div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: '1.9rem', fontWeight: 900 }}>{vestPrice}</span>
                <span style={{ color: '#ccc', textDecoration: 'line-through', fontSize: '0.95rem' }}>{vestCompare}</span>
                <span className="badge-off">38% OFF</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#e55', marginBottom: 16, fontWeight: 600 }}>⚡ Solo quedan 23 unidades</p>
              <Link href="/products/smart-posture-correction-vest-1" className="btn-primary">
                Comprar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product 2: Belt ── */}
      <section style={{ background: '#f5f5f5', padding: '72px 24px' }}>
        <div className="container">
          <div className="product-grid">
            <div>
              <span className="badge-new" style={{ display: 'inline-block', marginBottom: 14 }}>NUEVO · EN STOCK</span>
              <div style={{ color: '#f59e0b', fontSize: '0.88rem', marginBottom: 10 }}>
                ★★★★★ <span style={{ color: '#999', fontSize: '0.8rem' }}>4.8 (1,290 reseñas)</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 14, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                Cinturón Corrector<br />de Postura
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.75, marginBottom: 22 }}>
                Ajustable, ligero y discreto. Corrige el encorvamiento y alivia el dolor desde el primer día. Compatible con cualquier talla.
              </p>
              <div className="feature-chips">
                {['🤝 Tallas S–XXXL', '🪶 255g', '🌗 2 colores', '💪 Desde el día 1'].map(f => (
                  <div key={f} style={{ padding: '10px 12px', background: 'white', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700 }}>{f}</div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: '1.9rem', fontWeight: 900 }}>{beltPrice}</span>
                <span className="badge-stock">EN STOCK</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: 16 }}>Envío en 7–15 días · Seguimiento disponible</p>
              <Link href="/products/null-1780170563413" className="btn-primary">
                Comprar Ahora
              </Link>
            </div>
            <div className="img-col">
              <Image
                src="https://cdn.shopify.com/s/files/1/0737/9940/1561/files/7844d976-cd43-4ff8-9298-f91e8035dc37.jpg?v=1780170566"
                alt="Cinturón Corrector de Postura"
                width={600} height={450}
                style={{ width: '100%', height: 'auto', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#0a0a0a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <div className="container">
          <div className="stats-grid">
            {[['93%','Mejora postura en 2 semanas'], ['87%','Reduce dolor de espalda'], ['5000+','Clientes satisfechos']].map(([n, label], i) => (
              <div key={n} className="stat" style={{ padding: 20, borderLeft: i > 0 ? '1px solid #1f1f1f' : undefined }}>
                <div style={{ fontSize: '2.8rem', fontWeight: 900 }}>{n}</div>
                <p style={{ marginTop: 8, fontSize: '0.82rem', color: '#666' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: 'white', padding: '72px 24px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 900, marginBottom: 8 }}>¿Cómo funciona?</h2>
          <p style={{ textAlign: 'center', color: '#999', fontSize: '0.88rem', marginBottom: 44 }}>Simple, efectivo y comprobado</p>
          <div className="how-grid">
            {[
              ['1', 'Póntelo', 'Ligero y discreto bajo tu ropa. Nadie lo nota. Lo activas desde la app.'],
              ['2', 'La IA aprende', 'Mapea tu patrón postural único y empieza a corregirte automáticamente.'],
              ['3', 'Resultados reales', '93% nota mejora notable en menos de 2 semanas. Sin dolor, con confianza.'],
            ].map(([n, title, desc]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, background: '#0a0a0a', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, margin: '0 auto 14px' }}>{n}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: '#f5f5f5', padding: '72px 24px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 900, marginBottom: 6 }}>Lo que dicen nuestros clientes</h2>
          <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', marginBottom: 40 }}>+5000 personas ya lo usan</p>
          <div className="testimonials-grid">
            {[
              ['JM', 'Juan Martínez', '"Cambio total en 3 semanas. Sin dolor, con confianza. Lo uso en la oficina y nadie lo nota."'],
              ['MG', 'María González', '"Probé otros pero eran incómodos. Este es REALMENTE diferente. Ya no pienso en mi postura."'],
              ['CL', 'Carlos López', '"10 años de dolor crónico. Finalmente algo que funciona. 100% recomendado."'],
            ].map(([init, name, quote]) => (
              <div key={name} style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#f59e0b', fontSize: '0.85rem', marginBottom: 10 }}>★★★★★</div>
                <p style={{ fontSize: '0.88rem', color: '#333', lineHeight: 1.7, marginBottom: 14 }}>{quote}</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{name} <span style={{ fontWeight: 400, color: '#bbb' }}>· Compra verificada</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0a0a0a', color: 'white', padding: '88px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '2.5px', color: '#555', marginBottom: 14, fontWeight: 700 }}>OFERTA LIMITADA</p>
          <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.5rem)', fontWeight: 900, marginBottom: 14, lineHeight: 1.1 }}>¿Listo para vivir sin dolor?</h2>
          <p style={{ fontSize: '0.92rem', color: '#666', lineHeight: 1.65, marginBottom: 28 }}>Únete a +5000 personas. Garantía total 30 días.</p>
          <Link href="/products/smart-posture-correction-vest-1" className="btn-white" style={{ fontSize: '0.95rem', fontWeight: 900 }}>
            Comprar Ahora — {vestPrice}
          </Link>
          <p style={{ marginTop: 16, fontSize: '0.78rem', color: '#444' }}>Envío gratis · Garantía 30 días · Devolución sin preguntas</p>
        </div>
      </section>
    </>
  )
}
