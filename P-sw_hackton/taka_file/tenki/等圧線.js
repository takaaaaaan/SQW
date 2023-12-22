// 地図の初期化と等圧線の描画を行う関数
function initMap() {
    // 地図の初期化
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: { lat: (25.00 + 42.00) / 2, lng: (117.00 + 142.00) / 2 },
    });

    // 指定された範囲
    var ranges = {
        '한국주변': { 'lat': [25.00, 42.00], 'lon': [117.00, 142.00] }
    };

    // JSONデータの読み込み
    fetch('pressure.json')
        .then((response) => response.json())
        .then((data) => {
            // データの準備
            var values = [];
            for (var key in data.pressure_data) {
                var item = data.pressure_data[key];
                if (item.latitude >= ranges['한국주변'].lat[0] && item.latitude <= ranges['한국주변'].lat[1] &&
                    item.longitude >= ranges['한국주변'].lon[0] && item.longitude <= ranges['한국주변'].lon[1]) {
                    values.push([item.latitude, item.longitude, item.pressure]);
                }
            }

            // 等圧線の計算
            var contours = d3.contours()
                .size([ranges['한국주변'].lon[1] - ranges['한국주변'].lon[0], ranges['한국주변'].lat[1] - ranges['한국주변'].lat[0]])
                .thresholds(d3.range(980, 1040, 1))
                (values.map((d) => d[2]));

            // 等圧線の描画
            contours.forEach((contour) => {
                var path = contour.coordinates.map((d) => {
                    return { lat: d[0] + ranges['한국주변'].lat[0], lng: d[1] + ranges['한국주변'].lon[0] };
                });
                new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map,
                });
            });
        });
}