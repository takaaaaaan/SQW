import streamlit as st
import folium
from streamlit_folium import folium_static
import pandas as pd
import json

# JSONデータの読み込み
with open('../json/data_add.json', 'r') as file:
    data = json.load(file)

def color_for_grade(grade):
    if grade == 1:
        return 'green'
    elif grade == 2:
        return 'blue'
    elif grade == 3:
        return 'yellow'
    elif grade == 4:
        return 'orange'
    else:
        return 'red'

def show_map(selected_point):
    m = folium.Map(location=[35.9078, 127.7669], zoom_start=7)

    for key, value in data.items():
        for timestamp, details in value.items():
            folium.CircleMarker(
                location=[details['latitude'], details['longitude']],
                radius=3,
                color=color_for_grade(details['Grade']),
                fill=True,
                fill_color=color_for_grade(details['Grade']),
                fill_opacity=0.7
            ).add_to(m)

    folium_static(m)

    if selected_point:
        st.write(data[selected_point])

def main():
    st.title("StreamlitでのGoogle Maps表示例")

    # ポイント選択用のセレクトボックス
    point_options = list(data.keys())
    selected_point = st.selectbox("ポイントを選択してください:", point_options)

    show_map(selected_point)

if __name__ == "__main__":
    main()
