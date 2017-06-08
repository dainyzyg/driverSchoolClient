let url;
if (GetQueryString('image')) {
    url = 'imageview.html?image=' + encodeURIComponent(GetQueryString('image'));
} else {
    url = GetQueryString('url');
}

mui.init();
let subpage;
mui.back = function () {
    subpage.back();
};
mui.plusReady(() => {

});
document.addEventListener('initsub', function () {
    console.log('initsub');
    if (!subpage) {
        var self = plus.webview.currentWebview();
        subpage = plus.webview.create(url, "subpage", {
            top: "44px",
            bottom: 0
        });
        self.append(subpage);
        // subpage.onloaded = () => {
        //     console.log('onloaded');
        // }
        subpage.onloaded = () => {
            subpage.canBack(function (e) {
                document.querySelector('#back-icon').style.display = e.canBack ? 'block' : 'none';
            });
        }
    }
});
// let subpage = plus.webview.getWebviewById('subpage');
// subpage.onloaded = () => {
//     console.log('onloaded');
// }
// subpage.onloading = () => {
//     console.log('onloading');
// }
document.querySelector(".mui-title").innerHTML = GetQueryString('title');

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}