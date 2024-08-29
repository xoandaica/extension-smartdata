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
        document.getElementById("message").removeAttribute("class");
        document.getElementById("message").classList.add("messageWaiting");
        document.getElementById("message").innerHTML = "Đang thực hiện. Xin vui lòng chờ trong giây lát!";
    }else{
        document.getElementById("message").classList.add("hidden");
    }
}

function toggleSuccessSync(flag){
    if(flag){
        document.getElementById("message").removeAttribute("class");
        document.getElementById("message").classList.add("messageSuccess");
        document.getElementById("message").innerHTML = "Thực hiện đồng bộ thành công!";
    }else{
        document.getElementById("message").classList.add("hidden");
    }
}

function toggleErrorSync(flag){
    if(flag){
        document.getElementById("message").removeAttribute("class");
        document.getElementById("message").classList.add("messageError");
        document.getElementById("message").innerHTML = "Thực hiện đồng bộ thất bại!";
    }else{
        document.getElementById("message").classList.add("hidden");
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
    let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let dateStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
    let dateEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
    let SPC_CDS = cookie.substring(cookie.indexOf("SPC_CDS"));
    SPC_CDS = SPC_CDS.substring(0, SPC_CDS.indexOf(";"));
    let urlOverviewDownload = `https://banhang.shopee.vn/api/mydata/v4/dashboard/export/?period=real_time&start_ts=${dateStart.getTime()/1000}&end_ts=${Math.round(dateEnd.getTime()/1000)}`;
    let urlPerformanceDownload = `https://banhang.shopee.vn/api/mydata/v2/product/performance/export/?start_ts=${dateStart.getTime()/1000}&end_ts=${Math.round(dateEnd.getTime()/1000)}&period=real_time&sort_by=&${SPC_CDS}&SPC_CDS_VER=2`;
    let urlCheckDownloadSuccess = `https://banhang.shopee.vn/api/v3/settings/get_report/?${SPC_CDS}&SPC_CDS_VER=2&report_id=`;
    let urlDownloadResult = `https://banhang.shopee.vn/api/v3/settings/download_report/?${SPC_CDS}&SPC_CDS_VER=2&report_id=`;
    let urlExportOrder = "https://banhang.shopee.vn/api/v3/affiliateplatform/gql?q=SubmitAsyncExportTaskMutation";
    let urlCheckExportOrder = "https://banhang.shopee.vn/api/v1/affiliateplatform/export/list?file_name=&type=&page_size=10&page_num=1";
    let urlDownloadOrder = "https://banhang.shopee.vn/api/v1/affiliateplatform/export/download?response_type=stream&task_id=";
    let payloadExportOrder = {
        "operationName": "SubmitAsyncExportTaskMutation",
        "query": "\n      mutation SubmitAsyncExportTaskMutation($taskType: String!, $params: String) {\n        submitAsyncExportTask(taskType: $taskType, params: $params) {\n          taskId\n          success\n        }\n      }\n      ",
        "variables": {
            "params": `{"conversionReportFilter":{"purchase_time_s":${dateStart.getTime()/1000},"purchase_time_e":${Math.round(dateEnd.getTime()/1000)}}}`,
            "taskType": "export_ams_conversion_report"
        }
    }
    let body = {
        urlOverviewDownload,
        urlPerformanceDownload,
        urlCheckDownloadSuccess,
        urlDownloadResult,
        cookie,
        typeReport,
        folderName,
        urlExportOrder,
        urlCheckExportOrder,
        urlDownloadOrder,
        payloadExportOrder
    }
    handleUploadReport(connectionId, token, body);
}

function startSyncTiktokShop(typeReport, folderName, connectionId, token, cookie, userId){
    let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let dateStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
    let dateEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
    let urlOverviewDownload = `https://seller-vn.tiktok.com/api/v3/insights/seller/shop/overview/performance/stats/export?locale=vi-VN&language=vi-VN&oec_seller_id=${userId}&aid=4068`;
    let urlDownloadFileOverview = `https://seller-vn.tiktok.com/api/v1/insights/seller/shop/export/file/%s?aid=4068&language=vi-VN&oec_seller_id=${userId}&use_content_type_definition=1`;
    let urlPerformanceDownload = `https://seller-vn.tiktok.com/api/v2/insights/seller/ttp/product/list/export?locale=vi-VN&language=vi-VN&oec_seller_id=${userId}&aid=4068`;
    let urlDownloadFilePerformance = `https://seller-vn.tiktok.com%s?aid=4068&language=vi-VN&oec_seller_id=${userId}&use_content_type_definition=1`
    let urlExportOrder = `https://affiliate.tiktok.com/api/v1/affiliate/export_order_v2?user_language=vi-VN&aid=4331&shop_region=VN`;
    let urlExportHistory = `https://affiliate.tiktok.com/api/v1/affiliate/export_history?shop_region=VN`;
    let urlExportLink = `https://affiliate.tiktok.com/api/v1/affiliate/export_link?task_id=%s&shop_region=VN`
    let body = {
        urlOverviewDownload,
        urlDownloadFileOverview,
        urlPerformanceDownload,
        urlDownloadFilePerformance,
        urlExportOrder,
        urlExportHistory,
        urlExportLink,
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
        },
        bodyExportOrder: {
            "conditions": {
                "time_period": {
                    "beginning_time": `${dateStart.getTime()}`,
                    "ending_time": `${dateEnd.getTime()}`
                },
                "product_id": ""
            }
        }
    }
    handleUploadReport(connectionId, token, body);
}

function startSyncSalework(infoReport, connectionId, token, cookie){
    let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let fullYear = yesterday.getFullYear();
    let month = yesterday.getMonth() + 1;
    if(month < 10) month = "0"+month;
    let day = yesterday.getDate();
    let SPC_CDS = cookie.substring(cookie.indexOf("SPC_CDS"));
    SPC_CDS = SPC_CDS.substring(0, SPC_CDS.indexOf(";"));
    let body = {
        url: "https://stock.salework.net/api/v2/order",
        cookie,
        reportName: infoReport.name,
        folderName: infoReport.storageName,
        displayColumns: infoReport.displayColumns,
        typeReport: infoReport.value,
        params: {
            "method": "getOrderList",
            "params": {
                "start": 0,
                "pageSize": 25,
                "channel": infoReport.value,
                "state": "",
                "search": "",
                "timestart": `${fullYear}-${month}-${day}T17:00:00.000Z`,
                "timeend": `${fullYear}-${month}-${day}T16:59:59.999Z`,
                "typeCreated": "handleAt",
                "company_id": infoReport.companyId
            },
            "token": infoReport.token
        }
    }
    handleUploadReport(connectionId, token, body);
}

function startSyncLazada(typeReport, folderName, connectionId, token, cookie){
    let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let fullYear = yesterday.getFullYear();
    let month = yesterday.getMonth() + 1;
    if(month < 10) month = "0"+month;
    let day = yesterday.getDate();
    let yesStr = `${fullYear}-${month}-${day}`;//2024-08-17
    let dateStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
    let dateEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
    let urlOverview = `https://sellercenter.lazada.vn/ba/sycm/lazada/faas/dashboard/realtime/key/detailV2.json?indexCode=pvNew%2CuvNew%2Crevenue%2Cbuyers%2Corders%2CconversionRate%2CrevenuePerBuyer%2CuvWorth`;
    let urlPerformanceProduct = `https://sellercenter.lazada.vn/ba/sycm/lazada/faas/product/performance/batch/itemV2.json?dateRange=${yesStr}|${yesStr}&dateType=recent1&page=%d&pageSize=10&orderBy=productRevenue&order=desc`;
    let body = {
        urlOverview,
        urlPerformanceProduct,
        cookie,
        typeReport,
        folderName,
    }
    handleUploadReport(connectionId, token, body);
}