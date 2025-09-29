from gutenberg_cleaner import simple_cleaner, super_cleaner
import requests
import nltk
import gutenbergpy.textget
import re
from collections import defaultdict
import json

nltk.download('punkt_tab')



def get_author_books(author_name, limit=4):
    url = f"https://gutendex.com/books/?search={author_name}&languages=en"
    
    response = requests.get(url)
    last_name, first_name = author_name.split()[-1], " ".join(author_name.split()[:-1])
    res = []
    
    if response.status_code == 200:
        data = response.json()
        
        for i, book in enumerate(data['results']):
            if last_name in ''.join([author['name'] for author in book['authors']]) and first_name in ''.join([author['name'] for author in book['authors']]):
                title = book['title']
                book_id = book['id']
                # authors = ', '.join([author['name'] for author in book['authors']])
                # download_count = book['download_count']
                res.append({
                    "title": title,
                    "id": book_id,
                    "text": ""
                })

            if len(res) == limit: break
        return res
    else:
        print(f"Error: {response.status_code}")
        return []

# print(get_author_books("F. Scott Fitzgerald"))

authors = [x.strip() for x in open('author_list.txt')]

"""
[
    authorName: [
        {
            
        }
    ]
]
"""

res = defaultdict(list)
for author in authors:
    author_data = get_author_books(author)
    for data in author_data:
        try:
            raw_book = gutenbergpy.textget.get_text_by_id(data['id'])
            cleaned = super_cleaner(book=raw_book.decode("utf-8"))
            cleaned = cleaned.replace("“", '"').replace("”", '"').replace("_", "")
            cleaned = cleaned.replace("[deleted]", "\n")
            cleaned = re.sub("(?<!\n)\n(?!\n)", " ", cleaned)
            cleaned = re.sub("\n+", "\n", cleaned)
            data['text'] = cleaned
            res[author].append(data)
        except:
            print('Failed:', data['id'], data['title'], author)
    print(f'{author} done!')

with open('../public/texts.json', 'w') as file:
    json.dump(res, file, indent=4)

