import matplotlib.pyplot as plt
import numpy as np

# 緯度と経度の範囲
lat_range = (25.00, 40.00)
lon_range = (117.00, 142.00)

# サンプルデータ（データベースからのデータを使用する場合は、この部分を適切に変更する必要があります）
pressure_data = np.random.rand(16, 26) * 1000

# 緯度と経度の格子を作成
lat_values = np.linspace(lat_range[0], lat_range[1], pressure_data.shape[0])
lon_values = np.linspace(lon_range[0], lon_range[1], pressure_data.shape[1])
lons, lats = np.meshgrid(lon_values, lat_values)

# 等圧線を描画
plt.contour(lons, lats, pressure_data, levels=15)
plt.title('等圧線')
plt.xlabel('経度')
plt.ylabel('緯度')
plt.colorbar(label='気圧 (hPa)')
plt.show()
