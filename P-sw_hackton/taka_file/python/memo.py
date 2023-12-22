import numpy as np
# 船種ごとの速度（km/h）
SHIP_SPEEDS = {
    'tanker': 22,# タンカー……約12ノット（時速約22キロ）
    'ferry': 40,# フェリー……約22ノット（時速約40キロ）
    'fishing_boat': 47,# 小型漁船……約25ノット（時速約47キロ）
    'high_speed_ferry': 66,# 高速フェリー……約35.7ノット（時速約66キロ）
    'boat': 74,# ボート……約40ノット（時速74キロ)
}

# 船種ごとの出現確率（合計が1になるように設定）
SHIP_PROBABILITIES = {
    'tanker': 0.2,
    'ferry': 0.3,
    'fishing_boat': 0.25,
    'high_speed_ferry': 0.15,
    'boat': 0.1,
}

# 確率に基づいて船種を選ぶ
ship_type = np.random.choice(list(SHIP_PROBABILITIES.keys()), p=list(SHIP_PROBABILITIES.values()))
AVERAGE_SPEED = SHIP_SPEEDS[ship_type]

# 振れ幅の設定
SPEED_VARIATION = 0.2 # 20% variation

min_speed = AVERAGE_SPEED * (1 - SPEED_VARIATION) # 80% of average speed
max_speed = AVERAGE_SPEED * (1 + SPEED_VARIATION) # 120% of average speed

# 1時間あたりの移動距離の範囲
TIME_INTERVAL = 1 # hour
DISTANCE_CHANGE_RANGE = (min_speed * TIME_INTERVAL, max_speed * TIME_INTERVAL)

