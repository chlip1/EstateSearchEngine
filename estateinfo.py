import json

class PropertyExtractor:

    def __init__(self, filename):
        self.filename = filename

    def extract_data(self):
        with open(self.filename, 'r', encoding='utf-8') as file:
            data = json.load(file)
            extracted_data = []
            
            for entry in data:
                street = entry["location"]["address"]["street"]["name"] if entry.get("location") and entry["location"].get("address") and entry["location"]["address"].get("street") else None
                city = entry["location"]["address"]["city"]["name"] if entry.get("location") and entry["location"].get("address") and entry["location"]["address"].get("city") else None
                medium_image = entry["images"][0]["medium"] if entry.get("images") else None
                totalPrice_value = entry["totalPrice"]["value"] if entry.get("totalPrice") else None
                pricePerSquareMeter_value = entry["pricePerSquareMeter"]["value"] if entry.get("pricePerSquareMeter") else None
                
                if all([entry.get("id"), entry.get("estate"), street, city, medium_image, totalPrice_value, pricePerSquareMeter_value, entry.get("areaInSquareMeters"), entry.get("roomsNumber")]):
                    new_entry = {
                        "id": entry["id"],
                        "estate": entry["estate"],
                        "street": street,
                        "city": city,
                        "medium_image": medium_image,
                        "totalPrice_value": totalPrice_value,
                        "pricePerSquareMeter_value": pricePerSquareMeter_value,
                        "areaInSquareMeters": entry["areaInSquareMeters"],
                        "roomsNumber": entry["roomsNumber"]
                    }
                    extracted_data.append(new_entry)

            return extracted_data


    def save_to_new_file(self, new_filename):
        extracted_data = self.extract_data()
        with open(new_filename, 'w') as new_file:
            json.dump(extracted_data, new_file, indent=4)

