import os
import requests
import threading
from firebase_admin import credentials, initialize_app, db

# Firebase認証の初期化
current_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(
    current_dir, 'model-craft-391306-firebase-adminsdk-v8jx8-8b0ef4e372.json')
cred = credentials.Certificate(cred_path)
app = initialize_app(
    cred, {'databaseURL': 'https://model-craft-391306-default-rtdb.firebaseio.com/'})

# OpenWeather APIの設定
API_KEY = '1ce37932b6a194f3b844890fe3a6241d'
BASE_URL = 'http://api.openweathermap.org/data/2.5/weather?'

# 指定された座標の範囲
ranges = {
    '한국주변': {'lat': (25.00, 40.00), 'lon': (117.00, 142.00)},
}

# データベースへのリファレンス
ref = db.reference('/pressure_data')


def process_coordinates(key, lat_label, lon_label, center_lat, center_lon):
    url = f'{BASE_URL}lat={center_lat}&lon={center_lon}&appid={API_KEY}'
    response = requests.get(url)
    data = response.json()
    pressure = data['main']['pressure']

    table_name = f"{lat_label}-{lon_label}"

    # データベースに保存
    ref.child(table_name).set(
        {'pressure': pressure, 'latitude': center_lat, 'longitude': center_lon})


def process_table(table_name):
    key = table_name
    lat_range = ranges[key]['lat']
    lon_range = ranges[key]['lon']

    lat_diff = 2
    lon_diff = 2
    lat_labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    threads = []
    for lat_idx in range(0, int((lat_range[1] - lat_range[0]) / lat_diff) + 1):
        for lon_idx in range(0, int((lon_range[1] - lon_range[0]) / lon_diff) + 1):
            lat_label = lat_labels[lat_idx]
            lon_label = f"{lon_idx+1:02d}"

            center_lat = lat_range[0] + lat_idx * lat_diff + lat_diff / 2
            center_lon = lon_range[0] + lon_idx * lon_diff + lon_diff / 2

            thread = threading.Thread(target=process_coordinates, args=(
                key, lat_label, lon_label, center_lat, center_lon))
            thread.start()
            threads.append(thread)

    # 全てのスレッドが終了するのを待つ
    for thread in threads:
        thread.join()


# スレッドを起動
threads = []
for table_name in ranges.keys():
    thread = threading.Thread(target=process_table, args=(table_name,))
    thread.start()
    threads.append(thread)

# 全てのスレッドが終了するのを待つ
for thread in threads:
    thread.join()
