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
    cred, {'databaseURL': 'https://model-craft-391306.firebaseio.com/'})

# OpenWeather APIの設定
API_KEY = '1ce37932b6a194f3b844890fe3a6241d'
BASE_URL = 'http://api.openweathermap.org/data/2.5/weather?'

# 指定された座標の範囲
ranges = {
    '한국주변': {'lat': (28.16, 40.95), 'lon': (117.01, 142.72)},
}

# データベースへのリファレンス
ref = db.reference('/pressure_data')


def process_coordinates(key, lat_range, lon_range):
    for lat in range(int(lat_range[0]), int(lat_range[1]) + 1, 5):
        for lon in range(int(lon_range[0]), int(lon_range[1]) + 1, 5):
            center_lat = lat + 0.5
            center_lon = lon + 0.5
            url = f'{BASE_URL}lat={center_lat}&lon={center_lon}&appid={API_KEY}'
            response = requests.get(url)
            data = response.json()
            pressure = data['main']['pressure']
            path_key = f'{key}/{center_lat}_{center_lon}'.replace('.', '_')
            ref.child(path_key).set({'pressure': pressure})


def process_table(table_name):
    key = table_name
    lat_range = ranges[key]['lat']
    lon_range = ranges[key]['lon']
    process_coordinates(key, lat_range, lon_range)


# スレッドを起動
threads = []
for table_name in ranges.keys():
    thread = threading.Thread(target=process_table, args=(table_name,))
    thread.start()
    threads.append(thread)

# 全てのスレッドが終了するのを待つ
for thread in threads:
    thread.join()
