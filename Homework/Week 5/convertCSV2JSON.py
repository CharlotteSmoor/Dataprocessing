import csv
import sys
import json

fieldNames = ("code","stadsdeel")


# https://jaranto.blogspot.nl/2012/12/transform-csv-file-to-json-file-with.html
def convert(filename):
     csv_filename = filename[0]
     f=open(csv_filename, 'r')
     csv_reader = csv.DictReader(f, fieldNames)
     json_filename = csv_filename.split(".")[0]+".json"
     jsonf = open(json_filename,'w')
     data = json.dumps([row for row in csv_reader])
     jsonf.write(data)
     f.close()
     jsonf.close()

if __name__=="__main__":
    if len(sys.argv) is 2:
        convert(sys.argv[1:])
    else:
        print("Please give valid input: convertCSV2JSON.py filename")
