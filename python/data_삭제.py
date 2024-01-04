import os
from firebase_admin import credentials, db, initialize_app

# Firebase設定
current_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(current_dir, 'asia-404305-firebase-adminsdk-c5mjl-1579518c37.json')
cred = credentials.Certificate(cred_path)
app = initialize_app(cred, {'databaseURL': 'https://asia-404305-default-rtdb.firebaseio.com/'})

def delete_all_data():
    ref = db.reference('/', app=app)  # ルート参照を取得
    ref.delete()  # ルート参照を使用して全データを削除

delete_all_data()

print("データベースの全データが削除されました。")
