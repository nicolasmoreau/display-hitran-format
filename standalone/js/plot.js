"use strict";

/**
 * Returns a list of tuples containg wavenumber and intensity values
 * extracted from a Hitran format file.
 * Values are parsed into float
 *
 * @param content string
 * @param ma_line_number maximum number of line to read into file
 */
function read_hitran_file(content, max_line_number){    
  var lines = $.trim(content).split("\n");
  var result = [];
  var max_lines = max_line_number;

  //if there are less than max_line_number in file, keep all lines
  if(lines.length < max_lines){
    max_lines = lines.length;
  }
  
  for(var i = 0; i < max_lines; i++){
    var wavenumber = parseFloat(lines[i].substring(3, 14));
    var intensity = parseFloat(lines[i].substring(15, 25));
    result.push({x : wavenumber, y : intensity, transition : lines[i]});
  }
  return result;
}

/**
 * Plot a graph whose parameters are in the json object
 * @param json graph configuration
 */
function plot(json){
  document.getElementById('mask-div').style.display='block';
  var chart = Highcharts.chart('container', json);
}

/**
 * Returns a configuration object for the graph
 * json.plotOptions.scatter field can not be redefined
 * @param configuration  json object redefining default configuration values
 */
function get_chart_configuration(configuration){
  var chart = {
   type: 'scatter',
   zoomType: 'xy',
   events : {
     render: function() {
        // wait for 2s, plot is async
        setTimeout(function(){
        document.getElementById('mask-div').style.display='none';
        }, 2000);
      }
    }     
  };
  var title =  {
    text: 'Hitran format file comparison'   
  };
  
  var subtitle = {
    text: ''  
  };
  
  var xAxis = {
    title: {
      enabled: true,
      text: 'Wavenumbers'
    },
    type : '',
    startOnTick: true,
    endOnTick: true,
    showLastLabel: true
  };
  var yAxis = {
    title: {
      text: 'Intensities'
    },
    type : ''
  };
  var legend = {   
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 100,
    y: 70,
    floating: true,
    backgroundColor: (
      Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
      '#FFFFFF',
    borderWidth: 1
  }  
  var plotOptions = {
    series : {
      point : {
        events :{
          mouseOver : function(){
            console.log(this.transition);
          }
        }
      }
    }
  };

  var json = {};     
  json.chart = configuration.chart === undefined ? chart : configuration.chart; 
  json.title = configuration.title === undefined ? title : configuration.title; 
  json.subtitle = configuration.subtitle === undefined ? subtitle : configuration.subtitle;  
  json.legend = configuration.legend === undefined ? legend : configuration.legend;  
  json.xAxis = configuration.xAxis === undefined ? xAxis : configuration.xAxis;  
  json.yAxis = configuration.yAxis === undefined ? yAxis : configuration.yAxis;  
  json.series = configuration.series === undefined ? [] : configuration.series; 
  json.plotOptions = configuration.plotOptions === undefined ? plotOptions : configuration.plotOptions;

  json.plotOptions.scatter = {
    marker: {
      radius: 3,
      states: {
        hover: {
           enabled: false,
           lineColor: 'rgb(100,100,100)'
        }
      }      
    }
  };
  
  return json;
}

/**
 * Returns a json object inverting the current log status of the graph
 */
function switch_axis(current_log_status){
  if(current_log_status === ''){
    return {value : 'logarithmic', text : 'Disable log'};
  }else{
    return {value : '', text : 'Enable log'};
  }
}



$(document).ready(function() {
  var config_custom = {
    plotOptions : {
      series : {
        turboThreshold : 10000,
        point : {
          events :{
            click : function(){
              // display data for selected point on graph
              $('#transition-info').html(this.series.name+"\n"+this.transition);
            }
          }
        }
      }
    }
  };
  //object containing displayed graph
  var json = get_chart_configuration(config_custom);
  //open file button
  var fileInput = document.querySelector('#file-selector');

  // button enabling/disabling log display for y axis
  $("#switch-log-y").bind("click", {json : json}, function(event){  
    var log_switch =  switch_axis(event.data.json.yAxis.type);
    event.data.json.yAxis.type = log_switch.value;
    $("#switch-log-y").html(log_switch.text);
    plot(event.data.json);
  });

  // button enabling/disabling log display for x axis
  $("#switch-log-x").bind("click", {json : json}, function(event){              
    var log_switch =  switch_axis(event.data.json.xAxis.type);
    event.data.json.xAxis.type = log_switch.value;
    $("#switch-log-x").html(log_switch.text);
    plot(event.data.json);
  });   

  //reset graph button
  $("#clear-plot").bind("click", {json : json}, function(event){
    $('#transition-info').html('');
    json.series = [];
    plot(json);
  });      

  //event when opening file
  $("#file-selector").bind('change', function() {
    var reader = new FileReader();
    var colors = ['red', 'blue'];
    
    reader.addEventListener('load', function() {    
      var data = read_hitran_file(reader.result, 10000); 
      var series = json.series;
      if(series.length < 2){
        series.push({
          name: fileInput.files[0].name,
          color: colors[series.length],
          data: data 
        });
        json.series = series;
        plot(json);
      }else{
        alert("Only 2 data files can be opened at once.");
      }        
    });
    reader.readAsText(fileInput.files[0]);

  });

  $('#file-selector').bind('click', function() {    
    fileInput.value = null;
  });

 });
