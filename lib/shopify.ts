const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const API_URL = `https://${DOMAIN}/api/2024-01/graphql.json`

async function shopifyFetch(query, variables) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

const PF = `id title handle description descriptionHtml featuredImage{url altText width height} images(first:5){nodes{url altText width height}} priceRange{minVariantPrice{amount currencyCode}} compareAtPriceRange{minVariantPrice{amount currencyCode}} options{name values} variants(first:50){nodes{id title availableForSale price{amount currencyCode} compareAtPrice{amount currencyCode} selectedOptions{name value}}}`
const CF = `id checkoutUrl totalQuantity cost{totalAmount{amount currencyCode}subtotalAmount{amount currencyCode}} lines(first:50){nodes{id quantity merchandise{...on ProductVariant{id title price{amount currencyCode} image{url altText width height} product{title handle}}}}}`

export async function getProducts(first=20) {
  const d = await shopifyFetch(`{products(first:${first},sortKey:BEST_SELLING){nodes{${PF}}}}`)
  return d.products.nodes
}

export async function getProduct(handle) {
  const d = await shopifyFetch(`query($h:String!){productByHandle(handle:$h){${PF}}}`, {h: handle})
  return d.productByHandle
}

export async function createCart() {
  const d = await shopifyFetch(`mutation{cartCreate{cart{${CF}}}}`)
  return d.cartCreate.cart
}

export async function addToCart(cartId, variantId, quantity=1) {
  const d = await shopifyFetch(`mutation($cartId:ID!,$lines:[CartLineInput!]!){cartLinesAdd(cartId:$cartId,lines:$lines){cart{${CF}}}}`, {cartId, lines:[{merchandiseId:variantId,quantity}]})
  return d.cartLinesAdd.cart
}

export async function getCart(cartId) {
  const d = await shopifyFetch(`query($id:ID!){cart(id:$id){${CF}}}`, {id:cartId})
  return d.cart
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US',{style:'currency',currency:price.currencyCode}).format(parseFloat(price.amount))
}
