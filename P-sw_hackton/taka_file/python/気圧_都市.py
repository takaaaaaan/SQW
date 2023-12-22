import requests


def get_pressure(city_name, api_key):
    # OpenWeatherMap APIのエンドポイント
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}"

    # リクエストを送信
    response = requests.get(url)

    # 応答が成功した場合、気圧を取得
    if response.status_code == 200:
        pressure = response.json()['main']['pressure']
        return pressure
    else:
        return "エラーが発生しました"


# 使用例
city_name = "Seoul"
api_key = "53f03c9d9f0082bec25f418ff553df6e"  # 自分のAPIキーに置き換えてください
pressure = get_pressure(city_name, api_key)
print(f"{city_name}の気圧は{pressure} hPaです。")
