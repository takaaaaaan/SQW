const firebaseConfig = {
  apiKey: "AIzaSyC6RM-JOezScoTB-vOWhMSXh7sYPpZKyhg",
  authDomain: "asia-404305.firebaseapp.com",
  databaseURL: "https://asia-404305-default-rtdb.firebaseio.com/",
  projectId: "asia-404305",
  storageBucket: "asia-404305.appspot.com",
  messagingSenderId: "838765553299",
  appId: "1:838765553299:web:fbf45f8afe5a80d8d8cf66",
  measurementId: "G-SK4K6MNGVD",
};
firebase.initializeApp(firebaseConfig);

function fetchAllCoordinates(callback) {
  const coordinates = [];

  console.log("データベースからのデータ取得を開始します。"); // データ取得開始のログ

  const dbRef = firebase.database().ref();
  dbRef.on("value", (snapshot) => {
    console.log("データベースからデータを取得しました。"); // データ取得成功のログ

    snapshot.forEach((childSnapshot) => {
      const id = childSnapshot.key;
      let maxTimestamp = null;
      let maxTimestampData = null;

      childSnapshot.forEach((timestampSnapshot) => {
        const timestamp = timestampSnapshot.key;
        const data = timestampSnapshot.val();

        console.log(`ID: ${id}, Timestamp: ${timestamp}, Data:`, data); // 各データポイントのログ

        // 最も新しいタイムスタンプのデータを更新
        if (!maxTimestamp || new Date(timestamp) > new Date(maxTimestamp)) {
          maxTimestamp = timestamp;
          maxTimestampData = {
            tableId: id,
            moveKey: timestamp, // タイムスタンプをmoveKeyとして使用
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
            oxg: data.dissolved_oxygen,
            ch: data.chlorophyll,
            tn: data.TN,
            tp: data.TP,
            din: data.DIN,
            dip: data.DIP,
            sd: data.SD,
            value: data.Grade,
          };
        }
      });

      if (maxTimestampData) {
        coordinates.push(maxTimestampData);
      }
    });

    if (coordinates.length > 0) {
      console.log("処理されたデータ: ", coordinates); // 処理されたデータのログ
      callback(coordinates);
    } else {
      console.log("データが見つかりませんでした。"); // データがない場合のログ
    }
  });
}

function getBounds(coordinate, zoomLevel) {
  // 1. zoomLevelに基づいてデルタ値を計算します。zoomLevelが高いほどデルタは小さくなります。
  const delta = 5 / Math.pow(2, zoomLevel);

  // 2. 渡された座標を中心に、計算されたデルタを使って境界を定義します。
  return {
    north: coordinate.lat + delta, // 北の境界
    south: coordinate.lat - delta, // 南の境界
    east: coordinate.lng + delta, // 東の境界
    west: coordinate.lng - delta, // 西の境界
  };
}
// エレメントを表示する関数
// function showMessage() {
//   document.getElementById('message').style.display = 'block';
// }
const rectangles = [];
let existingRectangles = [];

function clearRectangles() {
  rectangles.forEach((rectObj) => {
    rectObj.rectangle.setMap(null);
  });
  rectangles.length = 0;
}

function clearRectangles() {
  rectangles.forEach((rectObj) => {
    rectObj.rectangle.setMap(null);
  });
  rectangles.length = 0;
}

function initMap() {
  // 地図を指定されたオプションで初期化
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 35.9078, lng: 127.7669 }, // 中心をSouth Koreaに設定
    mapTypeId: "terrain",
    styles: [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#bdbdbd",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#e5e5e5",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#dadada",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          {
            color: "#e5e5e5",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#0B2161",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
    ],
    disableDefaultUI: true,
  });
  // 地図の中心が変更されたときのイベントリスナーを追加
  map.addListener("center_changed", function () {
    currentCenter = map.getCenter(); // 現在の中心を取得
  });

  // 4. 値に基づいて色を取得する関数
  function getColorByValue(value) {
    switch (value) {
      case 1:
        return "#9fc5e8";
      case 2:
        return "#a4d39c";
      case 3:
        return "#ffec94";
      case 4:
        return "#ffd29a";
      case 5:
        return "#ff9c9c";
      default:
        return "#ffffff";
    }
  }
  // 長方形がクリックされたときの処理を追加
  function attachRectangleClickHandler(rectangle, coordinate) {
    google.maps.event.addListener(rectangle, "click", function () {
      showRectangleInfo(coordinate);
    });
  }

  // content2とその中のboxに情報を表示する関数
  function showRectangleInfo(coordinate) {
    var content2 = document.querySelector(".col-2");
    var box = content2.querySelector(".box");

    content2.style.display = "block"; // content2を表示
    box.innerHTML = ""; // boxの以前の内容をクリア

    // 指定された座標に関連するデータを検索し、表示します。
    const dbRef = firebase.database().ref();
    dbRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        childSnapshot.forEach((timestampSnapshot) => {
          const data = timestampSnapshot.val();
          if (
            parseFloat(data.latitude) === coordinate.lat &&
            parseFloat(data.longitude) === coordinate.lng
          ) {
            // 情報をboxに追加
            box.innerHTML += `<p>Timestamp: ${timestampSnapshot.key}</p>`;
            box.innerHTML += `<p>Latitude: ${data.latitude}</p>`;
            box.innerHTML += `<p>Longitude: ${data.longitude}</p>`;
            box.innerHTML += `<p>Dissolved Oxygen: ${data.dissolved_oxygen}</p>`;
            box.innerHTML += `<p>Chlorophyll: ${data.chlorophyll}</p>`;
            box.innerHTML += `<p>TN: ${data.TN}</p>`;
            box.innerHTML += `<p>TP: ${data.TP}</p>`;
            box.innerHTML += `<p>DIN: ${data.DIN}</p>`;
            box.innerHTML += `<p>DIP: ${data.DIP}</p>`;
            box.innerHTML += `<p>SD: ${data.SD}</p>`;
            box.innerHTML += `<p>Grade: ${data.Grade}</p>`;
          }
        });
      });
    });
  }

  // 좌표 찍는 함수
  fetchAllCoordinates((coordinates) => {
    clearRectangles();
    // 1. 全ての座標を取得します。
    coordinates.forEach((coordinate, index) => {
      // 2. それぞれの座標に対して長方形を作成します。
      const rectangle = new google.maps.Rectangle({
        // 長方形の属性を設定します。
        strokeColor: getColorByValue(coordinate.value),
        strokeOpacity: 0,
        strokeWeight: 1,
        fillColor: getColorByValue(coordinate.value),
        fillOpacity: 0.6,
        map,
        zIndex: coordinate.value,
        bounds: getBounds(coordinate, map.getZoom()),
      });

      // 3. 長方形と座標を配列に保存します。
      rectangles.push({ rectangle: rectangle, coordinate: coordinate });
      attachRectangleClickHandler(rectangle, coordinate);
    });

    google.maps.event.addListener(map, "zoom_changed", function () {
      // 6. 地図のズームが変更された場合の処理を追加します。
      const currentCenter = map.getCenter();
      rectangles.forEach((rect) => {
        rect.rectangle.setBounds(getBounds(rect.coordinate, map.getZoom()));
        // 7. 各長方形の境界を更新します。
      });
      map.setCenter(currentCenter);
      // 8. 地図の中心を現在の中心に設定します。
    });
  });
}

// 좌표 찍는 함수
//   fetchAllCoordinates((coordinates) => {
//     clearRectangles();

//     coordinates.forEach((coordinate, index) => {
//       // 座標データのログ出力
//       console.log(`座標 ${index}: 緯度 ${coordinate.lat}, 経度 ${coordinate.lng}`);

//       // 長方形を作成
//       const bounds = getBounds(coordinate, map.getZoom());
//       console.log(`座標 ${index} の境界:`, bounds);  // 境界のログ出力

//       const rectangle = new google.maps.Rectangle({
//         strokeColor: getColorByValue(coordinate.value),
//         strokeOpacity: 0,
//         strokeWeight: 1,
//         fillColor: getColorByValue(coordinate.value),
//         fillOpacity: 0.6,
//         map,
//         zIndex: coordinate.value,
//         bounds: bounds,
//       });

//       rectangles.push({ rectangle: rectangle, coordinate: coordinate });
//       attachRectangleClickHandler(rectangle, coordinate);
//     });

//     google.maps.event.addListener(map, "zoom_changed", function () {
//       // 6. 地図のズームが変更された場合の処理を追加します。
//       const currentCenter = map.getCenter();
//       rectangles.forEach((rect) => {
//         rect.rectangle.setBounds(getBounds(rect.coordinate, map.getZoom()));
//         // 7. 各長方形の境界を更新します。
//       });
//       map.setCenter(currentCenter);
//       // 8. 地図の中心を現在の中心に設定します。
//     });
//   });
// }

function fetchCoordinateDataByPosition(coordinate, callback) {
  // 1. グローバル変数から指定された座標に一致するデータを検索します。
  const foundCoordinate = window.coordinatesData.find(
    (coord) => coord.lat === coordinate.lat && coord.lng === coordinate.lng
  );

  // 2. 見つかったデータをコールバック関数に渡します。見つからなかった場合はnullを渡します。
  if (foundCoordinate) {
    callback(foundCoordinate); // 3. データが見つかった場合、コールバックでそれを返します。
  } else {
    callback(null); // 4. データが見つからない場合、コールバックでnullを返します。
  }
}

window.coordinatesData = null; // 座標データの初期値をnullに設定
