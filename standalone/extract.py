#!/usr/bin/env python

import os, sys

__author__ = "Nicolas Moreau"
__copyright__ = "Copyright 2018, VAMDC Consortium"
__license__ = "GPL"
__version__ = "1.0.1"
__maintainer__ = "Nicolas Moreau"


# position of wavenumber column in hitran file
wavenumbers_position = 1
# position of intensities column in hitran file
intensities_position = 2

# display data from line (after sorting)
# not used at the moment
#interval_start = 0

# dispplay data until line
interval_end = 50

# directory containing data files
DATA_DIRECTORY = '../data'

"""
  Returns two lists :
    a list of files whose name ends by ".txt" in directory
    a list of prefixes that will be used later in dictionary to sort data
      prefixes are built from the part of the file name bedore the '.'
      character
"""
def get_files_and_prefixes(directory):
  files = []
  prefixes = []
  for filename in os.listdir(directory):
    if filename.endswith(".txt"): 
      files.append(filename)
      prefixes.append(filename.split('.')[0])
    else:
      continue
  return files,prefixes

"""
  Extract data from hitran data_file
  data are casted to float
"""
def get_data_axis(data_file, column_id_1, column_id_2):
  result = []
  with open(data_file, "r") as f:
    for line in f.readlines():
      parts = line.split()

      # cast to float values for later sort
      if len(parts) > 0 :
        result.append([float(parts[column_id_1]), float(parts[column_id_2])])
  return result

"""
  Returns data for all files in data_files
  Values are sorted by ascending wavenumber values
"""
def get_datasets(data_files, sort_column) : 
  result = []
  for data_file in data_files : 
    columns_data = get_data_axis(DATA_DIRECTORY+os.sep+data_file, wavenumbers_position, intensities_position)
    # sort by wavenumber ascendant
    # sort_column-1 => there is a shift between position in initial file
    # and position in plotted data
    columns_data.sort(key=lambda data:data[sort_column-1])
    result.append(columns_data)
  return result
    
files, prefixes = get_files_and_prefixes(DATA_DIRECTORY)

if len(files) != 2 :
  print("this script requires exactly 2 datafiles")
  sys.exit()

datasets = get_datasets(files, wavenumbers_position)
plotted_data = {}

# if interval_end is greater than the number of points in a dataset
# interval_end = len(smaller_dataset)
for idx, dataset in enumerate(datasets) :
  if len(dataset) < interval_end :
    interval_end = len(dataset)
    
# format extracted data as javascript arrays
for idx, dataset in enumerate(datasets) :
  plotted_data[prefixes[idx]] = []
  for i in range(0, interval_end) :
    plotted_data[prefixes[idx]].append("[%s,  %s]"%(dataset[i][0], dataset[i][1]))

# writes javascript file data.js that will be displayed in index.html
with open('data.js', 'w') as output:
  i = 1
  for key in plotted_data :
    output.write('var dataset%s_data = ['%i)
    output.write(','.join(plotted_data[key]))
    output.write('];\n')
    i = i+1
    
with open('index.html.template', 'r') as source:
  with open('index.html', 'w') as output:
    source_html = source.read()
    source_html = source_html.replace('#title#', '%s / %s'%(prefixes[0], prefixes[1]))
    source_html = source_html.replace('#dataset1#', prefixes[0])
    source_html = source_html.replace('#dataset2#', prefixes[1])
    output.write(source_html)

    
