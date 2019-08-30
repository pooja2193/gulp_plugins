var gulp = require('gulp'),
  jsonMerge = require('gulp-merge-json'),
  path = require('path');
var json_merge_en = 'src/app/*/**/en.json';
var json_merge_es = 'src/app/*/**/es.json';
//var path_html ='src/parse/file-manager/*/**/*.html';
var path_html ='src/parse/file-manager1/**/*.html';
var path_html1 ='src/parse/file-manager1/**/*.html';
var argv = require('yargs').argv;
var fs = require("fs");
var add = require('gulp-add');
var concat = require('gulp-concat');
var myplugin =require('/home/ashwin/ashwin/myfdportal3/src/parse/gulp-plugin.js');
var myHtmlPlugin = require('/home/ashwin/ashwin/myfdportal3/src/parse/html-plugin.js');




function jsonMergeEn() {
  return gulp.src(json_merge_en)
    .pipe(jsonMerge({
      fileName: 'en.json',
      edit: function (parsedJson, file) {
        const filename = path.dirname(file.path);
        const dirArray = filename.split(path.sep);
        let dirName = dirArray[dirArray.length - 2].toUpperCase();
        dirName = dirName.replace(/-/g, "_");
        const editedJson = {};
        editedJson[dirName] = parsedJson;
        return editedJson;
      }
    }))
    .pipe(gulp.dest('src/assets/i18n'));
};

function jsonMergeEs() {
  return gulp.src(json_merge_es)
    .pipe(jsonMerge({
      fileName: 'es.json',
      edit: function (parsedJson, file) {
        const filename = path.dirname(file.path);
        const dirArray = filename.split(path.sep);
        let dirName = dirArray[dirArray.length - 2].toUpperCase();
        dirName = dirName.replace(/-/g, "_");
        const editedJson = {};
        editedJson[dirName] = parsedJson;
        return editedJson;
      }
    }))
    .pipe(gulp.dest('src/assets/i18n'));
}

gulp.task('buildJson', gulp.series(jsonMergeEn, jsonMergeEs));


// transformation
function transformJson(input,component) {
  const result = { nav: {} };
  const editedJson = {};
  let dirName = component.toUpperCase();
  dirName = dirName.replace(/-/g, "_");
  console.log(dirName);
  editedJson[dirName] ={};
  var coordinates = input.split( "\n" );
  coordinates.forEach(menuItem => {
    let man =menuItem.match(/&-&(.*)&-&/);
    if(man!=null) {
      let obj = JSON.parse(man[1]);
      //var left_text = menuItem.substring(0, menuItem.indexOf("&-&"));
      var newKey = obj.key;
      var newValue = obj.value;
      //console.log(editedJson);
      editedJson[dirName][newKey] = newValue;
    }
  });
  console.log(JSON.stringify(editedJson));
  return editedJson;
}



function formJson(){
  files = fs.readFileSync( "src/parse/src/parse/3.html");
  const transformed = transformJson(files.toString(),argv.component);
  const stringified = JSON.stringify(transformed);
  return stringified;
}

gulp.task('some-task', function() {
  return gulp.src(['src/parse/src/parse/1.json'])
    .pipe(add({
      'e.json': formJson()
    }))
    .pipe(gulp.dest('src/parse/src/parse'));
});

function transformJson1(input,component) {
  const result = { nav: {} };
  const editedJson = {};
  let dirName = component.toUpperCase();
  dirName = dirName.replace(/-/g, "_");
  console.log(editedJson[dirName]);
  editedJson[dirName] ={};
  var coordinates = input.split( "\n" );
  coordinates.forEach(menuItem => {
    let man =menuItem.match(/&-&(.*)&-&/);
    if(man!=null) {
      console.log(man[1]);
      var values = man[1].split(',');
      // var values = text.split(',');
      var newKey = values[0];
      newKey = newKey.toUpperCase();
      newKey = newKey.replace(/-/g, "_");
      var newValue = values[1];
      editedJson[dirName][newKey] = newValue;
    }
  });
  console.log(JSON.stringify(editedJson,null, "\t"));
  return editedJson;
}



function formJson1(){
  files = fs.readFileSync( "src/parse/src/parse/2.html");
  const transformed = transformJson1(files.toString(),argv.component);
  const stringified = JSON.stringify(transformed,null,"\t");
  return stringified;
}


gulp.task('some-task2', function() {
  return gulp.src(['src/parse/src/parse/1.json'])
    .pipe(add({
      'en.json': formJson1()
    }))
    .pipe(gulp.dest('src/parse/src/parse'));
});

gulp.task('some-task3',function () {
  console.log(path_html);
  var fileContent = fs.readFileSync("/home/ashwin/ashwin/myfdportal3/src/parse/file-manager/share-folder/en.json",
    "utf8");
  return gulp.src(path_html)
    .pipe(myplugin('uppercase','en.json',argv.component,fileContent))
    .pipe(gulp.dest('src/parse/file-manager1/share-folder'));
});

gulp.task('some-task4',function () {
  return gulp.src(path_html1,{base:'src/parse/file-manager1'})
    .pipe(myHtmlPlugin(argv.moduleName))
    .pipe(gulp.dest('./'));
});
