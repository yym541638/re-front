// // AMap.js
// // 高德map   https://webapi.amap.com/maps?v=1.4.11&key=你的高德地图的key
// export default function MapLoader() {
//   return new Promise((resolve, reject) => {
//     if (window.AMap) {
//       resolve(window.AMap)
//     } else {
//       var script = document.createElement('script')
//       script.type = 'text/javascript'
//       script.async = true
//       script.src =
//         'http://webapi.amap.com/maps?v=1.4.11&callback=initAMap&key=9a05b62190098a75f7d848ca491c33eb'
//       script.onerror = reject
//       document.head.appendChild(script)
//     }
//     window.initAMap = () => {
//       resolve(window.AMap)
//     }
//   })
// }

function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      // 'http://webapi.amap.com/maps?v=1.4.11&callback=initAMap&key=9a05b62190098a75f7d848ca491c33eb'
      script.src =
        'http://webapi.amap.com/maps?v=1.4.11&callback=initAMap&key=99f06902e509961cf2ec3c4cf1aed0aa'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}

//地图创建
export async function createdMap(eventfn = { onComplete: function () { }, onError: function () { } }) {
  let AMap = await MapLoader();
  AMap.plugin("AMap.Geolocation", function () {
    var geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
      // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
      buttonOffset: new AMap.Pixel(10, 20),
      //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      zoomToAccuracy: true,
      //  定位按钮的排放位置,  RB表示右下
      buttonPosition: "RB"
    });
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, "complete", eventfn.onComplete);
    AMap.event.addListener(geolocation, "error", eventfn.onError);
  });

  return AMap
}

//地图遮罩
export async function DistrictMap(search = { keyword: "明光市", onSearch: function () { }, id: "", map: "" }) {
  let AMap = await MapLoader();
  var district = null
  AMap.plugin("AMap.DistrictSearch", function () {
    var opts = {
      extensions: 'all',
      subdistrict: 0
    };
    //实例化DistrictSearch
    district = new AMap.DistrictSearch(opts);
    // district.setLevel('district');
    district.search("明光市", search.onSearch)
  });

  return AMap
}
//模糊查询
export async function searchMap(search = { adress: "", onSearch: function () { }, id: "", map: "" }, map) {
  map.plugin('AMap.Autocomplete', function () {
    // 实例化Autocomplete
    var autoOptions = {
      city: "全国",
      autoFitView: true
    }
    var autoComplete = new AMap.Autocomplete(autoOptions);
    autoComplete.search(search.adress, search.onSearch)
  })
  return AMap
}
//经纬度逆向解析
export async function lnglanMap(search = { adress: "", onSearch: function () { }, }, map) {
  map.plugin('AMap.Geocoder', function () {
    // 实例化Autocomplete
    var autoOptions = {
      city: "全国",
      autoFitView: true
    }
    var geocoder = new AMap.Geocoder(autoOptions);
    geocoder.getAddress(search.adress, search.onSearch)
  })
  return AMap
}
//添加marker
export async function mapMark(map, position, icon) {
  let AMap = await MapLoader();
  var startMarker = new AMap.Marker({
    position: position,
    icon: icon
  });
  console.log(startMarker)
  // 将 markers 添加到地图
  map.add(startMarker);
  map.setFitView();
};



