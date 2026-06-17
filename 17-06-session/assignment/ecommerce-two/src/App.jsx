import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import AddProductForm from "./components/AddProductForm";
import CartDrawer from "./components/CartDrawer"; 
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "./productsMock";
import { useState } from "react";

function App() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [view, setView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleAddProduct = (data) => {
    const newProduct = {
      id: Date.now(),
      title: data.title,
      price: Number(data.price),
      category: data.category,
      rating: 5.0,
      ratingCount: 1,
      image: data.image,
      description: data.description,
    };
    setProducts([newProduct, ...products]);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "Tümü" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <>
      <Header
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearchSubmit={handleSearchSubmit}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        setView={setView}
        cart={cart}
        onCartOpen={() => setIsCartOpen(true)}
      />
      <Navbar
        categories={MOCK_CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setView={setView}
      />

      {view === "home" ? (
        <main className="main-layout">
          <Sidebar
            categories={MOCK_CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="content-area">
            <div className="content-header">
              <h1 className="page-title">
                {selectedCategory} {searchQuery && `> "${searchQuery}"`} Ürünler
              </h1>
              <span className="text-sm">
                Toplam {filteredProducts.length} Ürün
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-red-500">
                  Aradığınız kriterlere uygun ürün bulunamadı.
                </p>
              </div>
            ) : (
              <ProductGrid 
                products={filteredProducts} 
                onAddToCart={handleAddToCart} 
              />
            )}
          </div>
        </main>
      ) : (
        <AddProductForm
          categories={MOCK_CATEGORIES}
          setView={setView}
          onAddProduct={handleAddProduct}
        />
      )}
      <Footer />

      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </>
  );
}

export default App;