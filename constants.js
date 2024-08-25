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
        localStorage: {},
        sessionStorage: {},
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
            },
            {
                value: 3,
                name: "Báo cáo chuyển đổi",
                storageName: "Shopee-Seller Conversion Report",
            }
        ],
    },
    {
        key: "TikTokShop",
        name: "Tiktok Shop",
        typeInformations: [8],
        domains: ["seller-vn.tiktok.com",".tiktok.com"],
        cookie: "",
        localStorage: {},
        sessionStorage: {},
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
            },
            {
                value: 3,
                name: "Báo cáo chuyển đổi",
                storageName: "Tiktok-Export Orders",
                formatUrl: ""
            }
        ],
    },
    {
        key: "Lazada",
        name: "Lazada",
        typeInformations: [9],
        domains: ["sellercenter.lazada.vn",".lazada.vn"],
        cookie: "",
        localStorage: {},
        sessionStorage: {},
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
    // {
    //     key: "ShopeeAds",
    //     name: "Shopee Ads",
    //     typeInformations: [10,13],
    //     domains: ["banhang.shopee.vn", ".shopee.vn"],
    //     cookie: "",
    // },
    // {
    //     key: "TiktokAds",
    //     name: "Tiktok Ads",
    //     typeInformations: [7,12],
    //     domains: ["banhang.shopee.vn", ".shopee.vn"],
    //     cookie: "",
    // },
    // {
    //     key: "Facebook",
    //     name: "Facebook",
    //     typeInformations: [4],
    //     domains: ["banhang.shopee.vn", ".shopee.vn"],
    //     cookie: "",
    // },
    // {
    //     key: "Pancake",
    //     name: "Pancake",
    //     typeInformations: [14],
    //     domains: ["banhang.shopee.vn", ".shopee.vn"],
    //     cookie: "",
    // },
    {
        key: "Salework",
        name: "Salework",
        typeInformations: [16],
        domains: ["stock.salework.net",".salework.net"],
        cookie: "",
        localStorage: {},
        sessionStorage: {},
        reports: [
            {
                value: "Salework",
                name: "Danh sách đơn hàng bán ngoài sàn",
                storageName: "Salework-Orders",
                formatUrl: "",
            },
            {
                value: "Shopee",
                name: "Danh sách đơn hàng shopee",
                storageName: "Salework-Orders",
                formatUrl: ""
            },
            {
                value: "Lazada",
                name: "Danh sách đơn hàng lazada",
                storageName: "Salework-Orders",
                formatUrl: ""
            },
            {
                value: "Tiki",
                name: "Danh sách đơn hàng tiki",
                storageName: "Salework-Orders",
                formatUrl: ""
            },
            {
                value: "Tiktok",
                name: "Danh sách đơn hàng tiktok",
                storageName: "Salework-Orders",
                formatUrl: ""
            },
            {
                value: "STORE",
                name: "Danh sách đơn hàng bán tại cửa hàng",
                storageName: "Salework-Orders",
                formatUrl: ""
            }
        ],
    },
]