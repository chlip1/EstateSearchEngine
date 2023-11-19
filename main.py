import json
from scrapper import OtodomScraper
from estateinfo import PropertyExtractor
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable

FILE_NAME = "estateInfo.json"
LOC = Nominatim(user_agent="Geopy Library")

def do_geocode(address):
    try:
        return LOC.geocode(address)
    except GeocoderTimedOut:
        return do_geocode(address)  # rekurencyjnie próbuje ponownie, gdy wystąpi timeout
    except GeocoderUnavailable:
        return None

def streetToGeo():
    with open(FILE_NAME, 'r', encoding='utf-8') as file:
        data = json.load(file)

    for item in data:
        if 'ul. ' in item['street']:
            item['street'] = item['street'].replace('ul. ', '')
        
        full_address = f"{item['street']}, {item['city']}"
        
        location = do_geocode(full_address)

        if location:
            item['latitude'] = location.latitude
            item['longitude'] = location.longitude
        else:
            item['latitude'] = None
            item['longitude'] = None
            print(f"Nie można odnaleźć lokalizacji dla adresu: {full_address}")

    with open(FILE_NAME, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    initial_url = f"{OtodomScraper.BASE_URL}?page=1&limit=72&distanceRadius=0&ownerTypeSingleSelect=ALL&by=DEFAULT&direction=DESC&viewType=listing&limit=72"
    all_data = OtodomScraper.get_all_pages_data(initial_url)
    OtodomScraper.save_data_to_file(all_data, FILE_NAME)
    executor = PropertyExtractor(FILE_NAME)
    executor.save_to_new_file(FILE_NAME)
    streetToGeo()
