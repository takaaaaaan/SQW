import asyncio
import websockets
import json
from datetime import datetime, timezone

# Create a dictionary to store the collected data
data = {}

# Number of ships to track
number_of_ships_to_track = 5
tracked_ships = {}


async def connect_ais_stream():
    async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
        subscribe_message = {
            "APIKey": "63a67e10bee025e05c8e7c2f6332cbdedfc570da",
            "BoundingBoxes": [[[38.48612617288902, 121.11894601803752], [34.16626273878638, 130.89015000762663]]]
        }
        subscribe_message_json = json.dumps(subscribe_message)
        await websocket.send(subscribe_message_json)

        async for message_json in websocket:
            message = json.loads(message_json)
            message_type = message["MessageType"]

            if message_type == "PositionReport":
                ais_message = message['Message']['PositionReport']
                print(
                    f"[{datetime.now(timezone.utc)}] ShipId: {ais_message['UserID']} Latitude: {ais_message['Latitude']} Longitude: {ais_message['Longitude']}")
                
                ship_id = ais_message['UserID']
                format_data(ais_message)  # Update the data dictionary

                # Update tracked ships count
                if ship_id not in tracked_ships:
                    tracked_ships[ship_id] = 1
                else:
                    tracked_ships[ship_id] += 1

                # Break the loop if the number of tracked ships reaches the target
                if len(tracked_ships) >= number_of_ships_to_track:
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
with open('json/ais_data.json', 'w') as file:
    json.dump(data, file, indent=4)
