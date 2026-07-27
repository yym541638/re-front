
exports.fileFilter = (val) => {
    let key = {
        "dossierName": "案卷名称",
        "status": "案卷状态",
        "dossierType": "案卷类型",
        "reportUserName": "上报人",
        "reportTime": "上报时间"
    };
    return key[val] ? key[val] : "";
};
exports.upinfokeyFilter = (val) => {
    let key = {
        'dossierNo': '案卷编号',
        'dossierType': '案卷类型',
        'dossierName': '案卷名称',
        'dossierSource': '案卷来源',
        'status': '案卷状态',
        'emergencyLevel': '紧急程度',
        'reportUserName': '上报人',
        'reportTime': '上报时间',
        "siteName":"所属养护地点",
        "relationEquipmentId":"关联设备",
        "dossierAddress":"案卷地址",
        "dossierDescribe":"案卷描述"
        
    };
    return key[val] ? key[val] : "";
};

exports.peopleStatusFilter = (val) => {
    let key = {
        "0": "离线",
        "1": "在线",
        "2": "巡检中",
        "3": "养护中",
    };
    return key[val] ? key[val] : val;
};

exports.fileformFilter = (val) => {
    let key = {
        '1': 'PC端',
        '2': 'app巡检上报',
        '3': 'app维护上报',
        '4': '告警信息',
    };
    return key[val] ? key[val] : "";
};

exports.fileinfoListFilter = (val) => {
    let key = {
        "0": "上报信息",
        "1": "立案信息",
        "2": "派遣信息",
        "3": "处理信息",
        "4": "确认信息",
        "5": "流程信息"
    };
    return key[val] ? key[val] : "";
};

exports.mesTypeFilter = (val) => {
    let key = {
        "1": "通知",
        "2": "公告",
        "3": "其他",
    };
    return key[val] ? key[val] : "";
};

exports.mesacceptTypeFilter = (val) => {
    let key = {
        "1": "全体接收",
        "2": "个体接收",
    };
    return key[val] ? key[val] : "";
};

exports.messtatusFilter = (val) => {
    let key = {
        "0": "未读",
        "1": "已读",
    };
    return key[val] ? key[val] : val;
};

exports.mesinfoFilter = (val) => {
    let key = {
        "type": "类型",
        "title": "标题",
        "createUserName": "消息发布人",
        "createTime": "创建时间",
        "receiveUserName": "接收人",
        "content": "内容",

    };
    return key[val] ? key[val] : val;
};

exports.equStatusFilter = (val) => {
    let key = {
        "1": "在用",
        "2": "维修",
        "3": "报废",

    };
    return key[val] ? key[val] : val;
};

exports.equTypeFilter = (val) => {
    let key = {
        "1": "监测设备",
        "2": "官网设备",
        "3": "污水处理设备",
        "4": "泵站设备",

    };
    return key[val] ? key[val] : val;
};