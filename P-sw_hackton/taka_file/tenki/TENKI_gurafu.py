import requests
import matplotlib.pyplot as plt


def get_pressure_from_api(lat, lon, api_key):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"
    response = requests.get(url)
    data = response.json()
    pressure = data['main']['pressure']
    return pressure


api_key = "53f03c9d9f0082bec25f418ff553df6e"  # あなたのAPIキーを入力
ranges = {
    '제주도 ': {'lat': (31.0, 34.50), 'lon': (121.8, 129.3)},
    # '동중국해(제주도 아래)': {'lat': (28.0, 31.0), 'lon': (122.0, 130.0)},
    # '황해 1': {'lat': (34.5, 35.8), 'lon': (120.1, 126.20)},
    # '황해 2': {'lat': (35.8, 36.8), 'lon': (121.1, 126.50)},
    # '동해 아래 1': {'lat': (37.3, 41.5), 'lon': (128.8, 138.5)},
    # '동해 아래 2': {'lat': (35.4, 41.5), 'lon': (130.5, 135.5)},
    # '동해 위': {'lat': (41.5, 42.5), 'lon': (130.2, 139.5)},
    # '후쿠오카 한국': {'lat': (33.58, 34.84), 'lon': (127.78, 130.26)},
}
# 各地域に対して処理を実施
for region, coords in ranges.items():
    lats = []
    lons = []
    colors = []

    lat_min, lat_max = coords['lat']
    lon_min, lon_max = coords['lon']

    # 0.5ずつ緯度経度を区切る
    for lat in range(int(lat_min * 2), int(lat_max * 2)):
        for lon in range(int(lon_min * 2), int(lon_max * 2)):
            lat_center = lat / 2
            lon_center = lon / 2
            pressure = get_pressure_from_api(lat_center, lon_center, api_key)

            lats.append(lat_center)
            lons.append(lon_center)

            # 気圧に応じて色を細分化
            if pressure >= 1030:
                colors.append('darkblue')
            elif pressure >= 1013:
                colors.append('blue')
            elif pressure >= 1000:
                colors.append('lightblue')
            elif pressure >= 990:
                colors.append('pink')
            elif pressure >= 970:
                colors.append('red')
            else:
                colors.append('darkred')

    # 図の作成
    fig, ax = plt.subplots()
    plt.title(region)  # 地域名をタイトルとして追加
    plt.scatter(lats, lons, c=colors)
    plt.xlabel('Latitude')
    plt.ylabel('Longitude')
    plt.show()
