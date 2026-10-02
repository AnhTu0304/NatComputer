const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class ProductModel {
  static async getAll({ category, search, specsFilter } = {}) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        let queryText = 'SELECT * FROM products';
        const params = [];
        const conditions = [];

        if (category) {
          const cleanCat = category.toLowerCase();
          const altCat = cleanCat.startsWith('cat_') ? cleanCat.replace('cat_', '') : `cat_${cleanCat}`;
          params.push(cleanCat, altCat);
          conditions.push(`(LOWER(category_id) = $${params.length - 1} OR LOWER(category_id) = $${params.length})`);
        }
        if (search) {
          params.push(`%${search}%`);
          conditions.push(`name ILIKE $${params.length}`);
        }
        if (specsFilter) {
          try {
            const filterObj = typeof specsFilter === 'string' ? JSON.parse(specsFilter) : specsFilter;
            params.push(JSON.stringify(filterObj));
            conditions.push(`specs_json @> $${params.length}::jsonb`);
          } catch (e) {
            console.warn('Lỗi parse specsFilter:', e.message);
          }
        }

        if (conditions.length > 0) {
          queryText += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await dbModule.query(queryText, params);
        return result.rows.map(r => {
          const parsedSpecs = typeof r.specs_json === 'string' ? JSON.parse(r.specs_json) : (r.specs_json || {});
          const gallery = Array.isArray(parsedSpecs?.gallery) ? parsedSpecs.gallery : [];
          return {
            id: r.id,
            name: r.name,
            category: r.category_id || 'gaming',
            price: parseFloat(r.price),
            originalPrice: parseFloat(r.original_price || r.price),
            stockQuantity: parseInt(r.stock_quantity || 10, 10),
            rating: parseFloat(r.rating || 5.0),
            reviewsCount: parseInt(r.reviews_count || 0, 10),
            badge: r.badge,
            image: r.image_url,
            images: [r.image_url, ...gallery],
            description: r.description || '',
            specs: parsedSpecs,
            updatedAt: r.updated_at
          };
        });
      } catch (err) {
        console.error('PostgreSQL products error:', err.message);
      }
    }

    const db = readDB();
    let items = db.products || [];

    if (category) {
      const cleanCat = category.toLowerCase();
      const altCat = cleanCat.startsWith('cat_') ? cleanCat.replace('cat_', '') : `cat_${cleanCat}`;
      items = items.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        return pCat === cleanCat || pCat === altCat;
      });
    }
    if (search) {
      items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    return items;
  }

  static async getById(id) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const result = await dbModule.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length > 0) {
          const r = result.rows[0];
          const parsedSpecs = typeof r.specs_json === 'string' ? JSON.parse(r.specs_json) : (r.specs_json || {});
          const gallery = Array.isArray(parsedSpecs?.gallery) ? parsedSpecs.gallery : [];
          return {
            id: r.id,
            name: r.name,
            category: r.category_id || 'gaming',
            price: parseFloat(r.price),
            originalPrice: parseFloat(r.original_price || r.price),
            stockQuantity: parseInt(r.stock_quantity || 10, 10),
            rating: parseFloat(r.rating || 5.0),
            reviewsCount: parseInt(r.reviews_count || 0, 10),
            badge: r.badge,
            image: r.image_url,
            images: [r.image_url, ...gallery],
            description: r.description || '',
            specs: parsedSpecs,
            updatedAt: r.updated_at
          };
        }
      } catch (err) {
        console.error('PostgreSQL product by id error:', err.message);
      }
    }

    const db = readDB();
    return (db.products || []).find(p => p.id === id) || null;
  }

  static async create(data) {
    const { id, name, category, price, originalPrice, badge, image, description, specs } = data;

    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          `INSERT INTO products (id, category_id, name, price, original_price, badge, image_url, description, specs_json)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [id, category, name, price, originalPrice || price, badge, image, description, JSON.stringify(specs || {})]
        );
      } catch (err) {
        console.error('PostgreSQL create product error:', err.message);
      }
    }

    const db = readDB();
    db.products = db.products || [];
    const newProduct = {
      id,
      name,
      category,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice || price),
      rating: 5.0,
      badge: badge || 'HOT',
      image,
      description: description || '',
      specs: specs || {}
    };
    db.products.unshift(newProduct);
    writeDB(db);
    return newProduct;
  }

  static async update(id, data) {
    const { name, category, price, originalPrice, badge, image, description, specs } = data;

    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          `UPDATE products 
           SET name = COALESCE($1, name),
               category_id = COALESCE($2, category_id),
               price = COALESCE($3, price),
               original_price = COALESCE($4, original_price),
               badge = COALESCE($5, badge),
               image_url = COALESCE($6, image_url),
               description = COALESCE($7, description),
               specs_json = COALESCE($8, specs_json)
           WHERE id = $9`,
          [name, category, price, originalPrice, badge, image, description, specs ? JSON.stringify(specs) : null, id]
        );
      } catch (err) {
        console.error('PostgreSQL update product error:', err.message);
      }
    }

    const db = readDB();
    db.products = db.products || [];
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      db.products[index] = {
        ...db.products[index],
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && { originalPrice: parseFloat(originalPrice) }),
        ...(badge !== undefined && { badge }),
        ...(image !== undefined && { image }),
        ...(description !== undefined && { description }),
        ...(specs !== undefined && { specs })
      };
      writeDB(db);
      return db.products[index];
    }
    return null;
  }

  static async delete(id) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query('DELETE FROM products WHERE id = $1', [id]);
      } catch (err) {
        console.error('PostgreSQL delete product error:', err.message);
      }
    }

    const db = readDB();
    db.products = (db.products || []).filter(p => p.id !== id);
    writeDB(db);
    return true;
  }

  static async getCategories() {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const result = await dbModule.query('SELECT * FROM categories ORDER BY id ASC');
        if (result.rows.length > 0) {
          return result.rows;
        }
      } catch (err) {
        console.error('PostgreSQL categories error:', err.message);
      }
    }

    const db = readDB();
    return db.categories || [];
  }

  static async createCategory(cat) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          'INSERT INTO categories (id, name, slug, description) VALUES ($1, $2, $3, $4)',
          [cat.id, cat.name, cat.slug || cat.id, cat.description || '']
        );
      } catch (err) {
        console.error('PostgreSQL create category error:', err.message);
      }
    }

    const db = readDB();
    db.categories = db.categories || [];
    db.categories.push(cat);
    writeDB(db);
    return cat;
  }

  static async deleteCategory(id) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query('DELETE FROM categories WHERE id = $1', [id]);
      } catch (err) {
        console.error('PostgreSQL delete category error:', err.message);
      }
    }

    const db = readDB();
    db.categories = (db.categories || []).filter(c => c.id !== id);
    writeDB(db);
    return true;
  }

  static async getBanners() {
    const db = readDB();
    return db.banners || [];
  }

  static async createBanner(banner) {
    const db = readDB();
    db.banners = db.banners || [];
    db.banners.push(banner);
    writeDB(db);
    return banner;
  }

  static async deleteBanner(id) {
    const db = readDB();
    db.banners = (db.banners || []).filter(b => b.id !== id);
    writeDB(db);
    return true;
  }
}

module.exports = ProductModel;
