// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyA9OJf8_t3cQ6cnX-GCEZX5kpDxcq3us2A",
  authDomain: "model-craft-391306.firebaseapp.com",
  databaseURL: "https://model-craft-391306-default-rtdb.firebaseio.com",
  projectId: "model-craft-391306",
  storageBucket: "model-craft-391306.appspot.com",
  messagingSenderId: "54080375203",
  appId: "1:54080375203:web:2c7553ce4a44a6e96cb216",
  measurementId: "G-GN648GFCTK",
};

// Firebaseの初期化
firebase.initializeApp(firebaseConfig);

// 指定座標とズームレベルから境界を取得する関数
function getBounds(coordinate, zoomLevel) {
  const delta = 5 / Math.pow(2, zoomLevel);
  return {
    north: coordinate.lat + delta,
    south: coordinate.lat - delta,
    east: coordinate.lng + delta,
    west: coordinate.lng - delta,
  };
}

const rectangles = []; // 矩形を保存する配列

// 地図の初期化関数
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 35.9078, lng: 127.7669 },
    mapTypeId: "terrain",
    disableDefaultUI: true,
  });

  // 値に基づいて色を取得する関数
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
        return "#eaeaea";
    }
  }

  // すべての座標を取得して矩形を描画
  fetchAllCoordinates((coordinates) => {
    coordinates.forEach((coordinate) => {
      const rectangle = new google.maps.Rectangle({
        strokeColor: getColorByValue(coordinate.value),
        strokeOpacity: 0,
        strokeWeight: 1,
        fillColor: getColorByValue(coordinate.value),
        fillOpacity: 0.6,
        map,
        zIndex: coordinate.value,
        bounds: getBounds(coordinate, map.getZoom()),
      });

      rectangles.push({ rectangle: rectangle, coordinate: coordinate });
    });

    // ズーム変更時に矩形の境界を更新
    google.maps.event.addListener(map, "zoom_changed", function () {
      const zoomLevel = map.getZoom();
      rectangles.forEach((rect) => {
        rect.rectangle.setBounds(getBounds(rect.coordinate, zoomLevel));
      });
    });

    // 検索機能
    // 1. 検索用の入力フィールドとボタンを取得します
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    // 2. 検索ボタンにクリックイベントリスナーを追加します。
    searchButton.addEventListener("click", () => {
      // 3. 入力フィールドから検索クエリを取得し、小文字に変換します。
      const searchQuery = searchInput.value.toLowerCase();

      // 4. rectangles配列から、検索クエリにマッチする座標を見つけます。
      const foundCoordinate = rectangles.find((rect) => {
        return rect.coordinate.area.toLowerCase().includes(searchQuery);
      });

      // 5. マッチする座標が見つかった場合、その座標にズームインします。
      if (foundCoordinate) {
        const zoomLevel = 1;
        const bounds = getBounds(foundCoordinate.coordinate, zoomLevel);
        map.fitBounds(new google.maps.LatLngBounds(bounds));
      } else {
        // 6. マッチする座標が見つからなかった場合、コンソールにメッセージを出力します。
        console.log("検索結果なし");
      }
    });
  });
}

// Firebaseから座標を取得する関数
function fetchAllCoordinates(callback) {
  const promises = [];

  for (let i = 1; i <= 50; i++) {
    const id = "A-" + String(i).padStart(2, "0");
    const dbRef = firebase.database().ref(id);
    promises.push(
      dbRef.once("value").then((snapshot) => {
        const coordinates = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const coordinate = {
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
            value: data.Grade,
            area: data.area,
          };

          if (!isNaN(coordinate.lat) && !isNaN(coordinate.lng)) {
            coordinates.push(coordinate);
          }
        });

        return coordinates;
      })
    );
  }

  Promise.all(promises)
    .then((results) => {
      const allCoordinates = results.flat();
      callback(allCoordinates);
    })
    .catch((error) => {
      console.log("データの読み取りに失敗しました:", error);
    });
}
