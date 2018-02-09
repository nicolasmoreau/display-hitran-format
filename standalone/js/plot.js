$(document).ready(function() {  
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
    var title = {
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
       scatter: {
          marker: {
             radius: 3,
             states: {
                hover: {
                   enabled: false,
                   lineColor: 'rgb(100,100,100)'
                }
             }
          },
          states: {
             hover: {
                marker: {
                   enabled: false
                }
             }
          }
       }
    };

    var json = {};   
    
    json.chart = chart; 
    json.title = title;   
    json.subtitle = subtitle; 
    json.legend = legend;
    json.xAxis = xAxis;
    json.yAxis = yAxis;  
    json.series = [];
    json.plotOptions = plotOptions;
    
    function plot(json){
      document.getElementById('mask-div').style.display='block';
      var chart = Highcharts.chart('container', json);
    }
    
    function switch_axis(value){
      if(value === '')
        return {value : 'logarithmic', text : 'Disable log'}; 
      else
        return {value : '', text : 'Enable log'}; 
    }
    
    $("#switch-log-y").bind("click", {json : json},function(event){  
      var log_switch =  switch_axis(event.data.json.yAxis.type);
      event.data.json.yAxis.type = log_switch.value;
      $("#switch-log-y").html(log_switch.text);
      plot(event.data.json);
    });
    
    $("#switch-log-x").bind("click", {json : json},function(event){              
      var log_switch =  switch_axis(event.data.json.xAxis.type);
      event.data.json.xAxis.type = log_switch.value;
      $("#switch-log-x").html(log_switch.text);
      plot(event.data.json);
    });   
    
    $("#clear-plot").bind("click", {json : json},function(event){
      json.series = [];
      plot(json);
    });  
    
    function read_hitran_file(content){    
      var lines = $.trim(content).split("\n");
      var result = [];
      var max_lines = 10000;
      if(lines.length < max_lines){
        max_lines = lines.length;
      }
      for(var i = 0; i < max_lines; i++){
        var wavenumber = parseFloat(lines[i].substring(3, 14));
        var intensity = parseFloat(lines[i].substring(15, 25));
        result.push([wavenumber, intensity]);
      }
      return result;
    }

    var fileInput = document.querySelector('#file-selector');

    fileInput.addEventListener('change', function() {
      var reader = new FileReader();
      var colors = ['red', 'blue'];
      
      reader.addEventListener('load', function() {    
        var data = read_hitran_file(reader.result); 
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

    fileInput.addEventListener('click', function() {    
      fileInput.value = null;
    });

 });
