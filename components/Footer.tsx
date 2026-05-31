export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', color: '#555', padding: '32px 24px', textAlign: 'center', fontSize: '0.82rem' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <p>© {new Date().getFullYear()} OCShop · Garantía 30 días · Soporte 24/7</p>
      </div>
    </footer>
  )
}
