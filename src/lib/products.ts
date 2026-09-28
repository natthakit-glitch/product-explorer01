export type Product = { 

  id: string 

  name: string 

  price: number 

  description: string 

} 

 

const initialProducts: Product[] = [ 

  { 

    id: "p001", 

    name: "Mechanical Keyboard", 

    price: 2590, 

    description: "คีย์บอร์ด Mechanical สำหรับทำงานและเล่นเกม", 

  }, 

  { 

    id: "p002", 

    name: "Wireless Mouse", 
     price: 1290, 

    description: "เมาส์ไร้สาย น้ำหนักเบา", 

  }, 

  { 

    id: "p003", 

    name: "USB-C Hub", 

    price: 1890, 

    description: "USB-C Hub พร้อม HDMI และ Card Reader", 

  }, 

] 

 

declare global { 

  // eslint-disable-next-line no-var 

  var demoProducts: Product[] | undefined 

} 

 

const products = 

  globalThis.demoProducts ?? 

  structuredClone(initialProducts) 

 

if (process.env.NODE_ENV !== "production") { 

  globalThis.demoProducts = products 

} 

 

export function getProducts() { 

  return products 

} 

 

export function getProduct(id: string) { 

  return products.find((product) => product.id === id) 

} 

 

export function updateProduct( 

  id: string, 

  values: Pick<Product, "name" | "price" | "description">, 

) { 

  const product = getProduct(id) 

 

  if (!product) { 

    throw new Error("Product not found") 

  } 

 

  product.name = values.name 

  product.price = values.price 

  product.description = values.description 

} 

 

export function deleteProduct(id: string) { 

  const index = products.findIndex((product) => product.id === id) 

 

  if (index === -1) { 

    throw new Error("Product not found") 

  } 

 

  products.splice(index, 1) 

} 