if (!window.indexedDB) {
console.log("Your browser doesn't support IndexedDB.");
} else {
console.log("IndexedDB is supported in your browser.");
}

async function loadDatabase() {
const db = await idb.openDB("tailwind_store", 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
    if (!db.objectStoreNames.contains("products")) {
        const productsStore = db.createObjectStore("products", {
        keyPath: "id",
        autoIncrement: true,
        });
        // Create an index on product name for efficient searching
        productsStore.createIndex("name", "name", { unique: false });
    }
    if (!db.objectStoreNames.contains("sales")) {
        const salesStore = db.createObjectStore("sales", {
        keyPath: "id",
        autoIncrement: true,
        });
        // Create an index on sale date for efficient searching
        salesStore.createIndex("date", "date", { unique: false });
    }
    },
});

return {
    db,
    getProducts: async () => await db.getAll("products"),
    addProduct: async (product) => await db.add("products", product),
    editProduct: async (product) =>
    await db.put("products", product.id, product),
    deleteProduct: async (productId) => await db.delete("products", productId),

    getSales: async () => await db.getAll("sales"),
    addSale: async (sale) => await db.add("sales", sale),
};
}

function initApp() {
const app = {
    db: null,
    time: null,
    firstTime: localStorage.getItem("first_time") === null,
    activeMenu: 'pos',
    loadingSampleData: false,
    moneys: [2000, 5000, 10000, 20000, 50000, 100000],
    products: [],
    keyword: "",
    cart: [],
    cash: 0,
    change: 0,
    isShowModalReceipt: false,
    receiptNo: null,
    receiptDate: null,
    async initDatabase() {
    this.db = await loadDatabase();
    this.loadProducts();
    },
    async loadProducts() {
    this.products = await this.db.getProducts();
    console.log("products loaded", this.products);
    },
    // Other methods for managing products, cart, and sales...

    // Method to save a sale to the database
    async saveSaleToDatabase(saleData) {
    try {
        await this.db.addSale(saleData);
        console.log("Sale data saved to database:", saleData);
    } catch (error) {
        console.error("Error saving sale data to database:", error);
    }
    },
};

// Check for IndexedDB support
if (!window.indexedDB) {
    console.log("Your browser doesn't support IndexedDB.");
} else {
    console.log("IndexedDB is supported in your browser.");
}

return app;
}
