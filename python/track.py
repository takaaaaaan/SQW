import math
from datetime import datetime
import json

# Haversine 공식을 이용한 거리 계산
def calculate_distance(coord1, coord2):
    # 라디안으로 변환
    lat1, lon1 = map(math.radians, coord1)
    lat2, lon2 = map(math.radians, coord2)

    # 위도와 경도 차이
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine 공식
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))

    # 지구 반지름(킬로미터)
    R = 6371

    return c * R

# JSON 데이터 파싱
with open('above3.json', 'r') as json_data:
    data = json.load(json_data)

# 변수 초기화 및 Grade 5 선박 찾기
grade_5_ship = None
grade_5_time = None
grade_5_coords = None

for ship_id, ship_data in data.items():
    for time_str, record in ship_data.items():
        if record['Grade'] == 5:
            grade_5_ship = ship_id
            grade_5_time = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
            grade_5_coords = (record['latitude'], record['longitude'])
            print(grade_5_ship, grade_5_time, grade_5_coords)
            break
    if grade_5_ship:
        break

# 다른 선박들과의 거리 계산 및 시간 필터링
if grade_5_ship:
    ship_distances = []
    for ship_id, ship_data in data.items():
        if ship_id != grade_5_ship:
            for time_str, record in ship_data.items():
                record_time = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
                if record_time < grade_5_time:
                    coords = (record['latitude'], record['longitude'])
                    distance = calculate_distance(grade_5_coords, coords)
                    ship_distances.append((ship_id, coords, distance, time_str))

    # 거리에 따라 정렬하고 상위 3개 선박 선택
    closest_ships = sorted(ship_distances, key=lambda x: x[1])[:3]
else:
    closest_ships = "No Grade 5 ship found in the data."

print(closest_ships)

