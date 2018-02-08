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


# directory containing data files
DATA_DIRECTORY = '../data'

### Plot options

# maximum number of points plotted
max_plotted_points = 10000
# logarithmic or empty
xaxis_type = ''
# logarithmic or empty
yaxis_type = ''


  
def check_axis_type(axis_type):
  axis_types = ['', 'logarithmic']  
  if axis_type not in axis_types:
    print("invalid type for axis : %s" % axis_type)
    sys.exit()     
    
    
def replace_template_variable(source, variable, value):
  return source.replace('#'+variable+'#', value)

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

check_axis_type(xaxis_type)
check_axis_type(yaxis_type)

datasets = get_datasets(files, wavenumbers_position)
plotted_data = {}

# format extracted data as javascript arrays
for idx, dataset in enumerate(datasets) :
  plotted_data[prefixes[idx]] = []
  print("length of dataset : %s "%len(dataset))
  i = 0
  while i < len(dataset) and i < max_plotted_points :
    plotted_data[prefixes[idx]].append("[%s,  %s]"%(dataset[i][0], dataset[i][1]))
    i = i+1

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
    source_html = replace_template_variable(source_html, 'title', '%s / %s'%(prefixes[0], prefixes[1]))
    source_html = replace_template_variable(source_html, 'dataset1', prefixes[0])
    source_html = replace_template_variable(source_html, 'dataset2', prefixes[1])
    source_html = replace_template_variable(source_html, 'xaxis_type', xaxis_type)
    source_html = replace_template_variable(source_html, 'yaxis_type', yaxis_type)
    output.write(source_html)

    
