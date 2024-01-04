import asyncio
import websockets
import json
from datetime import datetime, timezone, timedelta

data = {}

# 設定した時間（秒）でデータ収集を停止
tracking_duration = 7200  # 例: 2時間
save_interval = 300  # 例: 5分ごとに保存

async def connect_ais_stream():
    end_time = datetime.now(timezone.utc) + timedelta(seconds=tracking_duration)
    next_save_time = datetime.now(timezone.utc) + timedelta(seconds=save_interval)

    async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
        subscribe_message = {
            "APIKey": "63a67e10bee025e05c8e7c2f6332cbdedfc570da",
            "BoundingBoxes": [[[41.352618069938096, 117.22912750782095], [33.401980634749506, 132.13018952530905]]]
        }
        await websocket.send(json.dumps(subscribe_message))

        while datetime.now(timezone.utc) < end_time:
            try:
                message_json = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                message = json.loads(message_json)
                message_type = message["MessageType"]

                if message_type == "PositionReport":
                    ais_message = message['Message']['PositionReport']
                    print(
                        f"[{datetime.now(timezone.utc)}] ShipId: {ais_message['UserID']} Latitude: {ais_message['Latitude']} Longitude: {ais_message['Longitude']}")
                    format_data(ais_message)  # Update the data dictionary

                # 定期的にデータを保存
                if datetime.now(timezone.utc) >= next_save_time:
                    save_data()
                    next_save_time = datetime.now(timezone.utc) + timedelta(seconds=save_interval)

            except asyncio.TimeoutError:
                continue
            except Exception as e:
                print(f"エラーが発生しました: {e}")
                break

def save_data():
    """現在のデータをファイルに保存する関数"""
    with open('json/all_data.json', 'w') as file:
        json.dump(data, file, indent=4)
    print(f"[{datetime.now(timezone.utc)}] データを保存しました。")

def format_data(ais_message):
    time_key = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    if ais_message['UserID'] not in data:
        data[ais_message['UserID']] = {}

    data[ais_message['UserID']][time_key] = {
        "latitude": ais_message['Latitude'],
        "longitude": ais_message['Longitude'],
        "time": time_key
    }

if __name__ == "__main__":
    try:
        asyncio.run(connect_ais_stream())
    except KeyboardInterrupt:
        print("プログラムが手動で中断されました。")
    finally:
        save_data()  # プログラム終了時にデータを保存
