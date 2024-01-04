import json
import numpy as np

min_values = {
    "dissolved_oxygen": 35,
    "chlorophyll": 5,
    "TN": 121.6,
    "DIP": 30,
    "TP": 13.6,
    "DIN": 200
}
max_values = {
    "dissolved_oxygen": 100,
    "chlorophyll": 10,
    "TN": 389.0,
    "DIP": 60,
    "TP": 39.3,
    "DIN": 350
}


def calculate_grade(values):
    if values is None:
        result_re = 0
    else:
        if values['dissolved_oxygen'] > 90:
            DoValue_DO = 1
        elif values['dissolved_oxygen'] > 81:
            DoValue_DO = 2
        elif values['dissolved_oxygen'] > 67.5:
            DoValue_DO = 3
        elif values['dissolved_oxygen'] > 45:
            DoValue_DO = 4
        else:
            DoValue_DO = 5

        if values['chlorophyll'] < 6.3:
            ChlValue_Chl = 1
        elif values['chlorophyll'] < 6.93:
            ChlValue_Chl = 2
        elif values['chlorophyll'] < 7.88:
            ChlValue_Chl = 3
        elif values['chlorophyll'] < 9.45:
            ChlValue_Chl = 4
        else:
            ChlValue_Chl = 5

        if values['DIN'] < 220:
            DINValue_DIN = 1
        elif values['DIN'] < 242:
            DINValue_DIN = 2
        elif values['DIN'] < 275:
            DINValue_DIN = 3
        elif values['DIN'] < 330:
            DINValue_DIN = 4
        else:
            DINValue_DIN = 5

        if values['DIP'] < 35:
            DIPValue_DIP = 1
        elif values['DIP'] < 38.50:
            DIPValue_DIP = 2
        elif values['DIP'] < 43.75:
            DIPValue_DIP = 3
        elif values['DIP'] < 52.50:
            DIPValue_DIP = 4
        else:
            DIPValue_DIP = 5

        '''
        if values['SD'] > 2.5:
            SDValue_SD = 1
        elif values['SD'] > 2.25:
            SDValue_SD = 2
        elif values['SD'] > 1.88:
            SDValue_SD = 3
        elif values['SD'] > 1.25:
            SDValue_SD = 4
        else:
            SDValue_SD = 5
        '''

        result = 10 * DoValue_DO + 6 * ((ChlValue_Chl + values['SD']) / 2) + 4 * ((DINValue_DIN + DIPValue_DIP) / 2)

        result_re = result
        if result_re <= 45:
            result_re = 1
        elif result_re <= 65:
            result_re = 2
        elif result_re <= 75:
            result_re = 3
        elif result_re <= 85:
            result_re = 4
        else:
            result_re = 5

    return result_re


def add_parameters_to_json(input_file, output_file):
    with open(input_file, 'r') as file:
        data = json.load(file)

    for ship_id, ship_data in data.items():
        for time, values in ship_data.items():
            # Random values generation
            values['dissolved_oxygen'] = float(np.random.uniform(min_values['dissolved_oxygen'],
                                                           max_values['dissolved_oxygen']))
            values['chlorophyll'] = float(np.random.uniform(min_values['chlorophyll'], max_values['chlorophyll']))
            values['TN'] = np.random.uniform(min_values['TN'], max_values['TN'])
            values['TP'] = np.random.uniform(min_values['TP'], max_values['TP'])
            values['DIN'] = np.random.uniform(min_values['DIN'], max_values['DIN'])
            values['DIP'] = np.random.uniform(min_values['DIP'], max_values['DIP'])
            values['SD'] = float(np.round(np.random.choice(np.arange(1, 6, 1), 1), 1)[0])
            # values['SD'] = np.random.uniform(min_values['SD'], max_values['SD'])
            values['Grade'] = calculate_grade(values)

    with open(output_file, 'w') as file:
        json.dump(data, file, indent=4)


# File paths
input_file = '../json/random_coordinates.json'
output_file = '../json/random_coordinates.json'

# Function call
add_parameters_to_json(input_file, output_file)
