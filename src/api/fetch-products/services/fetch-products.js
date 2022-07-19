"use strict";

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const axiosRetry = require("axios-retry");
const { map, isArray, isObject, split, get, head } = require("lodash");

axiosRetry(axios, {
  retries: 3,
  retryCondition: (error) => {
    const { response } = error || {};
    console.log(response?.status);
    return response?.status === 400;
  },
});
const token = `Xh6bKqZ5aLNZPLydUPA_1XkdTaM`;

const axiosConfig = {
  headers: {
    "User-Agent": "PNSHK/6.10.2 (iOS/15.1)",
    "Accept-Language": "zt",
    "x-device-id": uuidv4(),
    env: "PROD",
    Authorization: `Bearer ${token}`,
  },
};
/**
 * fetch-products service.
 */

const url =
  "https://www10.parknshop.com/api/v2/pnshk/products/search?pageSize=10000&curr=HKD&fields=FULL&sort=bestSeller&lang=zh_hk&query=%3AbestSeller%3Acategory%3A";

const fetchData = async (id, page = 0) => {
  try {
    const { data } = await axios.get(
      `${url}${id}&currentPage=${page}`,
      axiosConfig
    );
    return dataBuilder(data);
  } catch {
    return null;
  }
};

const dataBuilder = (data) => {
  const { products, pagination } = data;

  if (isArray(products) && isObject(pagination)) {
    return {
      totalPages: parseInt(pagination.totalPages),
      currentPage: parseInt(pagination.currentPage),
      products: map(products, productBuilder),
    };
  }
  return null;
};

const productBuilder = (product) => {
  return {
    code: product.code,
    name: product.name,
    sizeUnit: product.contentSizeUnit,
    defaultVariantCode: product.defaultVariantCode,
    description: product.description,
    price: priceBuilder({
      price: product?.price || null,
      markdownPrice: product?.elabMarkDownMemPrice || null,
      discount: get(product, "elabFirstMultiBuyDatas", []),
    }),
    category: split(product?.gtmCategoryPath || "", "、"),
    image: get(product, "images[0].url", ""),
    brand: {
      name: get(product, "masterBrand.name"),
      code: get(product, "masterBrand.code"),
    },
    url: product.url,
  };
};

const priceBuilder = ({ price, markdownPrice, discount }) => {
  if (isObject(head(discount))) {
    const _discount = head(discount);
    return {
      value: _discount.avgDiscountedPrice.value,
      quantity: _discount.quantity,
    };
  }
  if (isObject(markdownPrice)) {
    return {
      value: markdownPrice.value,
      quantity: 1,
    };
  }
  if (isObject(price)) {
    return {
      value: price.value,
      quantity: 1,
    };
  }
};

const fetchById = async (id, page = 0, data = null) => {
  try {
    const _data = await fetchData(id, page);

    if (_data) {
      const { totalPages, currentPage } = _data;
      if (currentPage + 1 < totalPages) {
        return fetchById(id, page + 1, _data);
      } else {
        const products = [
          ...(data?.products || []),
          ...(_data?.products || []),
        ];
        return products;
      }
    }
    return [];
  } catch {
    return [];
  }
};

module.exports = {
  fetchProducts: async (id) => {
    const data = await fetchById(id);
    return data;
  },
};
