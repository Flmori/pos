'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil ID kategori secara dinamis dari tabel categories
    const categories = await queryInterface.sequelize.query(
      `SELECT id_kategori, nama_kategori FROM categories;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const getCategoryId = (categoryName) => {
      const category = categories.find(cat => cat.nama_kategori === categoryName);
      return category ? category.id_kategori : null;
    };

    await queryInterface.bulkInsert('products', [
      // Kategori: Kopi Klasik
      {
        id_barang: 'KOFIK-001',
        nama_barang: 'Espresso',
        deskripsi: 'Ekstraksi kopi murni, dasar kopi.',
        harga_beli: 8000.00,
        harga_jual: 20000.00,
        stok: 100,
        id_kategori: getCategoryId('Kopi Klasik'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'KOFIK-002',
        nama_barang: 'Americano',
        deskripsi: 'Espresso dengan air panas.',
        harga_beli: 9000.00,
        harga_jual: 25000.00,
        stok: 100,
        id_kategori: getCategoryId('Kopi Klasik'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'KOFIK-003',
        nama_barang: 'Latte',
        deskripsi: 'Espresso dengan susu steamed dan busa tipis.',
        harga_beli: 12000.00,
        harga_jual: 30000.00,
        stok: 100,
        id_kategori: getCategoryId('Kopi Klasik'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'KOFIK-004',
        nama_barang: 'Cappuccino',
        deskripsi: 'Espresso dengan susu steamed dan busa tebal.',
        harga_beli: 12000.00,
        harga_jual: 30000.00,
        stok: 100,
        id_kategori: getCategoryId('Kopi Klasik'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'KOFIK-005',
        nama_barang: 'Kopi Susu Gula Aren',
        deskripsi: 'Kopi susu kekinian dengan gula aren.',
        harga_beli: 10000.00,
        harga_jual: 28000.00,
        stok: 100,
        id_kategori: getCategoryId('Kopi Klasik'),
        created_at: new Date(),
        updated_at: new Date()
      },

      // Kategori: Kopi Signature
      {
        id_barang: 'SIGNA-001',
        nama_barang: 'Salted Caramel Latte',
        deskripsi: 'Latte dengan sirup karamel asin.',
        harga_beli: 15000.00,
        harga_jual: 35000.00,
        stok: 80,
        id_kategori: getCategoryId('Kopi Signature'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'SIGNA-002',
        nama_barang: 'Hazelnut Macchiato',
        deskripsi: 'Espresso macchiato dengan sirup hazelnut.',
        harga_beli: 14000.00,
        harga_jual: 34000.00,
        stok: 80,
        id_kategori: getCategoryId('Kopi Signature'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'SIGNA-003',
        nama_barang: 'Es Kopi Kelapa',
        deskripsi: 'Kopi dengan air dan daging kelapa muda.',
        harga_beli: 18000.00,
        harga_jual: 38000.00,
        stok: 80,
        id_kategori: getCategoryId('Kopi Signature'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'SIGNA-004',
        nama_barang: 'Mocha Mint Iced Coffee',
        deskripsi: 'Kopi dingin dengan cokelat dan mint.',
        harga_beli: 16000.00,
        harga_jual: 36000.00,
        stok: 80,
        id_kategori: getCategoryId('Kopi Signature'),
        created_at: new Date(),
        updated_at: new Date()
      },

      // Kategori: Manual Brew
      {
        id_barang: 'MANUB-001',
        nama_barang: 'V60 (Biji Lokal)',
        deskripsi: 'Seduhan V60 dengan biji kopi lokal pilihan.',
        harga_beli: 15000.00,
        harga_jual: 35000.00,
        stok: 50,
        id_kategori: getCategoryId('Manual Brew'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'MANUB-002',
        nama_barang: 'V60 (Biji Impor)',
        deskripsi: 'Seduhan V60 dengan biji kopi impor premium.',
        harga_beli: 25000.00,
        harga_jual: 50000.00,
        stok: 30,
        id_kategori: getCategoryId('Manual Brew'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'MANUB-003',
        nama_barang: 'Aeropress',
        deskripsi: 'Seduhan Aeropress dengan karakter body tebal.',
        harga_beli: 15000.00,
        harga_jual: 35000.00,
        stok: 50,
        id_kategori: getCategoryId('Manual Brew'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'MANUB-004',
        nama_barang: 'French Press',
        deskripsi: 'Seduhan French Press untuk cita rasa bold.',
        harga_beli: 14000.00,
        harga_jual: 32000.00,
        stok: 50,
        id_kategori: getCategoryId('Manual Brew'),
        created_at: new Date(),
        updated_at: new Date()
      },

      // Kategori: Non-Kopi
      {
        id_barang: 'NONKO-001',
        nama_barang: 'Matcha Latte',
        deskripsi: 'Minuman matcha bubuk premium dengan susu.',
        harga_beli: 13000.00,
        harga_jual: 32000.00,
        stok: 90,
        id_kategori: getCategoryId('Non-Kopi'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'NONKO-002',
        nama_barang: 'Cokelat Panas/Dingin',
        deskripsi: 'Minuman cokelat kaya rasa.',
        harga_beli: 11000.00,
        harga_jual: 28000.00,
        stok: 90,
        id_kategori: getCategoryId('Non-Kopi'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'NONKO-003',
        nama_barang: 'Lemon Tea',
        deskripsi: 'Teh hitam dengan perasan lemon segar.',
        harga_beli: 10000.00,
        harga_jual: 25000.00,
        stok: 90,
        id_kategori: getCategoryId('Non-Kopi'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'NONKO-004',
        nama_barang: 'Teh Tarik',
        deskripsi: 'Teh susu khas Malaysia yang ditarik.',
        harga_beli: 10000.00,
        harga_jual: 25000.00,
        stok: 90,
        id_kategori: getCategoryId('Non-Kopi'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'NONKO-005',
        nama_barang: 'Jus Alpukat',
        deskripsi: 'Jus alpukat segar dengan susu dan cokelat.',
        harga_beli: 15000.00,
        harga_jual: 30000.00,
        stok: 70,
        id_kategori: getCategoryId('Non-Kopi'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'NONKO-006',
        nama_barang: 'Air Mineral (600ml)',
        deskripsi: 'Air mineral kemasan botol.',
        harga_beli: 4000.00,
        harga_jual: 10000.00,
        stok: 200,
        id_kategori: getCategoryId('Non-Kopi'),
        created_at: new Date(),
        updated_at: new Date()
      },

      // Kategori: Pastry & Roti
      {
        id_barang: 'PASRO-001',
        nama_barang: 'Croissant Mentega',
        deskripsi: 'Croissant klasik dengan aroma mentega.',
        harga_beli: 8000.00,
        harga_jual: 18000.00,
        stok: 60,
        id_kategori: getCategoryId('Pastry & Roti'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'PASRO-002',
        nama_barang: 'Pain au Chocolat',
        deskripsi: 'Croissant dengan isian cokelat.',
        harga_beli: 10000.00,
        harga_jual: 22000.00,
        stok: 60,
        id_kategori: getCategoryId('Pastry & Roti'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'PASRO-003',
        nama_barang: 'Donat Glaze Klasik',
        deskripsi: 'Donat empuk dengan lapisan gula.',
        harga_beli: 7000.00,
        harga_jual: 15000.00,
        stok: 80,
        id_kategori: getCategoryId('Pastry & Roti'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'PASRO-004',
        nama_barang: 'Cinnamon Roll',
        deskripsi: 'Roti gulung kayu manis dengan cream cheese.',
        harga_beli: 12000.00,
        harga_jual: 28000.00,
        stok: 50,
        id_kategori: getCategoryId('Pastry & Roti'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'PASRO-005',
        nama_barang: 'Roti Sosis Keju',
        deskripsi: 'Roti dengan potongan sosis dan taburan keju.',
        harga_beli: 10000.00,
        harga_jual: 22000.00,
        stok: 50,
        id_kategori: getCategoryId('Pastry & Roti'),
        created_at: new Date(),
        updated_at: new Date()
      },

      // Kategori: Kudapan Berat
      {
        id_barang: 'KUBRT-001',
        nama_barang: 'Kentang Goreng',
        deskripsi: 'Kentang goreng renyah dengan saus.',
        harga_beli: 12000.00,
        harga_jual: 25000.00,
        stok: 70,
        id_kategori: getCategoryId('Kudapan Berat'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'KUBRT-002',
        nama_barang: 'Chicken Popcorn',
        deskripsi: 'Potongan ayam tanpa tulang renyah.',
        harga_beli: 15000.00,
        harga_jual: 30000.00,
        stok: 60,
        id_kategori: getCategoryId('Kudapan Berat'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'KUBRT-003',
        nama_barang: 'Fried Mushroom',
        deskripsi: 'Jamur krispi goreng.',
        harga_beli: 14000.00,
        harga_jual: 28000.00,
        stok: 60,
        id_kategori: getCategoryId('Kudapan Berat'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'KUBRT-004',
        nama_barang: 'Nasi Ayam Sambal Matah',
        deskripsi: 'Nasi dengan ayam goreng dan sambal matah.',
        harga_beli: 25000.00,
        harga_jual: 45000.00,
        stok: 40,
        id_kategori: getCategoryId('Kudapan Berat'),
        created_at: new Date(),
        updated_at: new Date()
      },

      // Kategori: Dessert
      {
        id_barang: 'DESRT-001',
        nama_barang: 'Brownies Fudge',
        deskripsi: 'Kue cokelat padat dengan tekstur fudgy.',
        harga_beli: 15000.00,
        harga_jual: 30000.00,
        stok: 50,
        id_kategori: getCategoryId('Dessert'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'DESRT-002',
        nama_barang: 'Red Velvet Cake',
        deskripsi: 'Potongan kue red velvet lembut.',
        harga_beli: 20000.00,
        harga_jual: 40000.00,
        stok: 40,
        id_kategori: getCategoryId('Dessert'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'DESRT-003',
        nama_barang: 'Tiramisu',
        deskripsi: 'Dessert Italia dengan kopi dan mascarpone.',
        harga_beli: 22000.00,
        harga_jual: 45000.00,
        stok: 40,
        id_kategori: getCategoryId('Dessert'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_barang: 'DESRT-004',
        nama_barang: 'Es Krim Vanilla',
        deskripsi: 'Satu scoop es krim rasa vanilla.',
        harga_beli: 8000.00,
        harga_jual: 18000.00,
        stok: 80,
        id_kategori: getCategoryId('Dessert'),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Additional product line added for testing delete feature
      {
        id_barang: 'TEST-001',
        nama_barang: 'Test Product Delete',
        deskripsi: 'Product added for testing delete feature.',
        harga_beli: 5000.00,
        harga_jual: 10000.00,
        stok: 10,
        id_kategori: getCategoryId('Kopi Klasik'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
