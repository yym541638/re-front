export const tooltipitem = (params) => {
    return {
        show: true,
        trigger: "axis",
        showContent: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    // extraCssText:'width:100px;height:30px;',
        axisPointer: {
            type: "none",
            z: 1,
            lineStyle: {
                color: "#000000",
                width: 1,
            },
            shadowStyle:{
                width:30
            }
        },
        itemHeight: 7,
        textStyle: {
            lineHeight: 56,
            fontSize: 10,
        },
        padding: 0,
        formatter: function (format) {
            // console.log(30 + 28 * format.length)
            var result =
             ` <div
                style="height:100%;
                min-height:${30 * (format.length-1)}px;
                width: 150px;
                background: rgba(255, 255, 255, 0.27);
                "
            >
                <div
                style="
                    height: 100%;
                    padding-left:10px;
                    width: 100%;
                "
                >
                `;
            format.map((item, index) => {
                if(item.seriesName == '外框') return;
                result +=
                    "<div style='height: 30px;line-height:30px;'>" +
                    '<span style="display:inline-block;margin-right:5px;border-radius:50px;width:10px;height:10px;background-color:' +
                    item.color +
                    '"></span>' +
                    item.seriesName +
                    "：" +
                    item.value + " " +
                    (params.unit ? params.unit[index] : "");
                ("</div>");
            });
            // result += "剩余寿命：" + num + "%";
            result += "</div>";
            return result;
        },
    }
}