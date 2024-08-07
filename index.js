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
    //localStorage
    chrome.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        if(tabs){
            for(let tab of tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                      return JSON.stringify(localStorage)
                    }
                }).then(function(data){
                    for(let item of data){
                        if(item.result){
                            item.result = JSON.parse(item.result);
                            Object.keys(item.result).forEach(keyLocalStorage => {
                                if(keyLocalStorage === "__tea_cache_tokens_4068"){
                                    let content = JSON.parse(item.result[keyLocalStorage]);
                                    for(let dataCo of DATA_COMMONS){
                                        if(dataCo.key == "TikTokShop"){
                                            dataCo.userId = content.user_unique_id
                                        }
                                    }
                                }else if(keyLocalStorage === "ShopeeOrderDisplayColumns"){
                                    let content = JSON.parse(item.result[keyLocalStorage]);
                                    for(let dataCo of DATA_COMMONS){
                                        if(dataCo.key == "Salework"){
                                            dataCo.displayColumns = content
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
    //sessionStorage
    chrome.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        if(tabs){
            for(let tab of tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                      return JSON.stringify(sessionStorage)
                    }
                }).then(function(data){
                    for(let item of data){
                        if(item.result){
                            item.result = JSON.parse(item.result);
                            Object.keys(item.result).forEach(keySessionStorage => {
                                if(keySessionStorage === "_um_dat_uhsetn"){
                                    let content = item.result[keySessionStorage];
                                    for(let dataCo of DATA_COMMONS){
                                        if(dataCo.key == "Salework"){
                                            dataCo.companyId = content
                                        }
                                    }
                                }else if(keySessionStorage === "_um_dat_umsvtn"){
                                    let content = item.result[keySessionStorage];
                                    for(let dataCo of DATA_COMMONS){
                                        if(dataCo.key == "Salework"){
                                            dataCo.token = content
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

window.onload = cookieinfo;

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
    let type = parseInt(node.getAttribute("typeInformationId"));
    let id = parseInt(node.getAttribute("connectionId"));
    let typeReport = parseInt(document.getElementById(`typeReport${id}`).value);
    if(isNaN(typeReport)){
        typeReport = document.getElementById(`typeReport${id}`).value
    }
    for(let item of DATA_COMMONS){
        if(item.typeInformations.includes(type)){
            let folderName = "";
            let inforReport = null;
            if(item.reports){
                for(let report of item.reports){
                    if(report.value == typeReport){
                        folderName = report.storageName;
                        inforReport = report;
                    }
                }
            }
            if(item.key === "ShoppeShop"){
                startSyncShopeeShop(typeReport, folderName, id, token, item.cookie)
            }else if(item.key === "TikTokShop"){
                startSyncTiktokShop(typeReport, folderName, id, token, item.cookie, item.userId);
            }else if(item.key === "Lazada"){

            }else if(item.key === "Salework"){
                inforReport["companyId"] = item.companyId;
                inforReport["token"] = item.token;
                inforReport["displayColumns"] = item.displayColumns;
                startSyncSalework(inforReport, id, token, item.cookie);
            }
        }
    }
}

function getNameTypeInformation(type){
    for(let item of DATA_COMMONS){
        if(item.typeInformations.includes(type)){
            return item.name;
        }
    }
    return "Không xác định";
}

function getComboOptionExport(connectionInfo){
    for(let item of DATA_COMMONS){
        if(item.typeInformations.includes(connectionInfo.typeInformation)){
            if(item.reports){
                let option = "";
                for(let opt of item.reports){
                    option += `<option value="${opt.value}">${opt.name}</option>`;
                }
                return `<select id="typeReport${connectionInfo.id}" style="height:36px" connectionId="${connectionInfo.id}">
                                ${option}
                            </select>`
            }
        }
    }
    return "";
}

function viewDataConnection(data){
    let contentHtml = "";
    for(let item of data){
        let contentSelect = getComboOptionExport(item);
        let contentButtonSync = `<button class="btn btnAction" connectionId="${item.id}" typeInformationId="${item.typeInformation}">Bắt đầu</button>`
        let content = `<tr style="height:36px">
                            <td>${item.name}</td>
                            <td>${getNameTypeInformation(item.typeInformation)}</td>
                            <td>${contentSelect}</td>
                            <td>${contentSelect != "" ? contentButtonSync : ""}</td>
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
                'Authorization': 'Bearer '+ token
            }
        }).then(function(response){
            if(response.status == 200){
                document.getElementById("boxLogin").classList.add("hidden");
                document.getElementById("boxAction").classList.remove("hidden");
                getAllConnection();
            }else{
                document.getElementById("boxLogin").classList.remove("hidden");
                document.getElementById("boxAction").classList.add("hidden");
            }
        }).catch(function(error){
            document.getElementById("boxLogin").classList.remove("hidden");
            document.getElementById("boxAction").classList.add("hidden");
        })
    }
};
checkToken();

function asyncLogin(username, password){
    let formData = {username, password}
    fetch(URL_BASE_SERVER + "api/auth/login", {
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