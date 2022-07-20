"use strict";

const { default: axios } = require("axios");
const {
  map,
  forEach,
  find,
  isString,
  take,
  head,
  get,
  min,
  uniq,
} = require("lodash");

const useCustomDate = false;
const realInsert = true;
const realUpdate = true;

const demo = [
  {
    code: "BP_157910",
    name: "蒸餾水280毫升",
    sizeUnit: "0.28L",
    defaultVariantCode: "157910",
    description:
      "屈臣氏蒸餾水的製作過程採用先進的蒸餾技術，包括多層過濾，再以攝氏105°C高温蒸餾，在過濾及蒸餾過程中，所有雜質及細菌均被消除，滴滴清純。",
    price: {
      value: 2.6,
      quantity: 2,
    },
    category: ["食品及飲品/飲品", "即沖飲品/水/蒸餾水"],
    image:
      "/medias/Distilled-Water-280ml-BP-157910.jpg?context=bWFzdGVyfHBuc2hrL2ltYWdlc3wzNjUzN3xpbWFnZS9qcGVnfGhhMy9oZGUvOTMzNjM5ODU3NzY5NC9EaXN0aWxsZWQgV2F0ZXIgMjgwbWwtQlBfMTU3OTEwLmpwZ3wzNjkwNmExZDVjNjRhNmU4ODk4YWJjYzFkODRkZmVhZjY1OGJkMGIwOTUwNTRiMGQ0M2JlMzE0NTM2NzI5YzYx",
    brand: {
      name: "屈臣氏",
      code: "147039",
    },
    url: "/蒸餾水280毫升/p/BP_157910",
  },
  {
    code: "BP_152058",
    name: "蒸餾水430毫升",
    sizeUnit: "430ML",
    defaultVariantCode: "152058",
    description:
      "屈臣氏蒸餾水的製作過程採用先進的蒸餾技術，包括多層過濾，再以攝氏105°C高温蒸餾，在過濾及蒸餾過程中，所有雜質及細菌均被消除，滴滴清純。",
    price: {
      value: 3.9,
      quantity: 3,
    },
    category: ["食品及飲品/飲品", "即沖飲品/水/蒸餾水"],
    image:
      "/medias/DISTILLED-WATER-BP-152058.jpg?context=bWFzdGVyfHBuc2hrL2ltYWdlc3w5NjY3NXxpbWFnZS9qcGVnfGgxYi9oYWIvOTMzNjc2NzY3NjQ0Ni9ESVNUSUxMRUQgV0FURVItQlBfMTUyMDU4LmpwZ3wyOGI1ZDgxMWRjZmRhYTZlNTEwZDU1ZTNjNjQyMGJiYTllMzljZTkyODA0YTk2OTJlMzhiYjk2NWJiZjI0OGM0",
    brand: {
      name: "屈臣氏",
      code: "147039",
    },
    url: "/蒸餾水430毫升/p/BP_152058",
  },
];

const customDate = () => {
  // if (true) return "2022-07-19";
  var d = new Date();
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  var nd = new Date(utc + 3600000 * 8);
  const str = nd.toLocaleString();
  return `${str.substr(6, 4)}-${str.substr(3, 2)}-${str.substr(0, 2)}`;
};
let __DATE__ = customDate();

const fetchDate = async () => {
  if (!useCustomDate) {
    const { data } = await axios.get(
      "http://worldtimeapi.org/api/timezone/Asia/Hong_Kong"
    );
    if (data?.datetime && isString(data?.datetime)) {
      __DATE__ = data.datetime.substr(0, 10);
    }
  }
};

const db = {
  find: {
    products: async (products) => {
      const where = map(products, (p) => {
        return {
          name: p.name,
        };
      });

      const dbResult = await strapi.db.query("api::product.product").findMany({
        where: {
          $or: where,
        },
      });

      return dbResult;
    },
    brands: async (brands) => {
      const where = map(brands, (b) => {
        return {
          code: b.code,
        };
      });

      const dbResult = await strapi.db.query("api::brand.brand").findMany({
        where: {
          $or: where,
        },
      });

      return dbResult;
    },
  },
  insert: {
    products: async (products) => {
      try {
        const requests = await map(products, async (p) => {
          return db.insert.product(p);
        });
        return Promise.all(requests);
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    product: async (product) => {
      try {
        const dbResult = await strapi.db.query("api::product.product").create({
          data: {
            code: product?.code || "",
            name: product?.name || "",
            sizeUnit: product?.sizeUnit || "",
            defaultVariantCode: product?.defaultVariantCode || "",
            description: product?.description || "",
            image: product?.image || "",
            url: product?.url || "",
            price: product?.price || [],
            brand: product?.brand || [],
            lowestPriceOf30Days: false,
            lowestPriceOf7Days: false,
            lowerPriceThanLastDay: false,
          },
        });
        return dbResult;
      } catch (err) {
        console.log({ err });
        return {};
      }
    },
    brands: async (brands) => {
      try {
        const requests = await map(brands, async (b) => {
          return db.insert.brand(b);
        });
        return Promise.all(requests);
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    brand: async (brand) => {
      try {
        const dbResult = await strapi.db.query("api::brand.brand").create({
          data: {
            code: brand?.code || "",
            name: brand?.name || "",
          },
        });
        return dbResult;
      } catch (err) {
        console.log({ err });
        return {};
      }
    },
  },
  update: {
    products: async (products) => {
      try {
        const requests = await map(products, async (p) => {
          return db.update.product(p);
        });
        return Promise.all(requests);
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    product: async (product) => {
      if (!product?.code) return {};
      try {
        const dbResult = await strapi.db.query("api::product.product").update({
          where: {
            code: product.code,
          },
          data: {
            name: product?.name || "",
            sizeUnit: product?.sizeUnit || "",
            defaultVariantCode: product?.defaultVariantCode || "",
            description: product?.description || "",
            image: product?.image || "",
            url: product?.url || "",
            price: product?.price || [],
            brand: product?.brand || [],
            lowestPriceOf30Days: product?.lowestPriceOf30Days || false,
            lowestPriceOf7Days: product?.lowestPriceOf7Days || false,
            lowerPriceThanLastDay: product?.lowerPriceThanLastDay || false,
          },
        });
        return dbResult;
      } catch (err) {
        console.log({ err });
        return {};
      }
    },
  },
};

const fetchBrands = async (brands) => {
  try {
    const dbRecord = await db.find.brands(brands);

    const brandToInsert = [];

    forEach(brands, (b) => {
      if (!find(dbRecord, { code: b.code })) {
        brandToInsert.push(b);
      }
    });

    const newRecord = await db.insert.brands(brandToInsert);

    return [...dbRecord, ...newRecord];
  } catch (err) {
    console.log({ err });
    return [];
  }
};

const buildBrands = async (products) => {
  try {
    const allBrands = map(products, (p) => {
      return p?.brand;
    });

    const uniqBrandNames = uniq(map(allBrands, "name"));

    const uniqBrands = map(uniqBrandNames, (name) => {
      return find(allBrands, { name });
    });

    const brands = await fetchBrands(uniqBrands);

    return brands;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const defineAction = async (products) => {
  const action = {
    update: [],
    insert: [],
  };
  try {
    const dbRecord = await db.find.products(products);

    const productBrands = await buildBrands(products);

    const request = await map(products, (p) => {
      return {
        ...p,
        brand: get(find(productBrands, { code: p?.brand?.code }), "id"),
      };
    });

    const fullProducts = await Promise.all(request);

    forEach(fullProducts, (p) => {
      if (find(dbRecord, { code: p.code })) {
        action.update.push(p);
      } else {
        action.insert.push(p);
      }
    });

    const updateRequest = await map(action.update, async (p) => {
      return actionBuilder.update({
        product: p,
        record: find(dbRecord, { code: p.code }),
      });
    });
    const insertRequest = await map(action.insert, async (p) => {
      return actionBuilder.insert(p);
    });

    return {
      update: await Promise.all(updateRequest),
      insert: await Promise.all(insertRequest),
    };
  } catch (err) {
    console.log(err);
    return action;
  }
};

const priceBuilder = (price) => {
  try {
    if (price?.value && price?.quantity) {
      return {
        date: __DATE__,
        ...price,
      };
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

const discountBuilder = (price, record) => {
  try {
    const priceRecord = get(record, "price", []);
    const record7Days = map(take(priceRecord, 6), "value");
    const record30Days = map(take(priceRecord, 29), "value");
    const recordLastDay = get(head(priceRecord), "value");
    const today = get(price, "value");
    return {
      lowestPriceOf30Days: min(record30Days) > today,
      lowestPriceOf7Days: min(record7Days) > today,
      lowerPriceThanLastDay: recordLastDay > today,
    };
  } catch (err) {
    console.log({ err });
    return {};
  }
};

const actionBuilder = {
  insert: async (product) => {
    try {
      return {
        ...product,
        price: [priceBuilder(product.price)],
      };
    } catch (err) {
      console.log({ err });
      return [];
    }
  },
  update: async ({ product, record }) => {
    try {
      const price = priceBuilder(product?.price);
      const prices = [price, ...record?.price];

      if (price) {
        return {
          ...product,
          price: prices,
          ...discountBuilder(price, record),
        };
      } else {
        return null;
      }
    } catch (err) {
      console.log({ err });
      return [];
    }
  },
};

const executeAction = {
  insert: async (products) => {
    try {
      if (realInsert) {
        return db.insert.products(products);
      } else {
        return products;
      }
    } catch (err) {
      console.log({ err });
      return [];
    }
  },
  update: async (products) => {
    try {
      if (realUpdate) {
        return db.update.products(products);
      } else {
        return products;
      }
    } catch (err) {
      console.log({ err });
      return [];
    }
  },
};

module.exports = {
  cronProducts: async (id) => {
    try {
      await fetchDate();
      const data = await strapi
        .service("api::fetch-products.fetch-products")
        .fetchProducts(id);
      // const data = demo;

      const actions = await defineAction(data);

      const insertResult = await executeAction.insert(actions.insert);
      const updateResult = await executeAction.update(actions.update);

      return { result: { insertResult, updateResult } };
    } catch (err) {
      console.log({ err });
      return [];
    }
  },
};
