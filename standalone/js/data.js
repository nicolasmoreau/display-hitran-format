
//~ function read_hitran_file(content){
  //~ var lines = $.trim(content).split("\n");
  //~ var result = [];
  //~ for(var i = 0; i < 5; i++){
    //~ var wavenumber = parseFloat(lines[i].substring(3, 14));
    //~ var intensity = parseFloat(lines[i].substring(15, 25));
    //~ result.push([wavenumber, intensity]);
  //~ }
  //~ console.log(result);
//~ }
//~ 
//~ var fileInput = document.querySelector('#file-selector');
//~ 
//~ fileInput.addEventListener('change', function() {
  //~ var reader = new FileReader();
  //~ 
  //~ reader.addEventListener('load', function() {    
    //~ read_hitran_file(reader.result);    
    //~ 
  //~ });
  //~ console.log(" reading : "+fileInput.files[0]);
  //~ reader.readAsText(fileInput.files[0]);
//~ 
//~ });
//~ 
//~ 
//~ fileInput.addEventListener('click', function() {    
  //~ fileInput.value = null;
//~ });
