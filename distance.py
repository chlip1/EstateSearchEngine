import csv
import json
from geopy.distance import great_circle
from pathlib import Path

# Funkcja do wczytywania punktów zainteresowania
def load_points_of_interest(directory):
    points_of_interest = {}
    for csv_file in Path(directory).glob('*.csv'):
        category = csv_file.stem  # nazwa kategorii (bez rozszerzenia)
        points_of_interest[category] = []
        
        with open(csv_file, 'r', encoding="utf-8") as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                points_of_interest[category].append({
                    'lat': float(row['lat']),
                    'lon': float(row['lon'])
                })
    
    return points_of_interest

# Funkcja do sprawdzania, czy punkt jest w promieniu 1 km
def is_point_within_radius(lat_prop, lon_prop, points):
    for point in points:
        distance = great_circle((lat_prop, lon_prop), (point['lat'], point['lon'])).kilometers
        if distance < 1:
            return True
    return False

# Główna część skryptu
points_of_interest = load_points_of_interest('./database/')  # wczytaj punkty zainteresowania

# Wczytaj dane nieruchomości z pliku JSON
with open('estateInfo.json', 'r', encoding="utf-8") as jsonfile:
    json_data = json.load(jsonfile)

# Sprawdź dla każdej nieruchomości, czy są w pobliżu punkty zainteresowania
for estate in json_data:
    lat_json = estate['latitude']
    lon_json = estate['longitude']
    
    for category, points in points_of_interest.items():
        estate[category] = is_point_within_radius(lat_json, lon_json, points)

# Zapisz zmodyfikowane dane z powrotem do pliku JSON
with open('estateInfo2.json', 'w', encoding="utf-8") as jsonfile:
    json.dump(json_data, jsonfile, ensure_ascii=False, indent=4)

print("Dodano informacje o punktach zainteresowania do pliku JSON.")
