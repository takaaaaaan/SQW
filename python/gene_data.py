import random
import json
from datetime import datetime

def generate_random_coordinates(bounding_boxes, num_points_per_box):
    """
    指定された複数のBoundingBox内でランダムな座標を生成します。

    Parameters:
    bounding_boxes (list of lists): BoundingBoxのリスト。各BoundingBoxは2つの座標で定義されます [bottom_left, top_right]
    num_points_per_box (int): 各BoundingBoxごとに生成するランダム座標の数

    Returns:
    list of dicts: ランダム座標とタイムスタンプを含む辞書のリスト
    """
    random_coordinates = []
    for box in bounding_boxes:
        min_lat, min_lon = box[0]
        max_lat, max_lon = box[1]
        for _ in range(num_points_per_box):
            latitude = random.uniform(min_lat, max_lat)
            longitude = random.uniform(min_lon, max_lon)
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            random_coordinates.append({"latitude": latitude, "longitude": longitude, "times": timestamp})
    
    return random_coordinates

def save_to_json(data, filename):
    """
    データをJSONファイルに保存します。

    Parameters:
    data (dict): 保存するデータ
    filename (str): 保存するファイルの名前
    """
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

# Bounding boxesの定義
bounding_boxes = [
    [[31.0, 121.8], [34.5, 129.3]],   # 제주도
    [[28.0, 122.0], [31.0, 130.0]],   # 동중국해(제주도 아래)
    [[34.5, 120.1], [35.8, 126.2]],   # 황해 1
    [[35.8, 121.1], [36.8, 126.5]],   # 황해 2
    [[37.3, 128.8], [41.5, 138.5]],   # 동해 아래 1
    [[35.4, 130.5], [41.5, 135.5]],   # 동해 아래 2
    [[41.5, 130.2], [42.5, 139.5]],   # 동해 위
    [[33.58, 127.78], [34.84, 130.26]] # 후쿠오카 한국
]

# 各BoundingBoxごとに生成する点の数
num_points_per_box = 50

# ランダム座標を生成
coordinates = generate_random_coordinates(bounding_boxes, num_points_per_box)

# 必要な形式でデータを整形
formatted_data = {}
for i, coord in enumerate(coordinates):
    identifier = str(random.randint(100000000, 999999999))
    formatted_data[identifier] = {
        coord["times"]: {
            "latitude": coord["latitude"],
            "longitude": coord["longitude"],
            "times": coord["times"]
        }
    }

# データをJSONファイルに保存
json_filename = "json/random_coordinates.json"
save_to_json(formatted_data, json_filename)
