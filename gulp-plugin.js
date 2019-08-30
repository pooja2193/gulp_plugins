'use strict';
const PLUGIN_NAME = 'gulp-letter-type';
var through = require('through2'),
  gutil = require('gulp-util'),
  PluginError = gutil.PluginError;
var myHtmlPlugin = require('/home/ashwin/ashwin/myfdportal3/src/parse/html-plugin.js');
var gulp = require('gulp');
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

function transformJson1(input,path,editedJson) {
 // console.log("dhjfh");
  const pathChunks = path.split('/');
 const comp =  pathChunks[pathChunks.length-2];
  //const comp = splitComponent[0];
  let dirName = comp.toUpperCase();
  dirName = dirName.replace(/-/g, "_");
  //console.log(dirName);

  if (!editedJson.hasOwnProperty(dirName)) {
    editedJson[dirName] ={};
  }
  var coordinates = input.split( "\n" );
  coordinates.forEach(menuItem => {
    let man =menuItem.match(/&-&(.*)&-&/);
    if(man!=null) {
     // console.log(man);
      var values = man[1].split(',');
      var newKey = values[0];
      newKey = newKey.toUpperCase();
      newKey = newKey.replace(/-/g, "_");
      var newValue = values[1];
      if(editedJson[dirName].hasOwnProperty(newKey)) {
        //console.log(editedJson[dirName][newKey], values[1]);
      }
      editedJson[dirName][newKey] = newValue;
     // console.log(editedJson[dirName][newKey],newKey);
    }
  });
  return editedJson;
}

/**
 * This method is used for transforming the text to the target type.
 * @param caseType
 */
var gulpText = function(caseType,filename,component,destFileContent) {
  if(destFileContent!=='') {
    var editedJson = JSON.parse(destFileContent);
  }
  else{
    var editedJson = {};
  }
  console.log(editedJson);
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
      result1 = transformJson1(inputString,file.path,editedJson);
      outBuffer = new Buffer(JSON.stringify(result1,null,"\t"));
      var aFile = new gutil.File();
      aFile.path = filename;
      aFile.contents = outBuffer;
      //console.log(inputString);
    //var html = function ()return gulp.src(file).pipe(myHtmlPlugin(file,temp.html).pipe(gulp.dest('src/parse/file-manager/share-folder')));
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
