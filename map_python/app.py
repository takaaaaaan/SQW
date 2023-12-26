import streamlit as st
import pandas as pd
import json

# JSONデータの読み込み
with open('../json/data_add.json', 'r') as file:
    data = json.load(file)

def show_map():
    # データフレームの作成
    locations = []
    for key, value in data.items():
        for timestamp, details in value.items():
            locations.append([details['latitude'], details['longitude']])

    df = pd.DataFrame(locations, columns=['lat', 'lon'])

    # Streamlitアプリにマップを表示
    st.map(df)

def main():
    st.title("StreamlitでのGoogle Maps表示例")
    show_map()

if __name__ == "__main__":
    main()
