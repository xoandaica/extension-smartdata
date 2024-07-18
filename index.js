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
var token = "";

var listDomainNeedCookie = [DOMAIN_OF_SHOPEE,DOMAIN_OF_SHOPEE2];
var dataCookie = {
    [DOMAIN_OF_SHOPEE]: ""
}

function cookieinfo(){
    chrome.cookies.getAll({},function (cookies){
        for(i=0;i<cookies.length;i++){
            if(listDomainNeedCookie.includes(cookies[i].domain)){
                if(cookies[i].domain == DOMAIN_OF_SHOPEE || cookies[i].domain == DOMAIN_OF_SHOPEE2){
                    dataCookie[DOMAIN_OF_SHOPEE] = dataCookie[DOMAIN_OF_SHOPEE] + (dataCookie[DOMAIN_OF_SHOPEE].length > 0 ? ";": "") + cookies[i].name +"="+cookies[i].value
                }
            }
        }
    });
}
window.onload=cookieinfo;

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
                            <td><button class="btn btnAction" id="${item.id}" data-type="${item.typeInformation}">Bắt đầu</button></td>
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