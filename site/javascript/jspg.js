$(document).ready(function(){
   var global_var = [];
   console.log(global_var);
   global_var.push('red');
   console.log(global_var);
   
   function change_global_var(){
       //global_var = [];
       global_var.push('blue');
       console.log(global_var);
   }
   
   change_global_var();
   console.log(global_var);
});