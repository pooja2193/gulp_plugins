'use strict';
const PLUGIN_NAME = 'my-plugin-2';
var through = require('through2'),
  gutil = require('gulp-util'),
  PluginError = gutil.PluginError;
/**
 * This method transform the input string to upper/lower case
 * @param caseType - The transform type upper/lower
 * @param inputString - The input string
 * @returns {string} - The transformed string
 */
var transformText = function(caseType,inputString){
  var outString = null;
  switch(caseType){
    case 'uppercase':
      outString = inputString.toUpperCase();
      break;
    case 'lowercase':
      outString = inputString.toLowerCase();
      break;
    default:
      outString = inputString;
      break;
  }
  return outString;
};

function transformJson1(input,moduleName,compName) {
  var coordinates = input.split( "\n" );
  coordinates.forEach((menuItem,index) => {
    let man = menuItem.match(/&-&(.*)&-&/);
    if (man != null) {
      var values = man[1].split(',');
      var newKey = values[0];
      newKey = newKey.toUpperCase();
      newKey = newKey.replace(/-/g, "_");
      menuItem = menuItem.substring(0, man.index) + moduleName + '.' + compName + '.'+ newKey  + menuItem.substring(man.index+6+man[1].length) + '\n';
      coordinates[index] = menuItem;
    }
  });

  coordinates= coordinates.join('\n');
console.log(coordinates);
  return coordinates;
}

/**
 * This method is used for transforming the text to the target type.
 * @param caseType
 */
var gulpText = function(moduleName) {
  var editedJson = {};
  moduleName = moduleName.toUpperCase();
  moduleName = moduleName.replace(/-/g, "_");
  console.log("hjdjbhbh jbhxshksd jbhdjbhjhb" + moduleName);
  return through.obj(function (file, enc, callback) {
    var isBuffer = false,
      inputString = null,
      result = null,
      outBuffer=null,
      result1 = null;
    //Empty file and directory not supported
    if (file === null || file.isDirectory()) {
      this.push(file);
      return callback();
    }
    isBuffer = file.isBuffer();
    if(isBuffer){
      inputString = new String(file.contents);
      //console.log(file.path);
      //console.log(file.path);
      const pathChunks = file.path.split('/');
      const comp =  pathChunks[pathChunks.length-2];
      let compName = comp.toUpperCase();
      compName = compName.replace(/-/g, "_");
      result1 = transformJson1(inputString,moduleName,compName);
     //console.log(result1);
     //console.log("sjhjhhjjh sjvjhash szavjvjhsav saghhvg\n\n");
      outBuffer = new Buffer(result1);
      var aFile = new gutil.File();
      //console.log(aFile.path);
     // console.log(file.path);
      aFile.path = file.path;
      //console.log(aFile.path);
      aFile.contents = outBuffer;
     // console.log(inputString);

      callback(null,aFile);
    }else{
      this.emit('error',
        new PluginError(PLUGIN_NAME,
          'Only Buffer format is supported'));
      callback();
    }
  });
};
//Export the Method
module.exports = gulpText;
