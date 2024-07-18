function disabledButtonAction(){
    let buttons = document.getElementsByClassName("btnAction")
    for(let i = 0; i < buttons.length; i++){
        buttons[i].setAttribute("disabled", "disabled");
    }
}

function enableButtonAction(){
    let buttons = document.getElementsByClassName("btnAction")
    for(let i = 0; i < buttons.length; i++){
        buttons[i].removeAttribute("disabled");
    }
}

function toggleWaitingSync(flag){
    if(flag){
        document.getElementById("messageWaitingSync").classList.remove("hidden");
        document.getElementById("messageWaitingSync").innerHTML = "Đang thực hiện. Xin vui lòng chờ trong giây lát!";
    }else{
        document.getElementById("messageWaitingSync").classList.add("hidden");
    }
}

function toggleSuccessSync(flag){
    if(flag){
        document.getElementById("messageSuccessSync").classList.remove("hidden");
        document.getElementById("messageSuccessSync").innerHTML = "Thực hiện đồng bộ thành công!";
    }else{
        document.getElementById("messageSuccessSync").classList.add("hidden");
    }
}

function toggleErrorSync(flag){
    if(flag){
        document.getElementById("messageErrorSync").classList.remove("hidden");
        document.getElementById("messageErrorSync").innerHTML = "Thực hiện đồng bộ thất bại!";
    }else{
        document.getElementById("messageErrorSync").classList.add("hidden");
    }
}

function startSyncShopeeShop(connectionId, token, cookie){
    let now = new Date();
    let dateStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    let dateEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let urlDownload = `https://banhang.shopee.vn/api/mydata/v4/dashboard/export/?period=real_time&start_ts=${dateStart.getTime()/1000}&end_ts=${Math.round(dateEnd.getTime()/1000)}`
    let body = {
        url: urlDownload,
        cookie: cookie
    }
    toggleWaitingSync(true);
    fetch(URL_BASE_LOCAL+"api/connect/synchroniseDataByExtension/"+connectionId, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }).then(response =>{
        response.json().then(data =>{
            toggleWaitingSync(false);
            if(data){
                toggleSuccessSync(true);
            }else{
                toggleErrorSync(true);
            }
            setTimeout(function(){
                toggleSuccessSync(false);
                toggleErrorSync(false);
            },2000)
        })
    })
}