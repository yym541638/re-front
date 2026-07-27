export const tooltip = (params, name) => {
    return {
        show: true,
        trigger: "axis",
        showContent: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        axisPointer: {
            type: "line",
            z: 1,
            lineStyle: {
                color: "#536DFE",
                width: 1,
            },
        },
        itemHeight: 7,
        textStyle: {
            lineHeight: 56,
            fontSize: 10,
        },
        padding: 0,
        formatter: function (format) {
            console.log("mm",format);
            // console.log(30 + 28 * format.length)
            var result = ` <div
                style="height:100%;
                min-height:${30 + 28 * format.length}px;
                width: 200px;
                border-radius:10px;
                background: rgba(255, 255, 255, 0.27);
                "
            >
                <div
                style="
                    width: 100%;
                    height: 30px;
                    padding-left:10px ;
                    background: rgba(0, 0, 0, 0.79);
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 10px;
                    border-radius: 10px 10px 0 0;
                    line-height: 30px;
                    color: #ffffff;
                "
                >
                ${name ? name : format[0].name}
                </div>
                <div
                style="
                    height: 100%;
                    padding-left:10px;
                    width: 100%;
                    border-radius: 3px;
                "
                >
                `;
            format.map((item, index) => {
                console.log(item.value)
                result +=
                    "<div style='height: 28px;line-height:28px;'>" +
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
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