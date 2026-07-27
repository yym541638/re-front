export default {
    formObj1: [{
            input: true,
            label: "点标识",
            prop: "dropMark",
            disabled: false,
            isShow: true,
            content: "[ 0-9 a-z A-Z _ ] （字母，数字），不使用特殊字符",
            rules: [{
                    required: true,
                    message: "请输入",
                    trigger: 'blur'
                },
                // {
                //     validator: (rule, value, callback) => {
                //         if (!value) callback(new Error(rule.key + "不能为空"));
                //         let mustNumReg = /(?=.*\d)/;
                //         let mustUpperReg = /(?=.*[a-zA-Z])/;
                //         let mustMaxSitcomReg =
                //             /^(?=.*[_])/;
                //         if (!mustNumReg.test(value)) {
                //             callback(new Error("必须包含数字!"));
                //         } else if (!mustUpperReg.test(value)) {
                //             callback(new Error("必须包含字母!"));
                //         } else if (!mustMaxSitcomReg.test(value)) {
                //             callback(new Error("必须包含下划线!"));
                //         } else {
                //             callback();
                //         }
                //     },
                // }
            ],
        },
        {
            select: true,
            label: "点类型",
            prop: "dropType",
            disabled: false,
            options: [{
                    label: "采集点",
                    value: 1,
                },
                {
                    label: "算法输出点",
                    value: 2,
                },
                {
                    label: "中间点",
                    value: 3,
                },
            ],
            rules: [{
                required: true,
                message: "请输入",
                trigger: 'change'
            }, ],
        },


        {
            select: true,
            notShow: true,
            label: "数据源",
            prop: "dataSource",
            disabled: false,
            options: [

            ],
        },
        {
            input: true,
            notShow: true,
            label: "数据源标识",
            prop: "dataSourceMark",
            disabled: false,

        },
        {
            notShow: true,
            computational: true,
            label: "计算公式",
            prop: "formulaContent",
            itemWidth: true,
            disabled: false,

        },
        {
            textarea: true,
            label: "点描述",
            prop: "dropDescribe",
            itemWidth: true,
            disabled: false,

        },

        // {
        //     input: true,
        //     label: "上限值",
        //     prop: "upperLimit",
        //     disabled: false,
        // },
        // {
        //     input: true,
        //     label: "下限值",
        //     prop: "lowerLimit",
        //     disabled: false,
        // },
        {
            input: true,
            label: "单位",
            prop: "unit",
            disabled: false,

        },
        {
            notShow: true,
            input: true,
            label: "周期(ms)",
            prop: "cycle",
            disabled: false,
            rules: [{
                required: true,
                message: "请输入周期",
            }, ],
        },


        {
            select: true,
            label: "数据类型",
            prop: "dataType",
            disabled: false,
            options: [],
            rules: [{
                required: true,
                message: "请选择",
                trigger: 'change'
            }, ],
        },
        {
            input: true,
            label: "数据精度",
            prop: "accuracy",

        },
        {
            select: true,
            label: "编码方式",
            prop: "coding",
            disabled: false,
            options: [],
            rules: [{
                required: true,
                message: "请输入",
                trigger: 'change'
            }, ],
        },
        {
            //     input: true,
            //     label: "所属设备",
            //     prop: "deviceName",
            //    disabled: false,
            selectTree: true,
            label: "所属设备",
            prop: "deviceName",
            disabled: false,
            treeData: [],
        },
        {
            select: true,
            label: "压缩算法",
            prop: "compress",
            disabled: false,
            options: [{
                    label: "UNCOMPRESSED",
                    value: "UNCOMPRESSED",
                },
                {
                    label: "SNAPPY",
                    value: "SNAPPY",
                },
                {
                    label: "LZ4",
                    value: "LZ4",
                },
                {
                    label: "GZIP",
                    value: "GZIP",
                },
                {
                    label: "ZSTD",
                    value: "ZSTD",
                },
                {
                    label: "LZMA2",
                    value: "LZMA2",
                },
            ],
            rules: [{
                required: true,
                message: "请输入",
                trigger: 'change'
            }, ],
        },
        {
            select: true,
            label: "读写权限",
            prop: "authority",
            disabled: false,
            options: [{
                    label: "读",
                    value: 1,
                },
                {
                    label: "写",
                    value: 2,
                },
                {
                    label: "读写",
                    value: 3,
                },
            ],
        },


        {
            textarea: true,
            label: "备注",
            prop: "remarks",
            itemWidth: true,
        },
        {
            tag: true,
            label: "点标签",
            prop: "pointLabels",
            itemWidth: true,

        },
    ],
    Peersublevel: [{
            input: true,
            label: "名称",
            prop: "name",
            disabled: false,
            itemWidth: true,
            rules: [{
                    required: true,
                    message: "请输入",
                    trigger: 'blur'
                },
                {
                    validator: (rule, value, callback) => {
                        const reg = /-/;
                        if (reg.test(value)) {
                            callback(new Error('不能使用 "-" 符号'));
                        } else {
                            callback();
                        }
                    },
                }
            ],
            // rules: [{
            //     required: true,
            //     message: "请输入",
            //     trigger: 'blur'
            // }, ],
        },

        {
            input: true,
            label: "编码",
            prop: "coding",
            disabled: false,
            itemWidth: true,
            isShow: true,
            content: "[ 0-9 a-z A-Z _ ] （字母，\n数字），不使用特殊字符",
            rules: [{
                    required: true,
                    message: "请输入",
                    trigger: 'blur'
                },
                {
                    validator: (rule, value, callback) => {
                        let reg = /^[0-9A-Za-z]+$/;
                        let mustNumReg = /(?=.*\d)/;
                        let mustUpperReg = /(?=.*[a-zA-Z])/;
                        if (!reg.test(value)) {
                            callback(new Error('只能包含数字和字母'));
                        } else if (!mustNumReg.test(value)) {
                            callback(new Error("必须包含数字!"));
                        } else if (!mustUpperReg.test(value)) {
                            callback(new Error("必须包含字母!"));
                        } else {
                            callback();
                        }

                    },
                }
            ],
        },
        {
            textarea: true,
            label: "设备描述",
            prop: "unitDescribe",
            itemWidth: true,

        },
        {
            textarea: true,
            label: "备注",
            prop: "remarks",
            itemWidth: true,

        },

    ],
    Plantcreation: [{
            input: true,
            label: "电厂标识",
            prop: "plantMark",
            disabled: false,
            itemWidth: true,
            isShow: true,
            content: "[ 0-9 a-z A-Z _ ] （字母，\n数字），不使用特殊字符",
            rules: [{
                    required: true,
                    message: "请输入",
                },
                {
                    validator: (rule, value, callback) => {
                        let reg = /^[0-9A-Za-z]+$/;
                        let mustNumReg = /(?=.*\d)/;
                        let mustUpperReg = /(?=.*[a-zA-Z])/;
                        if (!reg.test(value)) {
                            callback(new Error('只能包含数字和字母'));
                        } else if (!mustNumReg.test(value)) {
                            callback(new Error("必须包含数字!"));
                        } else if (!mustUpperReg.test(value)) {
                            callback(new Error("必须包含字母!"));
                        } else {
                            callback();
                        }
                        // if (!value) callback(new Error(rule.key + "不能为空"));
                        // let mustNumReg = /(?=.*\d)/;
                        // let mustUpperReg = /(?=.*[a-zA-Z])/;
                        // let mustMaxSitcomReg =
                        //     /^(?=.*[_])/;
                        // if (!mustNumReg.test(value)) {
                        //     callback(new Error("必须包含数字!"));
                        // } else if (!mustUpperReg.test(value)) {
                        //     callback(new Error("必须包含字母!"));
                        // } else if (!mustMaxSitcomReg.test(value)) {
                        //     callback(new Error("必须包含下划线!"));
                        // } else if (/[\u4E00-\u9FA5]/g.test(value)) {
                        //     callback(new Error("不能包含中文!"));
                        // } else {
                        //     callback();
                        // }
                    },
                }
            ],
        },
        {
            input: true,
            label: "点厂名称",
            prop: "plantName",
            disabled: false,
            itemWidth: true,
            rules: [{
                    required: true,
                    message: "请输入",
                },
                {
                    validator: (rule, value, callback) => {
                        const reg = /-/;
                        if (reg.test(value)) {
                            callback(new Error('不能使用 "-" 符号'));
                        } else {
                            callback();
                        }
                    },
                }
            ],
        },
        {
            textarea: true,
            label: "电厂简介",
            prop: "plantBlurb",
            itemWidth: true,
            disabled: false,
        },

        {
            input: true,
            label: "国家",
            prop: "country",
            itemWidth: true,
            disabled: false,
        },
        {
            input: true,
            label: "所在集团",
            prop: "bloc",
            disabled: false,
            itemWidth: true,

        },
        {
            input: true,
            label: "经度",
            prop: "longitude",
            disabled: false,
            itemWidth: true,

        },
        {
            input: true,
            label: "纬度",
            itemWidth: true,
            prop: "latitude",
            disabled: false,

        },
        {
            textarea: true,
            label: "备注",
            prop: "remarks",
            itemWidth: true,
            disabled: false,
        },

    ],
    dataSourceformData: {
        dataSource: "",
        dataSourceName: "",
        dataSourceCoding: "",
        dataSourceType: "",
        collectionCycle: "",
        address: "",
        urlData: "",
        requestWay: "",
        port: "",
        database: "",
        userName: "",
        password: "",
        storeBase: {},
        status: null,
        parameter: [{
            value1: "",
            value2: "",

        }, ],
        dataDescribe: "",
    },
    formData: {
        plantMark: "",
        plantName: "",
        plantBlurb: "",
        country: "",
        bloc: "",
        longitude: "",
        latitude: "",
        //  remarks: "",


        name: "",
        coding: "",
        unitDescribe: "",
        remarks: "",
        jkcs: [{
                cs1: "",
                cs2: "",

            },

        ],
        yhm: "",
        sjylx: "redis",
        fileName1: "",
        fileName2: "",
        fileName3: "",
        fileName4: "",
        fileName: "",
        textType: "",
        remark: "",
        dianlx: "中间点",
        remark1: null,
        textType20: [
            // {
            //     name: "547",
            //     background: "red",
            //     color: "#fff"
            // }

        ],
        textTypebc: ""
    },
    formDataDot: {
        dataSourceId: "",
        dropMark: "",
        dataSource: "",
        dataSourceMark: "",
        dropType: null,
        formulaContent: "",
        formulaDrop: '',
        upperLimit: "",
        lowerLimit: "",
        unit: "",
        cycle: "",
        dataType: "",
        accuracy: "",
        coding: "",
        deviceId: "",
        deviceName: "",
        compress: "",
        authority: null,
        remarks: "",
        dropDescribe: "",
        pointLabels: []
    },

    tableTitles: [{
            fieldName: "dropMark",
            titleName: "点标识",
            fontendType: "stamp",
            sortable: true,
            screenType: "2",
            filtersOptions: [{
                data: ""
            }],
            width: 200,
            columnIsfixed: "left",

        },
        {
            fieldName: "dropDescribe",
            titleName: "点描述",
            sortable: true,
            width: 200,
            fontendType: "stamp",
            screenType: "2",
            filtersOptions: [{
                data: ""
            }],

        },
        {
            fieldName: "dataValue",
            titleName: "实时值",
            width: 200,

        },
        {
            fieldName: "updateTime",
            titleName: "时间",
            width: 200,

        },
        {
            fieldName: "pointLabels",
            titleName: "点标签",
            fontendType: "slot",
            filterMultiple: true,
            filtersOptions: [],
            width: 280,
        },
        {
            fieldName: "dataSourceName",
            titleName: "数据源名称",
            width: "200",
            sortable: true,
            fontendType: "slot",
            filterMultiple: true,
            filtersOptions: [],
        },
        {
            fieldName: "dataSourceMark",
            titleName: "数据源点表标识",
            sortable: true,
            width: 250,
            fontendType: "stamp",
            screenType: "2",
            filtersOptions: [{
                data: ""
            }],
        },
        {
            fieldName: "dropType",
            titleName: "点类型",
            width: 200,
            sortable: true,
            fontendType: "slot",
            filterMultiple: true,
            filtersOptions: [{
                    label: "采集点",
                    value: "1"
                },
                {
                    label: "算法输出点",
                    value: "2"
                },
                {
                    label: "中间点",
                    value: "3"
                },
            ],

        },
        // {
        //     fieldName: "upperLimit",
        //     titleName: "上限值",
        //     width: "100",
        // },
        // {
        //     fieldName: "lowerLimit",
        //     titleName: "下限值",
        //     sortable: true,
        //     width: "100",
        // },
        {
            fieldName: "unit",
            titleName: "单位",
            sortable: true,
            width: "100",

        },
        {
            fieldName: "createTime",
            titleName: "创建时间",
            fontendType: "stamp",
            sortable: true,
            width: "200",
            screenType: "1",
            filtersOptions: [{
                data: ""
            }],
        },

    ],
    newChoicetableTitles: [{
            fieldName: "dropMark",
            titleName: "点标识",
            sortable: true,
            width: "80",

        },
        {
            fieldName: "dropDescribe",
            titleName: "点描述",
            sortable: true,
            width: "100",

        },

        {
            fieldName: "dataSourceMark",
            titleName: "数据源点表标识",
            sortable: true,
            width: "150",
        },
        {
            fieldName: "dropType",
            titleName: "点类型",
            width: "100",
            sortable: true,
            fontendType: "slot",
        },
        // {
        //     fieldName: "upperLimit",
        //     titleName: "上限值",
        //     width: "100",

        // },
        // {
        //     fieldName: "lowerLimit",
        //     titleName: "下限值",
        //     sortable: true,
        //     width: "100",
        // },
        {
            fieldName: "unit",
            titleName: "单位",
            sortable: true,
            width: "100",

        },
        {
            fieldName: "createTime",
            titleName: "创建时间",
            sortable: true,

        },

    ],
    tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        sortType: "updateTime",
        ascDesc: "desc",
        dropMark: ""
    },


    dataSourceformObj: [{
            divider: true,
            label: "基础信息",
            content: "必填信息完成后可进行保存",
            itemWidth: true,
            itembackground: true,

        },
        {
            input: true,
            label: "数据源名称",
            prop: "dataSourceName",
            rules: [{
                required: true,
                message: "请输入",
                trigger: 'blur'
            }, ],
        },
        {
            input: true,
            label: "数据源编码",
            prop: "dataSourceCoding",
            rules: [{
                required: true,
                message: "请输入",
                trigger: 'blur'
            }, ],
        },
        {
            select: true,
            label: "数据源类型",
            prop: "dataSourceType",

            options: [{
                    label: "redis",
                    value: "redis",
                },
                {
                    label: "sql server",
                    value: "sql server",
                },
                {
                    label: "REST API",
                    value: "REST API",
                },
            ],
            rules: [{
                required: true,
                message: "请选择",
                trigger: 'change'
            }, ],
        },
        {
            input: true,
            label: "采集周期",
            prop: "collectionCycle",

            rules: [{
                required: true,
                message: "请输入",
                trigger: 'blur'
            }, ],
        },
        {
            input: true,
            label: "请求url",
            notShow: false,
            prop: "urlData",
            itemWidth: true,
        },
        {
            select: true,
            label: "请求方式",
            notShow: false,
            prop: "requestWay",
            options: [{
                    label: "get",
                    value: "get",
                },
                {
                    label: "post",
                    value: "post",
                },

            ],
        },
        {
            input: true,
            label: "IP地址",
            notShow: false,
            prop: "address",
            // itemWidth: true,
        },
        {
            input: true,
            label: "端口",
            notShow: false,
            prop: "port",


        },
        {
            input: true,
            notShow: false,
            label: "数据库",
            prop: "database",


        },
        {
            input: true,
            notShow: false,
            label: "用户名",
            prop: "userName",


        },
        {
            input: true,
            notShow: false,
            label: "密码",
            prop: "password",


        },
        {
            dynamicForm: true,
            notShow: true,
            label: "接口参数",
            prop: "parameter",
            itemWidth: true,

        },
        {
            select: true,
            label: "所属电厂",
            prop: "facName",
            options: [],
            isdisabled: true
        },
        {
            input: true,
            label: "所属Key名 ",
            prop: "keyName",
            notShow: true,
            //  itemWidth: true,

        },
        {
            textarea: true,
            label: "数据源描述",
            prop: "dataDescribe",
            itemWidth: true,

        },
        {
            divider: true,
            label: "目标库信息",
            content: "",
            itemWidth: true,
            itembackground: true,

        },
        {
            searchSelectTwo: true,
            label: "目标库",
            prop: "storeBase",
            options: [],
            rules: [{
                required: true,
                message: "请选择",
                trigger: 'change'
            }, ],
        },
        {
            divider: true,
            label: "操作设置",
            content: "所有信息完成后可进行以下操作",
            itemWidth: true,
            itembackground: true,

        },
        {
            operatingButton: true,
            label: "",
            itemWidth: true,


        },
    ],

    formObj2: [{
            input: true,
            label: "点标识",
            prop: "dropMark",
            disabled: false,
            isShow: true,
            content: "不能包含中文字符",
            rules: [{
                    required: true,
                    message: "请输入",
                },
                {
                    validator: (rule, value, callback) => {
                        const reg = /[\u4e00-\u9fa5]/; // 匹配中文字符的正则表达式
                        if (reg.test(value)) {
                            callback(new Error("不能包含中文字符"));
                        } else {
                            callback();
                        }
                        // let reg = /^[0-9A-Za-z]+$/;
                        // let mustNumReg = /(?=.*\d)/;
                        // let mustUpperReg = /(?=.*[a-zA-Z])/;
                        // if (!reg.test(value)) {
                        //     callback(new Error('只能包含数字和字母'));
                        // } else if (!mustNumReg.test(value)) {
                        //     callback(new Error("必须包含数字!"));
                        // } else if (!mustUpperReg.test(value)) {
                        //     callback(new Error("必须包含字母!"));
                        // } else {
                        //     callback();
                        // }
                    },
                }
            ],
        },

        {
            select: true,
            label: "点类型",
            prop: "dropType",
            disabled: false,
            options: [{
                    label: "采集点",
                    value: 1,
                },
                {
                    label: "算法输出点",
                    value: 2,
                },
                {
                    label: "中间点",
                    value: 3,
                },
            ],
            rules: [{
                required: true,
                message: "请选择点类型",
            }, ],
        },



        {
            notShow: true,
            computational: true,
            label: "计算公式",
            prop: "formulaContent",
            itemWidth: true,
            disabled: false,

        },
        {
            textarea: true,
            label: "点描述",
            prop: "dropDescribe",
            itemWidth: true,
            disabled: false,

        },
        {
            searchSelectTwo: true,
            //    notShow: true,
            label: "所属数据源",
            prop: "dataSource",
            disabled: false,
            options: [],
            rules: [{
                required: true,
                message: "请选择",
                trigger: 'change'
            }, ],
        },
        {
            input: true,
            //    notShow: true,
            label: "所属机组",
            prop: "setName",
            disabled: true,

        },
        {
            select: true,
            label: "数据类型",
            prop: "dataType",
            disabled: false,
            options: [],
            rules: [{
                required: true,
                message: "请选择数据类型",
            }, ],
        },
        {
            input: true,
            label: "单位",
            prop: "unit",
            disabled: false,

        },
        {
            input: true,
            //  notShow: true,
            label: "数据源点标识",
            prop: "dataSourceMark",
            disabled: false,

        },
        // {
        //     // searchSelectTwo: true,
        //     // label: "所属设备",
        //     // prop: "deviceName",
        //     // disabled: false,
        //     // options: [],
        //     selectTree: true,
        //     label: "所属设备",
        //     prop: "deviceName",
        //     disabled: false,
        //     treeData: [], 
        // },
        {
            textarea: true,
            label: "备注",
            prop: "remarks",
            itemWidth: true,
        },
        {
            tag: true,
            label: "点标签",
            prop: "pointLabels",
            itemWidth: true,

        },
    ],

    formDataDot2: {
        dataSourceId: "",
        dropMark: "",
        dataSource: "",
        dataSourceMark: "",
        dropType: null,
        formulaContent: "",
        formulaDrop: '',
        upperLimit: "",
        lowerLimit: "",
        unit: "",
        cycle: "",
        dataType: "",
        accuracy: "",
        coding: "",
        deviceId: "",
        deviceName: "",
        compress: "",
        authority: null,
        remarks: "",
        dropDescribe: "",
        pointLabels: []
    },
    formObj3: [{
        tag: true,
        label: "点标签",
        prop: "pointLabels",
        itemWidth: true,
    }, ],
}