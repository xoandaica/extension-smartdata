const TYPE_SHOPEE = 6;//typeInformation
const TYPE_SHOPEE_ADS = 10;
const TYPE_SHOPEE_ADS2 = 13;
const TYPE_TIKTOK_SHOP = 8;
const TYPE_TIKTOK_ADS = 7;
const TYPE_TIKTOK_ADS2 = 12;
const TYPE_LAZADA = 9;
const TYPE_FACEBOOK = 4;
const TYPE_PANCAKE = 14;
const DOMAIN_OF_SHOPEE = "banhang.shopee.vn"
const DOMAIN_OF_SHOPEE2 = ".shopee.vn"
const URL_BASE_SERVER = "https://powerdashboard.vn/"
const URL_BASE_LOCAL = "http://localhost:8082/"

const DATA_COMMONS = [
    {
        key: "ShoppeShop",
        name: "Shopee Shop",
        typeInformations: [6],
        domains: ["banhang.shopee.vn", ".shopee.vn"],
        reports: [
            {
                value: 1,
                name: "Báo cáo tổng quan",
                storageName: "Shopee-Tổng quan",
                formatUrl: "",
                dataParam: {

                },
                dataBody: {

                }
            },
            {
                value: 2,
                name: "Báo cáo hiệu quả sản phẩm",
                storageName: "Shopee-Hiệu quả sản phẩm",
                formatUrl: "",
                dataParam: {

                },
                dataBody: {
                    
                }
            }
        ],
        cookie: ""
    }
]
var token = "";

function cookieinfo(){
    chrome.cookies.getAll({},function (cookies){
        for(i=0;i<cookies.length;i++){
            for(let data of DATA_COMMONS){
                if(data.domains.includes(cookies[i].domain)){
                    data.cookie = data.cookie + (data.cookie.length > 0 ? ";": "") + cookies[i].name +"="+cookies[i].value
                }
            }
        }
    });
}

function validateDataLogin(username, password){
    if((username || "").trim().length == 0){
        document.getElementById("messageErrorLogin").classList.remove("hidden");
        document.getElementById("messageErrorLogin").innerHTML = "Username không được để trống"
        return false;
    }
    if((password || "").trim().length == 0){
        document.getElementById("messageErrorLogin").classList.remove("hidden");
        document.getElementById("messageErrorLogin").innerHTML = "Password không được để trống"
        return false;
    }
    return true;
}



function startSync(event){
    let node = event.target;
    let type = node.getAttribute("data-type");
    let id = node.getAttribute("id");
    switch(parseInt(type)){
        case TYPE_SHOPEE:
            startSyncShopeeShop(id, token, dataCookie[DOMAIN_OF_SHOPEE]);
            break;
        case TYPE_SHOPEE_ADS:
        case TYPE_SHOPEE_ADS2:
        case TYPE_TIKTOK_SHOP:
        case TYPE_TIKTOK_ADS:
        case TYPE_TIKTOK_ADS2:
        case TYPE_LAZADA:
        case TYPE_FACEBOOK:
        case TYPE_PANCAKE:
            break;
        default:
            break;
    }
}

function getNameTypeInformation(type){
    switch(type){
        case TYPE_SHOPEE:
            return "Shopee";
        case TYPE_SHOPEE_ADS:
            return "Shopee Ads";
        case TYPE_SHOPEE_ADS2:
            return "Shopee Ads";
        case TYPE_TIKTOK_SHOP:
            return "TikTok Shop";
        case TYPE_TIKTOK_ADS:
            return "TikTok Ads";
        case TYPE_TIKTOK_ADS2:
            return "TikTok Ads";
        case TYPE_LAZADA:
            return "Lazada";
        case TYPE_FACEBOOK:
            return "Facebook";
        case TYPE_PANCAKE:
            return "Pancake";
        default:
            return "Không xác định";
    }
}

function viewDataConnection(data){
    let contentHtml = "";
    for(let item of data){
        let content = `<tr>
                            <td>${item.name}</td>
                            <td>${getNameTypeInformation(item.typeInformation)}</td>
                            <td>
                                <select connectionId="connectionId">
                                    <option value="1">Đồng bộ báo cáo tổng quan</option>
                                    <option value="2">Đồng bộ báo cáo hiệu quả</option>
                                </select>
                            </td>
                            <td>
                                <button class="btn btnAction" style="margin-right:8px" connectionId="${item.id}" typeInformation="${item.typeInformation}">Đồng bộ báo cáo tổng quản</button>
                            </td>
                        </tr>`;
        contentHtml += content;
    }
    document.getElementById("contentTableConnection").innerHTML = contentHtml;
    setTimeout(function(){
        let nodes = document.getElementsByClassName("btnAction");
        if((nodes || []).length > 0){
            for(let node of nodes){
                node.addEventListener("click", startSync);
            }
        }
    })
}

function getAllConnection(){
    let url = URL_BASE_SERVER+"api/connect?" + new URLSearchParams({
        page: 0,
        size: 999999999,
        sort:"name,asc"
    });
    fetch(url, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
   .then(response => {
        response.json().then(response => viewDataConnection(response.content))
   });
}

function checkToken(){
    token = localStorage.getItem("token");
    if(!token){
        document.getElementById("boxLogin").classList.remove("hidden");
        document.getElementById("boxAction").classList.add("hidden");
    }else{
        fetch(URL_BASE_SERVER + "api/auth/current",{
            method: "GET",
            headers: {
                'Authorization': 'Bearer'+ token
            }
        }).then(function(response){
            document.getElementById("boxLogin").classList.add("hidden");
            document.getElementById("boxAction").classList.remove("hidden");
            getAllConnection();
        }).catch(function(error){
            document.getElementById("boxLogin").classList.remove("hidden");
            document.getElementById("boxAction").classList.add("hidden");
        })
    }
};
checkToken();

function asyncLogin(username, password){
    let formData = {username, password}
    fetch("https://powerdashboard.vn/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.ok){
            response.json().then(data =>{
                token = data.data;
                document.getElementById("messageSuccessLogin").classList.remove("hidden");
                document.getElementById("messageSuccessLogin").innerHTML = "Đăng nhập thành công! Xin vui lòng chờ trong giây lát!"
                setTimeout(() => {
                    document.getElementById("messageSuccessLogin").classList.add("hidden");
                    document.getElementById("boxLogin").classList.add("hidden");
                    document.getElementById("boxAction").classList.remove("hidden");
                    localStorage.setItem("token", token);
                    getAllConnection();
                }, 2000);
            });
        }else{
            document.getElementById("messageErrorLogin").classList.remove("hidden");
            document.getElementById("messageErrorLogin").innerHTML = "Tài khoản hoặc mật khẩu không đúng"
            document.getElementById("btnLogin").removeAttribute("disabled");
        }
    })
}

function login(){
    document.getElementById("messageErrorLogin").classList.add("hidden");
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if(validateDataLogin(username,password)){
        document.getElementById("btnLogin").setAttribute("disabled", "disabled");
        asyncLogin(username, password);
    }
}

document.getElementById("btnLogin").addEventListener("click", login);