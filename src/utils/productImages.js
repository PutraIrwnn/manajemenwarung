/**
 * Mapping gambar produk berdasarkan ID.
 * Untuk produk baru yang ditambahkan via CRUD, gunakan gambar default per kategori.
 */
const productImageMap = {
  'PRD-001': '/images/products/indomie.png',
  'PRD-002': '/images/products/minyak-goreng.png',
  'PRD-003': '/images/products/rokok-kretek.png',
  'PRD-004': '/images/products/beras.png',
  'PRD-005': '/images/products/gula-pasir.png',
  'PRD-006': '/images/products/kopi.png',
  'PRD-007': '/images/products/teh-pucuk.png',
  'PRD-008': '/images/products/telur-ayam.png',
  'PRD-009': '/images/products/aqua.png',
};

/**
 * Dapatkan URL gambar untuk produk.
 * Prioritas: mapping ID → gambar default.
 */
export function getProductImage(product) {
  if (product?.imageUrl) {
    return product.imageUrl;
  }
  if (productImageMap[product.id]) {
    return productImageMap[product.id];
  }
  return '/images/products/default.png';
}
