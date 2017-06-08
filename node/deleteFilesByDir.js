/**
 * Created by ad on 2016/3/1.
 */
var fs = require('fs')
var path = require('path')

var dirPaths = []
function deleteFilesByDir(dir) {
    var filesList = []
    deleteFiles(dir, filesList, dir)
    rmdirSync()
}

function rmdirSync() {
    dirPaths.forEach(dirPath=> {
        fs.rmdirSync(dirPath)
    })
}
//遍历读取文件
function deleteFiles(dir) {
    var files = fs.readdirSync(dir);//需要用到同步读取
    files.forEach((file)=> {
        var filePath = path.resolve(dir, './' + file)
        var states = fs.statSync(filePath)
        if (states.isDirectory()) {
            deleteFiles(filePath)
            dirPaths.push(filePath)
        }
        else {
            fs.unlinkSync(filePath)
        }
    })
}
module.exports = deleteFilesByDir