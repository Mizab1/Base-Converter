// Get all the elements from the main page
const fromSelectedElement = document.getElementById("from-select");
const toSelectedElement = document.getElementById("to-select");
const fromElement = document.getElementById("from-input");
const toElement = document.getElementById("to-input");
const errorElement = document.getElementById("error");
const mainElement = document.getElementById("main");
const frameColors = getComputedStyle(mainElement).getPropertyValue("background-image").split("rgb(");
const bodyColors = getComputedStyle(document.body).getPropertyValue("background-image").split("rgb(");

var gradientStart = 0;
var gradientEnd = 0;

// Lerps and Updates gradient values of main frame background
// (uses mouse coordinates)
var gradientInterval = setInterval(function() {
      // lerp function
      gradientStart = gradientStart * (1 - 0.1) + gradientEnd * 0.1;

      let newGradient = parseInt(gradientStart);

      let colorValues = [];
      let ptr = 0;

      for(let i = 1; i <= 3; i++) {
         let current = frameColors[i].split(",");
         if(i == 3)
            current[2] = current[2].slice(0, current[2].length-1);

         colorValues[ptr++] = "rgb(" + 
            current[0] + ", " + current[1] + ", " + current[2];
      }
      mainElement.setAttribute("style", 
         "background-image: linear-gradient(" +
            colorValues[0] + (newGradient-95) + "% ," +
            colorValues[1] + newGradient      + "% ," +
            colorValues[2] + (newGradient+95) + "%);"
      );

      colorValues = [];
      ptr = 0;
      for(let i = 1; i <= 3; i++) {
         let current = bodyColors[i].split(",");
         if(i == 3)
            current[2] = current[2].slice(0, current[2].length-1);

         colorValues[ptr++] = "rgb(" + 
            current[0] + ", " + current[1] + ", " + current[2];
      }
      document.body.setAttribute("style", 
         "background-image: linear-gradient( 120deg," +
            colorValues[0] + (newGradient-40) + "% ," +
            colorValues[1] + newGradient      + "% ," +
            colorValues[2] + (newGradient+40) + "%);"
      );
   }, 10 // tick speed+ms
);

function gradient(e) {
   let horizontalArea = mainElement.offsetTop + mainElement.offsetWidth;
   gradientEnd = parseInt(100 - (horizontalArea - e.clientY) / horizontalArea * 100);
}

// Contains all the converted values
var values = {
   "Binary":0,
   "Hexadecimal":0,
   "Decimal":0,
   "Octal":0,
}

// Error message logic
const error = {
   isDisplayed:false,

   clear: function() {
      errorElement.setAttribute("style", "");
      this.isDisplayed = false;
   },

   display: function() {
      errorElement.innerText = "Invalid " + from.base + " Number";
      toElement.value = "";
      errorElement.setAttribute("style", "font-size: larger");
      this.isDisplayed = true;
   }
}

// Value Input Logic - this calls other Base conversion functions
// depending on the Input value's Base
function convert() {
   fromValue = fromElement.value;

   error.clear();

   if(fromValue.length == 0)
      return;
   switch (from.base) {
      case "Binary":
         if(!calculateFromBinary())
            error.display();
      break;

      case "Decimal":
         if(!calculateFromDecimal())
            error.display();
      break;

      case "Hexadecimal":
         if(!calculateFromHexadecimal())
            error.display();
      break;

      case "Octal":
         if(!calculateFromOctal())
            error.display();
      break;
   }

   if(error.isDisplayed) 
      return;
   
   toElement.value = values[to.base];
}

// Logic for dropdown field of - Convert "from" base
const from = {
   
   value:0,
   base:"",
   previousSelected:1,
   
   change: function() {

      this.base = fromSelectedElement.options[fromSelectedElement.selectedIndex].text;
      fromElement.placeholder = this.base + " Number";

      
      if(to.base == this.base) {
         toSelectedElement.selectedIndex = this.previousSelected;
         to.change();
      }

      this.previousSelected = fromSelectedElement.selectedIndex;
      convert();
   },

   clear: function() {
      fromElement.value = "";
   }
}

// Logic for dropdown field of - Convert "to" base
const to = {

   value:0,
   base:"",
   previousSelected:0,
   
   change: function() {
      this.base = toSelectedElement.options[toSelectedElement.selectedIndex].text;
      toElement.placeholder =  this.base + " Number";

      if(from.base == this.base) {
         fromSelectedElement.selectedIndex = this.previousSelected;
         from.change();
      }

      this.previousSelected = toSelectedElement.selectedIndex;
      convert();
   },

   clear: function() {
      toElement.value = "";
   }
}

// Initializing Dropdown fields
from.change();
to.change();

// Functions for converting and storing values-
// returns true if conversion took place
// returns false if value is invalid and skips conversion

function calculateFromBinary() {
   if(!/^[01]*$/.test(fromValue)) return false;

   values.Binary = fromValue;
   values.Decimal = parseInt(fromValue, 2);
   values.Hexadecimal = parseInt(fromValue, 2).toString(16).toUpperCase();
   values.Octal = parseInt(fromValue, 2).toString(8);

   return true;
}

function calculateFromDecimal() {
   if(!/^[0-9]*$/.test(fromValue)) return false;

   values.Binary = Math.abs(fromValue).toString(2);
   values.Decimal = fromValue;
   values.Hexadecimal = toElement.value = Math.abs(fromValue).toString(16).toUpperCase();
   values.Octal = Math.abs(fromValue).toString(8);

   return true;
}

function calculateFromHexadecimal() {
   if(!/^[0-9a-fA-F]*$/.test(fromValue)) return false;

   values.Binary = parseInt(fromValue, 16).toString(2);
   values.Decimal = parseInt(fromValue, 16);
   values.Hexadecimal = fromValue;
   values.Octal = parseInt(fromValue, 16).toString(8);

   return true;
}

function calculateFromOctal() {
   if(!/^[0-7]*$/.test(fromValue)) return false;

   values.Binary = parseInt(fromValue, 8).toString(2);
   values.Decimal = parseInt(fromValue, 8);
   values.Hexadecimal = parseInt(fromValue, 8).toString(16).toUpperCase();
   values.Octal = fromValue;

   return true;
}

// Logic for reset button
function reset() {
   error.clear();
   from.clear();
   to.clear();
   GroupMembers();
}

