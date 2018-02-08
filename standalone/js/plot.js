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
       text: 'hitran / smpo'   
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
    var series = [
       {
          name: 'hitran',
          color: 'red',
          data: dataset1_data                  
       },{
          name: 'smpo',
          color: 'blue',
          data: dataset2_data         
       }
    ];     
    var json = {};   
    
    json.chart = chart; 
    json.title = title;   
    json.subtitle = subtitle; 
    json.legend = legend;
    json.xAxis = xAxis;
    json.yAxis = yAxis;  
    json.series = series;
    json.plotOptions = plotOptions;
    plot(json);

    
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

 });
