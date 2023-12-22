const firebaseConfig = {
    apiKey: "AIzaSyA9OJf8_t3cQ6cnX-GCEZX5kpDxcq3us2A",
    authDomain: "model-craft-391306.firebaseapp.com",
    databaseURL: "https://model-craft-391306.firebaseio.com/",
    projectId: "model-craft-391306",
    storageBucket: "model-craft-391306.appspot.com",
    messagingSenderId: "54080375203",
    appId: "1:54080375203:web:2c7553ce4a44a6e96cb216",
    measurementId: "G-GN648GFCTK"
};

// Firebaseを初期化します
firebase.initializeApp(firebaseConfig);

function fetchAllCoordinates(callback) {
    const coordinates = [];
    const dbRef = firebase.database().ref('A-01');

    dbRef.once("value").then((snapshot) => {
        snapshot.forEach((moveSnapshot) => {
            const moveKey = moveSnapshot.key; // move01, move02, ...
            const data = moveSnapshot.val();
            const coordinate = {
                tableId: 'A-01',
                moveKey,
                lat: parseFloat(data.Latitude),
                lng: parseFloat(data.Longitude),
                value: data.Grade,
            };

            if (!isNaN(coordinate.lat) && !isNaN(coordinate.lng)) {
                coordinates.push(coordinate);
            }
        });

        // 가져온 데이터를 콜백 함수에 전달
        callback(coordinates);

        // 데이터 확인을 위한 콘솔 로그
        console.log("Fetched Coordinates:", coordinates);
    }).catch((error) => {
        console.log("Error fetching data:", error);
    });
}


function getBounds(coordinate, zoomLevel) {
    // 1. zoomLevelに基づいてデルタ値を計算します。zoomLevelが高いほどデルタは小さくなります。
    const delta = 5 / Math.pow(2, zoomLevel);

    // 2. 渡された座標を中心に、計算されたデルタを使って境界を定義します。
    return {
        north: coordinate.lat + delta, // 北の境界
        south: coordinate.lat - delta, // 南の境界
        east: coordinate.lng + delta,  // 東の境界
        west: coordinate.lng - delta,  // 西の境界
    };
}

const rectangles = [];
// 21.7255912752175, 118.26739514482993
function initMap() {
    // 地図を指定されたオプションで初期化
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 21.725591, lng: 118.267395 }, // 中心をSouth Koreaに設定
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
    const placesDictionary = {
        "황해": { lat: 36.180065, lng: 123.033483, zoom: 7 },
        "동해": { lat: 39.82878758630755, lng: 134.2263995949388, zoom: 7 },
        "남해": { lat: 33.826896, lng: 128.127185, zoom: 7 },
        "울산": { lat: 35.2060749, lng: 130.2670383, zoom: 9 },
        "제주도": { lat: 33.187485, lng: 125.8084014, zoom: 8 },
        // 他の座標を追加
    };
    // const searchContainer = document.getElementById("search-container");
    // const searchButton = document.getElementById("search-button");
    // const searchInput = document.getElementById("search-input");

    // searchButton.addEventListener("click", () => {
    //   searchContainer.classList.toggle("active");
    //   searchInput.focus();
    // });
    const searchContainer = document.getElementById("search-container");
    const customSearchInput = document.getElementById("search-input");
    const customSearchButton = document.getElementById("search-button");
    const messageDiv = document.getElementById("message");
    customSearchButton.addEventListener("click", () => {
        if (searchContainer.classList.contains('active')) {
            searchContainer.classList.remove('active'); // 비활성 상태의 스타일 적용
        } else {
            searchContainer.classList.add('active'); // 활성 상태의 스타일 적용
            customSearchInput.focus();
        }
        const query = customSearchInput.value;
        const place = placesDictionary[query];
        if (place) {
            // 座標とズームレベルに基づいてマップを更新
            map.setCenter({ lat: place.lat, lng: place.lng });
            map.setZoom(place.zoom);
        } else {
            messageDiv.textContent = "지역 등록이 안되어있는지역입니다. 지역 등록해주시면 감사합니다."; // メッセージをクリア
            // 5秒後にメッセージをクリア
            setTimeout(() => {
                messageDiv.textContent = "";
            }, 3000);
            console.log("該当する場所がありません");
        }
    });

    // 地図の中心が変更されたときのイベントリスナーを追加
    map.addListener('center_changed', function () {
        currentCenter = map.getCenter(); // 現在の中心を取得
    });

    // 地図のズームが変更されたときのイベントリスナーを追加
    map.addListener('zoom_changed', function () {
        currentZoom = map.getZoom(); // 現在のズームレベルを取得
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
                return "#00000000";
        }
    }

    // 좌표 찍는 함수
    fetchAllCoordinates((coordinates) => {
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