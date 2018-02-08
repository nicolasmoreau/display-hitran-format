Hitran format visualization
===========================

Description
------------

Plot a 2D graph by reading data in Hitran file format
where x=wavenumber and y=intensity.

The plot is displayed in an html page, using Highcharts js library.


Execution
---------

Generates index.html file :
python extract.py

Open index.html with a web browser


Configuration
--------------

The plot configuration is done through variables at the top of
extract.py script

- Maximum number of points plotted :
  max_plotted_points = 1000
    
- X axis scale ( logarithmic or left empty ) :
  xaxis_type = ''
    
- Y axis scale ( logarithmic or left empty ) :
  yaxis_type = ''
  
Data
-----

Data files must be in Hitran format
It is mandatory to have two files in the data directory, their names
must end with ".txt".

The part of the name before ".txt" will be used s title of the charts.



