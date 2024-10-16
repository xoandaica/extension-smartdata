function cookieinfo(){
    chrome.cookies.getAll({},function (cookies){
        for(i=0;i<cookies.length;i++){
            for(let data of DATA_COMMONS){
                if(data.domains.includes(cookies[i].domain)){
                    data.cookie = data.cookie + (data.cookie.length > 0 ? ";": "") + cookies[i].name +"="+cookies[i].value
                }
            }
        }
        // console.log("cookie shopee: ", DATA_COMMONS[0].cookie)
        // console.log("cookie tiktok: ", DATA_COMMONS[1].cookie)
        // console.log("cookie lazada: ", DATA_COMMONS[2].cookie)
    });
    //localStorage
    chrome.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        if(tabs){
            for(let tab of tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        return JSON.stringify({
                            localStorage: JSON.stringify(window.localStorage),
                            sessionStorage: JSON.stringify(window.sessionStorage),
                            cookie: document.cookie
                        })
                    }
                }).then(function(data){
                    data = JSON.parse(data[0].result);
                    let url = tab.url;
                    for(let item of DATA_COMMONS){
                        if(url.indexOf(item.domains[0]) >= 0){
                            item.localStorage = JSON.parse(data.localStorage)
                            item.sessionStorage = JSON.parse(data.sessionStorage)
                            // item.cookie = data.cookie;
                        }
                    }
                })
            }
        }

    })
    //sessionStorage
    // chrome.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
    //     if(tabs){
    //         for(let tab of tabs){
    //             chrome.scripting.executeScript({
    //                 target: { tabId: tab.id },
    //                 func: () => {
    //                   return JSON.stringify(sessionStorage)
    //                 }
    //             }).then(function(data){
    //                 for(let item of data){
    //                     if(item.result){
    //                         item.result = JSON.parse(item.result);
    //                         Object.keys(item.result).forEach(keySessionStorage => {
    //                             if(keySessionStorage === "_um_dat_uhsetn"){
    //                                 let content = item.result[keySessionStorage];
    //                                 for(let dataCo of DATA_COMMONS){
    //                                     if(dataCo.key == "Salework"){
    //                                         dataCo.companyId = content
    //                                     }
    //                                 }
    //                             }else if(keySessionStorage === "_um_dat_umsvtn"){
    //                                 let content = item.result[keySessionStorage];
    //                                 for(let dataCo of DATA_COMMONS){
    //                                     if(dataCo.key == "Salework"){
    //                                         dataCo.token = content
    //                                     }
    //                                 }
    //                             }
    //                         })
    //                     }
    //                 }
    //             })
    //         }
    //     }
    // })
}

window.onload = cookieinfo;

function validateDataLogin(username, password){
    if((username || "").trim().length == 0){
        document.getElementById("message").classList.remove("hidden");
        document.getElementById("message").classList.add("messageError");
        document.getElementById("message").innerHTML = "Username không được để trống"
        return false;
    }
    if((password || "").trim().length == 0){
        document.getElementById("message").classList.remove("hidden");
        document.getElementById("message").classList.add("messageError");
        document.getElementById("message").innerHTML = "Password không được để trống"
        return false;
    }
    return true;
}



function startSync(event){
    let node = event.target;
    let type = parseInt(node.getAttribute("typeInformationId"));
    let id = parseInt(node.getAttribute("connectionId"));
    // let typeReport = parseInt(document.getElementById(`typeReport${id}`).value);
    // if(isNaN(typeReport)){
    //     typeReport = document.getElementById(`typeReport${id}`).value
    // }
    for(let item of DATA_COMMONS){
        if(item.typeInformations.includes(type)){
            // if(item.reports){
            //     for(let report of item.reports){
            //         if(report.value == typeReport){
            //             folderName = report.storageName;
            //             inforReport = report;
            //         }
            //     }
            // }
            if(item.key === "ShoppeShop"){
                if(item.reports){
                    for(let report of item.reports){
                        startSyncShopeeShop(report.value, report.storageName, id, token, item.cookie)
                    }
                }
            }else if(item.key === "TikTokShop"){
                if(item.reports){
                    for(let report of item.reports){
                        startSyncTiktokShop(report.value, report.storageName, id, token, item.cookie, item.userId);
                    }
                }
            }else if(item.key === "Lazada"){
                if(item.reports){
                    for(let report of item.reports){
                        startSyncLazada(report.value, report.storageName, id, token, item.cookie);
                    }
                }
            }else if(item.key === "Salework"){
                for(let report of item.reports){
                    let inforReport = {...report};
                    inforReport["companyId"] = item.companyId;
                    inforReport["token"] = item.token;
                    inforReport["displayColumns"] = item.displayColumns;
                    startSyncSalework(inforReport, id, token, item.cookie);
                }
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
                            <td>${contentSelect != "" ? contentButtonSync : ""}</td>
                        </tr>`;//<td>${contentSelect}</td>
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

function pushDataInfoApiConnection(){
    let url = URL_BASE_SERVER+"api/connect/connection/updateInfoApi";
    toggleWaitingSync(true);
    fetch(url, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(DATA_COMMONS)
    }).then(response => {
        response.json().then(data =>{
            setTimeout(() => {
                toggleWaitingSync(false);
                if(data){
                    toggleSuccessSync(true);
                }else{
                    toggleErrorSync(true);
                }
                setTimeout(function(){
                    toggleSuccessSync(false);
                    toggleErrorSync(false);
                    window.close();
                },2000)
            }, 2000)
        })
    });
}

function logout(){
    localStorage.clear();
    document.getElementById("boxAction").classList.add("hidden");
    document.getElementById("boxLogin").classList.remove("hidden");
    setTimeout(() => {
        document.getElementById("btnLogin").removeAttribute("disabled");
        document.getElementById("btnLogin").addEventListener("click", login);
    }, 100);
}

function checkToken(){
    token = localStorage.getItem("token");
    document.getElementById("btnLogin").setAttribute("disabled","disabled");
    if(!token){
        document.getElementById("boxLogin").classList.remove("hidden");
        document.getElementById("btnLogin").removeAttribute("disabled");
        document.getElementById("btnLogin").addEventListener("click", login);
        document.getElementById("boxAction").classList.add("hidden");
    }else{
        document.getElementById("message").removeAttribute("class");
        document.getElementById("message").classList.add("messageWaiting");
        document.getElementById("message").innerHTML = "Đang kiểm tra tài khoản! Xin vui lòng chờ trong giây lát!"
        fetch(URL_BASE_SERVER + "api/auth/current",{
            method: "GET",
            headers: {
                'Authorization': 'Bearer '+ token
            }
        }).then(function(response){
            if(response.status == 200){
                document.getElementById("message").classList.remove("messageWaiting");
                document.getElementById("message").classList.add("messageSuccess");
                document.getElementById("message").innerHTML = "Xác thực tài khoản thành công!";
                setTimeout(function(){
                    document.getElementById("message").classList.add("hidden");
                    document.getElementById("boxLogin").classList.add("hidden");
                    document.getElementById("boxAction").classList.remove("hidden");
                    setTimeout(() => {
                        let arr = document.getElementsByClassName("btnAction");
                        for(let i = 0; i < arr.length; i++) {
                            arr[i].addEventListener("click", pushDataInfoApiConnection);
                        }
                        arr = document.getElementsByClassName("btnLogout");
                        for(let i = 0; i < arr.length; i++) {
                            arr[i].addEventListener("click", logout);
                        }
                        response.json().then(function(data){
                            document.getElementById("nameOfUserLogin").innerHTML = `${data.name} (${data.email})`;
                        })
                    }, 100);
                },1000)
            }else{
                document.getElementById("message").classList.remove("messageWaiting");
                document.getElementById("message").classList.add("messageError");
                document.getElementById("message").innerHTML = "Xác thực tài khoản thất bại!";
                setTimeout(function(){
                    document.getElementById("message").classList.add("hidden");
                    document.getElementById("boxLogin").classList.remove("hidden");
                    setTimeout(() => {
                        document.getElementById("btnLogin").addEventListener("click", login);
                        document.getElementById("btnLogin").removeAttribute("disabled");
                    }, 100);
                    document.getElementById("boxAction").classList.add("hidden");
                }, 2000)
            }
        }).catch(function(error){
            document.getElementById("boxLogin").classList.remove("hidden");
            document.getElementById("boxAction").classList.add("hidden");
        })
    }
};
checkToken();

function asyncLogin(username, password){
    document.getElementById("message").classList.remove("hidden");
    document.getElementById("message").classList.remove("messageError");
    document.getElementById("message").classList.add("messageWaiting");
    document.getElementById("message").innerHTML = "Đang đăng nhập! Xin vui lòng chờ trong giây lát!"
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
                document.getElementById("message").classList.remove("messageWaiting");
                document.getElementById("message").classList.add("messageSuccess");
                document.getElementById("message").innerHTML = "Đăng nhập thành công! Xin vui lòng chờ trong giây lát!"
                setTimeout(() => {
                    document.getElementById("message").classList.add("hidden");
                    document.getElementById("boxLogin").classList.add("hidden");
                    document.getElementById("boxAction").classList.remove("hidden");
                    localStorage.setItem("token", token);
                }, 2000);
            });
        }else{
            document.getElementById("message").classList.remove("messageWaiting");
            document.getElementById("message").classList.add("messageError");
            document.getElementById("message").innerHTML = "Tài khoản hoặc mật khẩu không đúng"
            setTimeout(() => {
                document.getElementById("message").classList.add("hidden");
                document.getElementById("btnLogin").removeAttribute("disabled");
            }, 2000);
        }
    })
}

function login(){
    document.getElementById("message").removeAttribute("class");
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if(validateDataLogin(username,password)){
        document.getElementById("btnLogin").setAttribute("disabled", "disabled");
        asyncLogin(username, password);
    }
}