#!/usr/bin/env python
# Name: Charlotte Smoor
# Student number: 10786902
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    all_series = []

    # find all tv series within tags
    tv_series = dom.find_all('div', class_ = 'lister-item mode-advanced')

    # iterate over series and find title and store in empty list
    for show in tv_series:
        series = []
        title = show.h3.a.text
        series.append(title)

        # find rating and store in list
        rating = float(show.strong.text)
        series.append(rating)

        # find genre and store in list
        genre = show.find('span', class_ = 'genre').text
        genre = genre.strip()
        series.append(genre)

        # select actors and store in list
        actors = show.select("p > a")
        tv_actors = []
        for actor in actors:
            tv_actors.append(actor.find(text = True))
        serie_actors = ','.join(tv_actors)
        series.append(serie_actors)

        # find running time in minutes and store in list
        runtime = re.sub(r'\D', '', show.find('span', class_ = 'runtime').text)
        series.append(runtime)

        all_series.append(series)

    return all_series

def save_csv(outfile, all_series):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for show in all_series:
        writer.writerow(show)

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
