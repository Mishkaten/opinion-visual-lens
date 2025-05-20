base_url = "https://www.trustpilot.com/review/balenciaga.com"

import requests
from bs4 import BeautifulSoup
import json
import time
import pandas as pd


def get_reviews_from_page(url):
    try:
        req = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        req.raise_for_status()  # Raise an error for bad status codes
        time.sleep(2)  # Add a delay to avoid overwhelming the server
        soup = BeautifulSoup(req.text, 'html.parser')
        reviews_raw = soup.find("script", id="__NEXT_DATA__").string
        reviews_raw = json.loads(reviews_raw)
        return reviews_raw["props"]["pageProps"]["reviews"]
    except (requests.RequestException, json.JSONDecodeError, AttributeError) as e:
        print(f"Error fetching reviews from {url}: {e}")
        return []


def scrape_trustpilot_reviews(base_url: str):
    reviews_data = []

    page_number = 1
    while True:
        print(f"Scraping page {page_number}...")
        url = f"{base_url}?page={page_number}"
        reviews = get_reviews_from_page(url)

        if not reviews:
            print(f"No more reviews found or error occurred at page {page_number}")
            break

        for review in reviews:
            data = {
                'Date': pd.to_datetime(review["dates"]["publishedDate"]).strftime("%Y-%m-%d"),
                'Author': review["consumer"]["displayName"],
                'Body': review["text"],
                'Heading': review["title"],
                'Rating': review["rating"],
                'Location': review["consumer"]["countryCode"]
            }
            reviews_data.append(data)

        print(f"Added {len(reviews)} reviews from page {page_number}")
        page_number += 1

    # Remove duplicates based on the 'Body' field
    original_count = len(reviews_data)
    reviews_data = [dict(t) for t in {tuple(sorted(d.items())) for d in reviews_data}]

    if original_count > len(reviews_data):
        print(f"Removed {original_count - len(reviews_data)} duplicate reviews")

    return reviews_data


def save_to_json(reviews, filename="balenciaga_reviews.json"):
    """Save reviews to a JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=4)
    return filename


def save_to_txt(reviews, filename="balenciaga_reviews.txt"):
    """Save reviews to a TXT file"""
    with open(filename, 'w', encoding='utf-8') as f:
        for review in reviews:
            f.write(f"Date: {review['Date']}\n")
            f.write(f"Author: {review['Author']}\n")
            f.write(f"Location: {review['Location']}\n")
            f.write(f"Rating: {review['Rating']}\n")
            f.write(f"Heading: {review['Heading']}\n")
            f.write(f"Body: {review['Body']}\n")
            f.write("-" * 80 + "\n\n")
    return filename


# Main execution
if __name__ == "__main__":
    print(f"Starting to scrape reviews from {base_url}")
    reviews = scrape_trustpilot_reviews(base_url)

    if reviews:
        print(f"Successfully scraped {len(reviews)} reviews")

        # Save as JSON (default)
        json_file = save_to_json(reviews)
        print(f"Reviews saved to {json_file}")

        # Uncomment the line below if you also want to save as TXT
        # txt_file = save_to_txt(reviews)
        # print(f"Reviews saved to {txt_file}")
    else:
        print("No reviews were scraped")