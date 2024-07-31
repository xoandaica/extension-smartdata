// const URL_BASE_SERVER = "https://powerdashboard.vn/"
const URL_BASE_SERVER = "http://localhost:8082/"
const URL_BASE_LOCAL = "http://localhost:8082/"

var token = "";
const DATA_COMMONS = [
    {
        key: "ShoppeShop",
        name: "Shopee Shop",
        typeInformations: [6],
        domains: ["banhang.shopee.vn", ".shopee.vn"],
        cookie: "",
        reports: [
            {
                value: 1,
                name: "Báo cáo tổng quan",
                storageName: "Shopee-Overview",
            },
            {
                value: 2,
                name: "Báo cáo hiệu quả sản phẩm",
                storageName: "Shopee-Product effectiveness",
            }
        ],
    },
    {
        key: "TikTokShop",
        name: "Tiktok Shop",
        typeInformations: [8],
        domains: ["seller-vn.tiktok.com",".tiktok.com"],
        cookie: "",
        userId: "",
        reports: [
            {
                value: 1,
                name: "Báo cáo tổng quan",
                storageName: "Tiktok-Overview",
                formatUrl: "",
            },
            {
                value: 2,
                name: "Báo cáo hiệu quả sản phẩm",
                storageName: "Tiktok-Product effectiveness",
                formatUrl: ""
            }
        ],
    },
    {
        key: "Lazada",
        name: "Lazada",
        typeInformations: [9],
        domains: [],
        cookie: "",
        reports: [
            {
                value: 1,
                name: "Báo cáo tổng quan",
                storageName: "Lazada-Overview",
                formatUrl: "",
            },
            {
                value: 2,
                name: "Báo cáo hiệu quả sản phẩm",
                storageName: "Lazada-Product effectiveness",
                formatUrl: ""
            }
        ],
    },
    {
        key: "ShopeeAds",
        name: "Shopee Ads",
        typeInformations: [10,13],
        domains: ["banhang.shopee.vn", ".shopee.vn"],
        cookie: "",
    },
    {
        key: "TiktokAds",
        name: "Tiktok Ads",
        typeInformations: [7,12],
        domains: ["banhang.shopee.vn", ".shopee.vn"],
        cookie: "",
    },
    {
        key: "Facebook",
        name: "Facebook",
        typeInformations: [4],
        domains: ["banhang.shopee.vn", ".shopee.vn"],
        cookie: "",
    },
    {
        key: "Pancake",
        name: "Pancake",
        typeInformations: [14],
        domains: ["banhang.shopee.vn", ".shopee.vn"],
        cookie: "",
    },
]