import api from "../api/base";
export const dataField = {
    data() {
        return {
            fieldType: ["listShow", "searchShow", "editShow"],
            titles: {},
            tableTitle: [],
            editTitles: [],
            searchTitle: [],
            sendSearchTitle: [],
            EnumLists: {},
            EnumListFilters: {}
        }
    },
    methods: {
        async getDataFieldVoListByPo(dataModelId, type) {
            let res1 = await api.getDataFieldVoListByPo({
                dataModelId: dataModelId,
                listShow: true
            });
            if (res1.code == 0) {
                this.tableTitle = res1.data;
            }
            let res2 = await api.getDataFieldVoListByPo({
                dataModelId: dataModelId,
                editShow: true
            });
            if (res2.code == 0) {
                this.editTitles = res2.data;
                this.editTitles.map(async item => {
                    if (item.fontendType == "select") {
                        this.getEnumerateVoListByPo(item.enumTypeId);
                    } 
                    // else if (item.fontendType == "selectvalueFTA") {
                    //     let params = {};
                    //     if (item.relatedFieldName && item.propName) {
                    //         params[item.relatedFieldName] = item.propName;
                    //     }
                    //     let res = await api.VoListByPo(
                    //         params,
                    //         item.relatedModelName,
                    //         item.nacos
                    //     );
                    //     if (res.code == 0) {
                    //         item["data"] = res.data;
                    //     } else {
                    //         item["data"] = []
                    //     }
                    // } else if (item.fontendType == 'searchSelect') {
                    //     let res = await api.VoListByPo(
                    //         {},
                    //         item.relatedModelName,
                    //         item.nacos
                    //     );
                    //     if (res.code == 0) {
                    //         item["data"] = res.data;
                    //     } else {
                    //         item["data"] = []
                    //     }
                    // }
                })
            }
            let res3 = await api.getDataFieldVoListByPo({
                dataModelId: dataModelId,
                searchShow: true
            });
            if (res3.code == 0) {
                this.searchTitle = res3.data;
                this.sendSearchTitle = this.searchTitle.filter(
                    (v) => v.defaultValue
                )
                this.searchTitle.map((item) => {
                    if (item.fontendType == "select") {
                        this.getEnumerateVoListByPo(item.enumTypeId);
                    }
                });
            }
        },
        async getEnumerateVoListByPos(typeId) {
            let res = await api.getEnumerateVoListByPo({
                typeId: typeId //用户状态枚举类型
            });
            if (res.code == 0) {
                this.EnumLists[typeId] = res.data;
                let obj = {}
                res.data.map(item => {
                    obj[item.enumValue] = item.name
                });
                // console.log(this.EnumList)
                this.EnumListFilters[typeId] = obj
            }
        }
    }
}