const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const API_URL = `https://${DOMAIN}/api/2024-01/graphql.json`
async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':TOKEN}, body:JSON.stringify({query,variables}), next:{revalidate:60} })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}
export interface ShopifyImage { url:string; altText:string|null; width:number; height:number }
export interface ShopifyPrice { amount:string; currencyCode:string }
export interface ShopifyVariant { id:string; title:string; availableForSale:boolean; price:ShopifyPrice; compareAtPrice:ShopifyPrice|null; selectedOptions:{name:string;value:string}[] }
export interface ShopifyProduct { id:string; title:string; handle:string; description:string; descriptionHtml:string; featuredImage:ShopifyImage|null; images:{nodes:ShopifyImage[]}; priceRange:{minVariantPrice:ShopifyPrice}; compareAtPriceRange:{minVariantPrice:ShopifyPrice}; variants:{nodes:ShopifyVariant[]}; options:{name:string;values:string[]}[] }
export interface ShopifyCart { id:string; checkoutUrl:string; totalQuantity:number; cost:{totalAmount:ShopifyPrice;subtotalAmount:ShopifyPrice}; lines:{nodes:{id:string;quantity:number;merchandise:{id:string;title:string;product:{title:string;handle:string};image:ShopifyImage|null;price:ShopifyPrice}}[]} }
const PF = `id title handle description descriptionHtml featuredImage{url altText width height} images(first:5){nodes{url altText width height}} priceRange{minVariantPrice{amount currencyCode}} compareAtPriceRange{minVariantPrice{amount currencyCode}} options{name values} variants(first:50){nodes{id title availableForSale price{amount currencyCode} compareAtPrice{amount currencyCode} selectedOptions{name value}}}`
export async function getProducts(first=20){const d=await shopifyFetch<any>(`{products(first:${first},sortKey:BEST_SELLING){nodes{${PF}}}`);return d.products.nodes}
export async function getProduct(handle:string){const d=await shopifyFetch<any>(`query($handle:String!){productByHandle(handle:$Handle){${PF}}}`,{handle});return d.productByHandle}
const CF=`id checkoutUrl totalQuantity cost{totalAmount{amount currencyCode}subtotalAmount{amount currencyCode}} lines(first:50){nodes{id quantity merchandise{...on ProductVariant{id title price{amount currencyCode} image{url altText width height} product{title handle}}}}}`
export async function createCart(){const d=await shopifyFetch<any>(`mutation{cartCreate{cart{${CF}}}}`);return d.cartCreate.cart}
export async function addToCart(cartId:string,variantId:string,quantity=1){const d=await shopifyFetch<any>(`mutation($cartId:ID!+$lines:[CartLineInput!]!){cartLinesAdd(cartId:$cartId,lines:$lines){cart{${CF}}}}`,{cartId,lines:[{merchandiseId:variantId,quantity}]});return d.cartLinesAdd.cart}
export async function getCart(cartId:string){const d=await shopifyFetch<any>(`query($id:ID!){cart(id:$id){${CF}}}`,{id:cartId});return d.cart}
export function formatPrice(price:ShopifyPrice){return new Intl.NumberFormat('en-US',{style:'currency',currency:price.currencyCode}).format(parseFloat(price.amount))}
