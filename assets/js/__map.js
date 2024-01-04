const firebaseConfig = {
  apiKey: "AIzaSyAx1xUEgJ3-t-NUb5kiXgFTysReX_BVf4c",
  authDomain: "mega-blue.firebaseapp.com",
  databaseURL:
    "https://mega-blue-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mega-blue",
  storageBucket: "mega-blue.appspot.com",
  messagingSenderId: "878936419008",
  appId: "1:878936419008:web:c8051dd8868ff9c17cdb25",
  measurementId: "G-YKWS3HBW98",
};
firebase.initializeApp(firebaseConfig);

/* TODO */
function fetchGradeDataAndDisplayChart() {
  const dbRef = firebase.database().ref();
  dbRef.once("value", (snapshot) => {
    const data = snapshot.val();
    const gradeCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // 각 Grade의 개수 집계
    for (const id in data) {
      for (const time in data[id]) {
        const grade = data[id][time].Grade;
        if (gradeCounts.hasOwnProperty(grade)) {
          gradeCounts[grade]++;
        }
      }
    }

    // 차트 데이터 준비
    const chartData = {
      labels: Object.keys(gradeCounts),
      datasets: [
        {
          label: "Grade Counts",
          data: Object.values(gradeCounts),
          backgroundColor: ["red", "orange", "yellow", "green", "blue"],
        },
      ],
    };

    // 원형 차트 생성
    const ctx = document.getElementById("gradeChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: chartData,
    });
  });
}

// 함수 호출
fetchGradeDataAndDisplayChart();

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
      console.log(coordinates);
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
      track(coordinate); /* TODO */
    });
  }

  /* TODO */
  function calculateDistance(coord1, coord2) {
    const R = 6371; // 지구 반지름 (km)
    const lat1 = (coord1[0] * Math.PI) / 180;
    const lon1 = (coord1[1] * Math.PI) / 180;
    const lat2 = (coord2[0] * Math.PI) / 180;
    const lon2 = (coord2[1] * Math.PI) / 180;

    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;

    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));

    return R * c;
  }

  /* TODO */
  function showTrackInfo(data) {
    var box = document.querySelector(".widget-content2");
    box.innerHTML = ""; // boxの以前の内容をクリア
    let htmlContent = "";
    data.forEach((item, index) => {
      htmlContent += `<p>Time - ${item.timeStr}, ID - ${item.shipId}</p>`;
    });

    // box 요소의 내용 업데이트
    box.innerHTML = htmlContent;
  }

  /* TODO */
  function track(dataa) {
    const dbRef = firebase.database().ref();

    dbRef.once("value", (snapshot) => {
      const data = snapshot.val();
      let grade5Ship = null;
      let grade5Time = null;
      let grade5Coords = null;

      for (let shipId in data) {
        for (let timeStr in data[shipId]) {
          const record = data[shipId][timeStr];
          if (record["Grade"] === 5) {
            grade5Ship = shipId;
            grade5Time = new Date(timeStr);
            grade5Coords = [record["latitude"], record["longitude"]];
            break;
          }
        }
        if (grade5Ship) break;
      }

      // 다른 선박들과의 거리 계산
      let shipDistances = [];
      if (grade5Ship) {
        for (let shipId in data) {
          if (shipId !== grade5Ship) {
            for (let timeStr in data[shipId]) {
              const record = data[shipId][timeStr];
              const recordTime = new Date(timeStr);
              if (recordTime < grade5Time) {
                const coords = [record["latitude"], record["longitude"]];
                const distance = calculateDistance(grade5Coords, coords);
                shipDistances.push({ shipId, coords, distance, timeStr });
              }
            }
          }
        }
      }

      // 거리에 따라 정렬하고 상위 3개 선박 선택
      const closestShips = shipDistances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      console.log(closestShips);
      showTrackInfo(closestShips);
    });
  }

  /* TODO */
  function showRectangleInfo(coordinate) {
    var content2 = document.querySelector(".content2");
    var box = document.querySelector(".widget-content1");

    content2.style.display = "block"; // content2を表示
    box.innerHTML = ""; // boxの以前の内容をクリア

    // 指定された座標に関連するデータを検索し、表示します。
    const dbRef = firebase.database().ref();
    dbRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        childSnapshot.forEach((timestampSnapshot) => {
          const data = timestampSnapshot.val();

          // timestampSnapshot.key 값을 파싱하여 UTC 시간으로 처리
          var utcTimestamp = new Date(timestampSnapshot.key + "Z");

          // 로컬 시간으로 변환 (toLocaleString 사용)
          var kstTimestamp = utcTimestamp.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });

          if (
            parseFloat(data.latitude) === coordinate.lat &&
            parseFloat(data.longitude) === coordinate.lng
          ) {
            // 情報をboxに追加
            box.innerHTML += `<p>시각: ${kstTimestamp}</p>`;
            box.innerHTML += `<p>위도: ${parseFloat(data.latitude).toFixed(
              2
            )}</p>`;
            box.innerHTML += `<p>경도: ${parseFloat(data.longitude).toFixed(
              2
            )}</p>`;
            box.innerHTML += `<p>산소량: ${parseFloat(
              data.dissolved_oxygen
            ).toFixed(2)}</p>`;
            box.innerHTML += `<p>엽록소 수치: ${parseFloat(
              data.chlorophyll
            ).toFixed(2)}</p>`;
            box.innerHTML += `<p>질소 농도: ${parseFloat(data.TN).toFixed(
              2
            )}</p>`;
            box.innerHTML += `<p>인 농도: ${parseFloat(data.TP).toFixed(
              2
            )}</p>`;
            box.innerHTML += `<p>무기질소: ${parseFloat(data.DIN).toFixed(
              2
            )}</p>`;
            box.innerHTML += `<p>무기인: ${parseFloat(data.DIP).toFixed(
              2
            )}</p>`;
            box.innerHTML += `<p>투명도: ${parseFloat(data.SD).toFixed(2)}</p>`;
            box.innerHTML += `<p>오염도 수치: ${data.Grade}</p>`;
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
