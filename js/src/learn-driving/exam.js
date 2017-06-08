//require('babel-polyfill')
mui.init()
let mappingPath = `../../testDatabase/${GetQueryString('mapping')}`
let questionsJsonPath = `../../testDatabase/${GetQueryString('questionsJson')}`

let currentPage = 0
mui.ajax(mappingPath, {
	dataType: 'json', //服务器返回json格式数据
	type: 'get', //HTTP请求类型
	timeout: 10000, //超时时间设置为10秒；
	success: function (data) {
		let randomArray = getArrayItems(data, 100)
		initQuestionMenu(randomArray)
		setData({
			mapping: randomArray
		})
	},
	error: function (xhr, type, errorThrown) {
		//异常处理；
		console.log('ajax', type);
	}
})

mui.ajax(questionsJsonPath, {
	dataType: 'json', //服务器返回json格式数据
	type: 'get', //HTTP请求类型
	timeout: 10000, //超时时间设置为10秒；
	success: function (data) {
		setData({
			questionsJson: data
		})
	},
	error: function (xhr, type, errorThrown) {
		//异常处理；
		console.log('ajax', type);
	}
})

function initQuestionMenu(list) {
	var innerHtml = ''
	for (var i = 0; i < list.length; i++) {
		innerHtml += `<div class="menu-content-item">${i + 1}</div>`
	}
	innerHtml += '<span></span><span></span>	<span></span><span></span><span></span><span></span>'
	document.querySelector(".menu-content").innerHTML = innerHtml
}
//从一个给定的数组arr中,随机返回num个不重复项
function getArrayItems(arr, num) {
	//新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
	var temp_array = new Array();
	for (var index in arr) {
		temp_array.push(arr[index]);
	}
	//取出的数值项,保存在此数组
	var return_array = new Array();
	for (var i = 0; i < num; i++) {
		//判断如果数组还有可以取出的元素,以防下标越界
		if (temp_array.length > 0) {
			//在数组中产生一个随机索引
			var arrIndex = Math.floor(Math.random() * temp_array.length);
			//将此随机索引的对应的数组元素值复制出来
			return_array[i] = temp_array[arrIndex];
			//然后删掉此索引的数组元素,这时候temp_array变为新的数组
			temp_array.splice(arrIndex, 1);
		} else {
			//数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
			break;
		}
	}
	return return_array;
}

function initData() {
	doExercise.wrongList = new Set()
	doExercise.rightList = new Set()

}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

function setData(d) {
	setData.data = Object.assign(setData.data || {}, d)
	setData.data.mapping && setData.data.questionsJson && initSilder(setData.data)
}

function onPageChange(index) {

}

function setDoExerciseInfo() {
	document.querySelector(".wrong-number .number-content").innerHTML = doExercise.wrongList.size
	document.querySelector(".right-number .number-content").innerHTML = doExercise.rightList.size
	document.querySelector(".nd-number .number-content").innerHTML = window.questionCount - doExercise.wrongList.size - doExercise.rightList.size
}

function doExercise(answerInfo) {
	if (answerInfo.result) {
		doExercise.rightList.add(answerInfo.questionid)
		doExercise.wrongList.delete(answerInfo.questionid)
	} else {
		doExercise.rightList.delete(answerInfo.questionid)
		doExercise.wrongList.add(answerInfo.questionid)
	}
	doExercise.detail[answerInfo.questionid] = answerInfo
	setDoExerciseInfo()
}

function beforeRender(questionid) {
	if (window.learn) {
		return true
	}
	let isShow = doExercise.detail[questionid] ? true : false
	return isShow
}

function initProgress() {
	initProgress.time = 0
	let timeTotal = GetQueryString('type') == '1' ? 2700 : 1800
	document.querySelector('.timeLeft').innerHTML = getTimeLeft(initProgress.time, timeTotal)
	var si = setInterval(timeGo, 1000)

	function timeGo() {
		initProgress.time++
			mui("#progressbar").progressbar({
				progress: initProgress.time / timeTotal * 100
			}).show()
		document.querySelector('.timeLeft').innerHTML = getTimeLeft(initProgress.time, timeTotal)
		if (initProgress.time == timeTotal) {
			clearInterval(si)
		}
	}

	function getTimeLeft(time, timeTotal) {
		let leftTime = timeTotal - time
		let minute = Math.floor(leftTime / 60)
		let second = leftTime % 60
		minute < 10 && (minute = '0' + minute)
		second < 10 && (second = '0' + second)
		return `${minute}:${second}`
	}

}

function getTimeUsed() {
	let minute = Math.floor(initProgress.time / 60)
	let second = initProgress.time % 60
	minute < 10 && (minute = '0' + minute)
	second < 10 && (second = '0' + second)
	return `${minute}:${second}`
}

function initSilder(data) {
	window.questionsJson = data.questionsJson
	window.questionCount = data.mapping.length
	doExercise.detail = {}
	initData()
	setDoExerciseInfo()
	var silder = new ddSilder({
		el: '.pages',
		data: data.mapping,
		currentPage: 0,
		onPageChange: onPageChange,
		beforeRender: beforeRender
	})
	initProgress()
	mui('.pages').on('tap', '.question-button', function (e) {
		let questionEl = document.querySelector('.active .question')
		let answerInfo = {}
		answerInfo.questionid = questionEl.getAttribute('questionid')
		answerInfo.type = questionEl.getAttribute('questiontype')
		answerInfo.answer = ''
		if (doExercise.detail[answerInfo.questionid] || questionEl.classList.contains('show-answer')) {
			return
		}
		let preSelected = document.querySelectorAll('.active .question .pre-selected')
		for (let i = 0; i < preSelected.length; i++) {
			preSelected[i].classList.add('selected')
			answerInfo.answer += preSelected[i].getAttribute('value')
		}
		if (answerInfo.answer == questionEl.getAttribute('answer')) {
			answerInfo.result = true
			doExercise(answerInfo)
			silder.next()
		} else {
			answerInfo.result = false
			doExercise(answerInfo)
			questionEl.classList.add('show-answer')
		}
	})
	mui(".pages").on('tap', '.question-answer', function (e) {
		let answerInfo = {}
		answerInfo.questionid = this.parentNode.parentNode.getAttribute('questionid')
		answerInfo.type = this.parentNode.parentNode.getAttribute('questiontype')
		answerInfo.answer = this.getAttribute('value')
		if (doExercise.detail[answerInfo.questionid] || document.querySelector('.active .question').classList.contains('show-answer')) {
			return
		}
		if (answerInfo.type == '3') {
			this.classList.toggle('pre-selected')
		} else {
			this.classList.add('selected')

			if (this.getAttribute('isanswer') == 'true') {
				answerInfo.result = true
				doExercise(answerInfo)
				silder.next()
			} else {
				answerInfo.result = false
				doExercise(answerInfo)
				this.parentNode.parentNode.classList.add('show-answer')
			}
		}
	})
	mui(".menu-content").on('tap', '.menu-content-item', function (e) {
		silder.go(this.innerHTML - 1)
		document.querySelector('.question-menu').classList.remove('expand')
		mask.close()
	})
	var collapseMenu = () => {
		document.querySelector('.question-menu').classList.remove('expand')
	}
	var mask = mui.createMask(collapseMenu); //callback为用户点击蒙版时自动执行的回调；
	document.querySelector('.menu-collapse').addEventListener('tap', () => {
		let expand = document.querySelector('.question-menu').classList.toggle('expand')
		if (expand) {
			mask.show()
		} else {
			mask.close()
		}
	})

	document.querySelector('.submit').addEventListener('tap', function (e) {
		var btnArray = ['取消', '确认'];
		mui.confirm('还未答完试卷，确认交卷？', '', btnArray, function (e) {
			if (e.index == 1) {
				let point = GetQueryString('type') == '1' ? 1 : 2
				document.querySelector('.question-result').classList.add('show')
				document.querySelector('.rights').innerHTML = doExercise.rightList.size
				document.querySelector('.wrongs').innerHTML = doExercise.wrongList.size
				document.querySelector('.scores').innerHTML = doExercise.rightList.size * point
				document.querySelector('.time-used').innerHTML = getTimeUsed()

			} else {
				console.log('bujiao')
			}
		})
	})
}