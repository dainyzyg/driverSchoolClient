mui.init()
mui.plusReady(function () {
	var camera = document.querySelector(".camera")
	camera.addEventListener('tap', function (event) {
		var btnArray = [{
			title: "拍照"
		}, {
			title: "从相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: "选择照片",
			cancel: "取消",
			buttons: btnArray
		}, function (e) {
			var index = e.index;
			switch (index) {
				case 0:
					break;
				case 1:
					var cmr = plus.camera.getCamera();
					cmr.captureImage(function (path) {
						console.log('captureImage', path)
						console.log(plus.io.convertLocalFileSystemURL(path))
						var picture = document.getElementById("picture")
						picture.src = "file://" + plus.io.convertLocalFileSystemURL(path)
					}, function (err) {});
					break;
				case 2:
					plus.gallery.pick(function (e) {
						// console.log(path)
						// var picture = document.getElementById("picture")
						// picture.src = path
						var name = e.substr(e.lastIndexOf('/') + 1);
						console.log('e:' + e);
						console.log("name:" + name);

						plus.zip.compressImage({
							src: e,
							dst: '_doc/' + name,
							overwrite: true,
							quality: 50
						}, function (zip) {
							console.log(JSON.stringify(zip));
							var picture = document.getElementById("picture")
							picture.src = zip.target;
						}, function (zipe) {
							mui.toast('压缩失败！')
						});
					}, function (err) {}, null);
					break;
			}
		});
	}, false);
})