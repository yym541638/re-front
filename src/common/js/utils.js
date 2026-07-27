export default {
    //生成本地文件路径
    convertSrc(file) {
        let URL = window.URL || window.webkitURL;
        return URL.createObjectURL(file);
    },
    // let reg = "/yyyy|MM|dd|HH|mm|ss/g";
    // let format = "yyyy-MM-dd HH:mm:ss";
    sendSeason(value) {
        let month = value.getMonth() + 1;
        console.log(month);
        if (month <= 3) {
            return 1;
        } else if (month <= 6) {
            return 2
        } else if (month <= 9) {
            return 3
        } else if (month <= 12) {
            return 4
        } else {
            return
        }
    },
    sendTime(value, format = "yyyy-MM-dd HH:mm:ss", reg = /yyyy|MM|dd|HH|mm|ss/g) {
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
                    case "mm":
                        return tf(t.getMinutes());
                        break;
                    case "dd":
                        return tf(t.getDate());
                        break;
                    case "HH":
                        return tf(t.getHours());
                        break;
                    case "ss":
                        return tf(t.getSeconds());
                        break;
                }
            });
        }
    },
    sendDateTime(value, format = "HH:mm:ss", reg = /HH|mm|ss/g) {
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
                    // case "yyyy":
                    //     return tf(t.getFullYear());
                    //     break;
                    // case "MM":
                    //     return tf(t.getMonth() + 1);
                    //     break;

                    // case "dd":
                    //     return tf(t.getDate());
                    //     break;
                    case "HH":
                        return tf(t.getHours());
                        break;
                    case "mm":
                        return tf(t.getMinutes());
                        break;
                    case "ss":
                        return tf(t.getSeconds());
                        break;
                }
            });
        }
    },
    onScroll() {
        var wrapDiv = document.getElementById("wrap"); //主体
        var contentDiv = document.getElementById("content"); //内容区
        var sliderWrap = document.getElementById("sliderWrap"); //滚动主体
        var slider = document.getElementById("slider"); //滚动条
        //设置比例
        //clientHeight - 不包括border
        var scale = wrapDiv.clientHeight / contentDiv.clientHeight;
        //设置滑块的高度
        var h1 = sliderWrap.clientHeight * scale;
        //为了合理设置高度，设置滑块的最小高度
        if (h1 < 50) {
            h1 = 50;
        } else if (scale >= 1) {
            //说明当前内容能过完全显示在可视区域内，不需要滚动条
            sliderWrap.style.display = "none";
        }
        //设置滑块的高度
        slider.style.height = h1 + "px";
        //设置y轴的增量
        var y = 0;
        //为wrap添加滚轮事件
        wrapDiv.onmousewheel = function (e) {
            var event1 = event || e;
            if (event.wheelDelta < 0) {
                //滑动条向下滚动
                y += 10;
            } else if (event.wheelDelta > 0) {
                //滑动条向上滚动
                y -= 10;
            }
            //y变化时说明在滚动，此时使滚动条发生滚动，以及设置content内容部分滚动
            //判断极端情况，滑块不能划出屏幕
            if (y <= 0) {
                //滑块最多滑到顶部
                y = 0;
            }
            if (y >= sliderWrap.clientHeight - slider.clientHeight) {
                //滑块最多滑到最底部
                y = sliderWrap.clientHeight - slider.clientHeight;
            }
            //更新滑块的位置
            slider.style.top = y + "px";
            scale = wrapDiv.clientHeight / contentDiv.clientHeight;
            contentDiv.style.top = -y / scale + "px";
        };
    },
}