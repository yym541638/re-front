let dataId = [];
export default {
    /**递归返回所需值
 * 
 * @param {*} arr 需要递归的数组 array
 * @param {*} key 所对应值的key字段 string
 * @returns 
 */
    retrunKeyValArr(arr, key) {
        arr.map((item) => {
            dataId.push(item[key]);
            if (item.children && item.children.length > 0) {
                retrunKeyValArr(item.children, key);
            } else {
                dataId.push(item[key]);
            }
        });
        return [...new Set(dataId)];
    },
    /**
     * 动态图片引入
     * @param {*} name 图片名称
     * @param {*} file 图片存在的目录名称
     * @returns 
     */
    requireImg(name, file, path) {
        return require("../assets/" + file + "/" + name + ".png")
    },
    /**下载文件
     * @param {*} url 文件路径
     */
    downFile(url) {
        const a = document.createElement('a'); // 创建a标签
        a.setAttribute('target', '_blank');// download属性
        a.setAttribute('download', '');// download属性
        a.setAttribute('href', url);// href链接
        a.click();// 自执行点击事件
    },
    getDateYMD(value, format = "yyyy-MM-dd", reg = /yyyy|MM|dd/g) {
        value = parseInt(value);
        if (value == "" || value == undefined || value === null || isNaN(value)) {
            return (value = "");
        } else {
            let t = new Date(value);
            let tf = function (i) {
                return (i < 10 ? "0" : "") + i;
            };
            return format.replace(reg, function (a) {
                switch (a) {
                    case "yyyy":
                        return tf(t.getFullYear());
                        break;
                    case "MM":
                        return tf(t.getMonth() + 1);
                        break;

                    case "dd":
                        return tf(t.getDate());
                        break;
                        // case "HH":
                        //     return tf(t.getHours());
                        //     break;
                        // case "mm":
                        //     return tf(t.getMinutes());
                        //     break;
                        // case "ss":
                        //     return tf(t.getSeconds());
                        //     break;
                }
            });
        }
    },
}