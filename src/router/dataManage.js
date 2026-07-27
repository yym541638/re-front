const childRouter = [{
        path: '/modelsystem',
        name: "modelsystem",
        meta: {
            name: "模型管理",
            cnName: "数据管理"
        },
        component: resolve => require(["@/views/dataManage/modelsystem.vue"], resolve),
    },
    {
        path: '/powerplantlabel',
        name: "powerplantlabel",
        meta: {
            name: "标签管理",
            cnName: "数据管理"
        },
        component: resolve => require(["@/views/dataManage/powerplantlabel.vue"], resolve),
    },
    {
        path: '/powerplantpoint',
        name: "powerplantpoint",
        meta: {
            name: "点表管理",
            cnName: "数据管理"
        },
        component: resolve => require(["@/views/dataManage/powerplantpoint.vue"], resolve),
    },
    {
        path: '/datasourcegroup',
        name: "datasourcegroup",
        meta: {
            name: "数据源管理",
            cnName: "数据管理"
        },
        component: resolve => require(["@/views/dataManage/datasourcegroup.vue"], resolve),
    },
]
export default childRouter