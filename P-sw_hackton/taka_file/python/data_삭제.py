import os
import threading
from firebase_admin import credentials, db, initialize_app

current_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(current_dir, 'model-craft-391306-firebase-adminsdk-v8jx8-8b0ef4e372.json')
cred = credentials.Certificate(cred_path)
app = initialize_app(
    cred, {'databaseURL': 'https://model-craft-391306-default-rtdb.firebaseio.com/'})

def delete_data(path):
    ref = db.reference(path, app=app)
    ref.delete() # この行を追加

table_names = ["A-" + str(i).zfill(2) + "/move" + str(j).zfill(2) for i in range(1, 51) for j in range(1, 11)]

threads = []
for table_name in table_names:
    thread = threading.Thread(target=delete_data, args=(table_name,))
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()

print("A-01からA-50までのmove01からmove05までのデータが削除されました。")

