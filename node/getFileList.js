/**
 * Created by ad on 2016/2/24.
 */
/**
 * 获取文件夹下面的所有的文件(包括子文件夹)
 * @param {String} dir
 * @param {Function} callback
 * @returns {Array}
 */
var fs = require('fs')
var path = require('path')
//var readDir = fs.readdirSync('./../../pages');
function getFileList(dir) {
    var filesList = [];
    readFile(dir, filesList, dir);
    return filesList;
}

//遍历读取文件
function readFile(dir, filesList, root) {
    var files = fs.readdirSync(dir);//需要用到同步读取
    files.forEach((file)=> {
        var filePath = path.resolve(dir, './' + file)
        var states = fs.statSync(filePath);
        if (states.isDirectory()) {
            readFile(filePath, filesList, root);
        }
        else {
            //创建一个对象保存信息
            var obj = new Object();
            //obj.size = states.size;//文件大小，以字节为单位
            obj.fileName = file;//文件名
            obj.name = path.basename(filePath, path.extname(filePath))
            obj.path = filePath //文件绝对路径
            obj.relative = path.relative(root, filePath).replace('\\','.').replace(/\.jsx?$/,'')
            filesList.push(obj);
        }
    })
}
//console.log(getFileList(path.resolve(__dirname, './../../pages')))
module.exports = getFileList