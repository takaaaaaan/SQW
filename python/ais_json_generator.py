import asyncio
import websockets
import json
from datetime import datetime, timezone

# Create a dictionary to store the collected data
data = {}


async def connect_ais_stream():
    async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
        subscribe_message = {"APIKey": "63a67e10bee025e05c8e7c2f6332cbdedfc570da",
                             "BoundingBoxes": [[[-11, 178], [30, 74]]]}
        subscribe_message_json = json.dumps(subscribe_message)
        await websocket.send(subscribe_message_json)

        target = '' # 첫 ShipId
        target_count = 0 # 첫 ShipId count
        i = 0
        async for message_json in websocket:
            message = json.loads(message_json)
            message_type = message["MessageType"]

            if message_type == "PositionReport":
                ais_message = message['Message']['PositionReport']
                print(
                    f"[{datetime.now(timezone.utc)}] ShipId: {ais_message['UserID']} Latitude: {ais_message['Latitude']} Longitude: {ais_message['Longitude']}")
                if i == 0:
                    target = ais_message['UserID']
                    i += 1
                if ais_message['UserID'] == target:
                    target_count += 1
                format_data(ais_message)  # Update the data dictionary
                if target_count == 2:
                    break


def format_data(ais_message):
    time_key = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    # Update the data dictionary with UserID as the key
    if ais_message['UserID'] not in data:
        data[ais_message['UserID']] = {}

    data[ais_message['UserID']][time_key] = {
        "latitude": ais_message['Latitude'],
        "longitude": ais_message['Longitude'],
        "times": time_key
    }


if __name__ == "__main__":
    asyncio.run(connect_ais_stream())

# Save the collected data to a JSON file after data collection is complete
with open('ais_data.json', 'w') as file:
    json.dump(data, file, indent=4)
