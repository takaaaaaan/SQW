
const firebaseConfig = {
    apiKey: "AIzaSyC6RM-JOezScoTB-vOWhMSXh7sYPpZKyhg",
    authDomain: "asia-404305.firebaseapp.com",
    databaseURL: "https://asia-404305-default-rtdb.firebaseio.com/",
    projectId: "asia-404305",
    storageBucket: "asia-404305.appspot.com",
    messagingSenderId: "838765553299",
    appId: "1:838765553299:web:fbf45f8afe5a80d8d8cf66",
    measurementId: "G-SK4K6MNGVD"
};
firebase.initializeApp(firebaseConfig);

// 地図を初期化する関数
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
    map.addListener('center_changed', function () {
        currentCenter = map.getCenter(); // 現在の中心を取得
    });
}

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

// ページ読み込み時にinitMapを呼び出すためのスクリプト
google.maps.event.addDomListener(window, 'load', initMap);