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

function handleUploadReport(connectionId, token, body){
    toggleWaitingSync(true);
    fetch(URL_BASE_SERVER+"api/connect/synchroniseDataByExtension/"+connectionId, {
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

function startSyncShopeeShop(typeReport, folderName, connectionId, token, cookie){
    let now = new Date();
    let dateStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    let dateEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let SPC_CDS = cookie.substring(cookie.indexOf("SPC_CDS"));
    SPC_CDS = SPC_CDS.substring(0, SPC_CDS.indexOf(";"));
    let urlOverviewDownload = `https://banhang.shopee.vn/api/mydata/v4/dashboard/export/?period=real_time&start_ts=${dateStart.getTime()/1000}&end_ts=${Math.round(dateEnd.getTime()/1000)}`;
    let urlPerformanceDownload = `https://banhang.shopee.vn/api/mydata/v2/product/performance/export/?start_ts=${dateStart.getTime()/1000}&end_ts=${Math.round(dateEnd.getTime()/1000)}&period=real_time&sort_by=&${SPC_CDS}&SPC_CDS_VER=2`;
    let urlCheckDownloadSuccess = `https://banhang.shopee.vn/api/v3/settings/get_report/?${SPC_CDS}&SPC_CDS_VER=2&report_id=`;
    let urlDownloadResult = `https://banhang.shopee.vn/api/v3/settings/download_report/?${SPC_CDS}&SPC_CDS_VER=2&report_id=`
    let body = {
        urlOverviewDownload,
        urlPerformanceDownload,
        urlCheckDownloadSuccess,
        urlDownloadResult,
        cookie,
        typeReport,
        folderName
    }
    handleUploadReport(connectionId, token, body);
}

function startSyncTiktokShop(typeReport, folderName, connectionId, token, cookie, userId){
    let now = new Date();
    let dateStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    let dateEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let urlOverviewDownload = `https://seller-vn.tiktok.com/api/v3/insights/seller/shop/overview/performance/stats/export?locale=vi-VN&language=vi-VN&oec_seller_id=${userId}&aid=4068`;
    let urlDownloadFileOverview = `https://seller-vn.tiktok.com/api/v1/insights/seller/shop/export/file/%s?aid=4068&language=vi-VN&oec_seller_id=${userId}&use_content_type_definition=1`;
    let urlPerformanceDownload = `https://seller-vn.tiktok.com/api/v2/insights/seller/ttp/product/list/export?locale=vi-VN&language=vi-VN&oec_seller_id=${userId}&aid=4068`;
    let urlDownloadFilePerformance = `https://seller-vn.tiktok.com%s?aid=4068&language=vi-VN&oec_seller_id=${userId}&use_content_type_definition=1`
    let body = {
        urlOverviewDownload,
        urlDownloadFileOverview,
        urlPerformanceDownload,
        urlDownloadFilePerformance,
        cookie,
        typeReport,
        folderName,
        bodyOverview: {
            "request": {
                "params": [
                    {
                        "time_descriptor": {
                            "start": "%s",
                            "end": "%s",
                            "timezone_offset": 25200,
                            "scenario": 7,//4 - 7D
                            "granularity": "1D",
                            "with_previous_period": false
                        },
                        "stats_types": [
                            1,
                            4,
                            5,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            20
                        ]
                    }
                ]
            }
        },
        bodyPerformance: {
            "request": {
                "list_control": {
                    "rules": [
                        {
                            "direction": 2,
                            "field": "gmv"
                        }
                    ],
                    "pagination": {
                        "size": 13,
                        "page": 0
                    }
                },
                "filter": {},
                "time_descriptor": {
                    "start": "%s",
                    "end": "%s"
                },
                "search": {}
            }
        }
    }
    handleUploadReport(connectionId, token, body);
}