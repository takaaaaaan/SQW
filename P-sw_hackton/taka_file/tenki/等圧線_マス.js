
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: { lat: 30, lng: 130 }
    });

    var ranges = {
        '한국주변': { 'lat': [25.00, 42.00], 'lon': [117.00, 142.00] },
    };
    //分ける数
    const lat_main = 72
    const lon_main = 120
    // const lat_main = 18
    // const lon_main = 30
    // 線の太さ  
    const strokeWeight_num = 0.2

    for (var rangeKey in ranges) {
        var range = ranges[rangeKey];

        // 緯度と経度の範囲を計算
        var latRange = range.lat[1] - range.lat[0];
        var lonRange = range.lon[1] - range.lon[0];

        // 緯度と経度の間隔を計算
        var latStep = latRange / lat_main;
        var lonStep = lonRange / lon_main;

        // 縦の線を描画
        for (var i = 0; i <= lon_main; i++) {
            var lng = range.lon[0] + i * lonStep;
            var path = [
                { lat: range.lat[0], lng: lng },
                { lat: range.lat[1], lng: lng },
            ];
            new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#242b3d',
                strokeOpacity: 1.0,
                strokeWeight: strokeWeight_num,
                map: map
            });
        }

        // 横の線を描画
        for (var i = 0; i <= lat_main; i++) {
            var lat = range.lat[0] + i * latStep;
            var path = [
                { lat: lat, lng: range.lon[0] },
                { lat: lat, lng: range.lon[1] },
            ];
            new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#242b3d',
                strokeOpacity: 1.0,
                strokeWeight: strokeWeight_num,
                map: map
            });
        }
    }
}


// // Firebaseの設定
// var firebaseConfig = {
//     apiKey: "AIzaSyA9OJf8_t3cQ6cnX-GCEZX5kpDxcq3us2A",
//     authDomain: "model-craft-391306.firebaseapp.com",
//     databaseURL: "https://model-craft-391306.firebaseio.com/",
//     projectId: "model-craft-391306",
//     storageBucket: "model-craft-391306.appspot.com",
//     messagingSenderId: "54080375203",
//     appId: "1:54080375203:web:2c7553ce4a44a6e96cb216",
//     measurementId: "G-GN648GFCTK"
// };;
// firebase.initializeApp(firebaseConfig);

//     データベースからデータを取得
//     var ref = firebase.database().ref('/pressure_data');
//     ref.once('value').then(function (snapshot) {
//         var data = snapshot.val();
//         var values = [];
//         var gridSize = 10; // グリッドサイズを調整する

//         // アルファベットと数字の組み合わせを考慮
//         var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

//         for (var i = 0; i < gridSize; i++) {
//             values[i] = [];
//             for (var j = 0; j < gridSize; j++) {
//                 var alphabetPart = alphabets[i];
//                 var numberPart = String(j + 1).padStart(2, '0'); // 2桁になるように0でパディング
//                 var key = alphabetPart + '-' + numberPart;
//                 values[i][j] = data[key] ? data[key].pressure : null;
//             }
//         }