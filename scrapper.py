import requests
from bs4 import BeautifulSoup as bs
import json
from datetime import datetime


class OtodomScraper:

    BASE_URL = "https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/pomorskie/gdansk"
    HEADERS = {"User-Agent": "Mozilla/5.0"}

    @staticmethod
    def get_soup_from_url(url):
        response = requests.get(url, allow_redirects=True, headers=OtodomScraper.HEADERS)
        return bs(response.content, "html.parser")

    @staticmethod
    def get_data_from_soup(soup):
        soup_content = soup.find(type="application/json")
        return json.loads(soup_content.text)

    @staticmethod
    def get_all_pages_data(initial_url):
        soup = OtodomScraper.get_soup_from_url(initial_url)
        data = OtodomScraper.get_data_from_soup(soup)
        page_count = data["props"]["pageProps"]["data"]["searchAds"]["pagination"]["totalPages"]
        all_data = data["props"]["pageProps"]["data"]["searchAds"]["items"]

        for page in range(2, page_count + 1):
            url = f"{OtodomScraper.BASE_URL}?page={page}&limit=72&distanceRadius=0&ownerTypeSingleSelect=ALL&by=DEFAULT&direction=DESC&viewType=listing&limit=72"
            page_data = OtodomScraper.get_data_from_soup(OtodomScraper.get_soup_from_url(url))
            all_data.extend(page_data["props"]["pageProps"]["data"]["searchAds"]["items"])

        return all_data

    @staticmethod
    def save_data_to_file(data, file_name):
        with open(file_name, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

