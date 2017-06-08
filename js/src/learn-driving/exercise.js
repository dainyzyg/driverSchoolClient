//require('babel-polyfill')
mui.init()
let mappingPath = `../../testDatabase/${GetQueryString('mapping')}`
let questionsJsonPath = `../../testDatabase/${GetQueryString('questionsJson')}`
let wrongList = `wrongList-${GetQueryString('mapping')}`
let rightList = `rightList-${GetQueryString('mapping')}`
let wrongListTotal = `wrongList-originalMapping${GetQueryString('type')}.json`
let rightListTotal = `rightList-originalMapping${GetQueryString('type')}.json`
let favoriteList = `favoriteList${GetQueryString('type')}`
let currentPage = GetQueryString('mapping')
mui.ajax(mappingPath, {
	dataType: 'json', //服务器返回json格式数据
	type: 'get', //HTTP请求类型
	timeout: 10000, //超时时间设置为10秒；
	success: function (data) {
		initQuestionMenu(data)
		setData({
			mapping: data
		})
	},
	error: function (xhr, type, errorThrown) {
		//异常处理；
		console.log('ajax', type);
	}
})
mui.plusReady(function () {
	window.storage = plus.storage
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
})

function initQuestionMenu(list) {
	var innerHtml = ''
	for (var i = 0; i < list.length; i++) {
		innerHtml += `<div class="menu-content-item">${i + 1}</div>`
	}
	innerHtml += '<span></span><span></span>	<span></span><span></span><span></span><span></span>'
	document.querySelector(".menu-content").innerHTML = innerHtml
}

function initData() {
	doExercise.wrongList = new Set()
	doExercise.rightList = new Set()
	doExercise.wrongListTotal = new Set()
	doExercise.rightListTotal = new Set()
	doExercise.favoriteList = new Set()
	if (storage.getItem(wrongList)) {
		doExercise.wrongList = new Set(JSON.parse(storage.getItem(wrongList)))
	}
	if (storage.getItem(rightList)) {
		doExercise.rightList = new Set(JSON.parse(storage.getItem(rightList)))
	}
	if (storage.getItem(favoriteList)) {
		doExercise.favoriteList = new Set(JSON.parse(storage.getItem(favoriteList)))
	}
	if (storage.getItem(rightListTotal)) {
		doExercise.rightListTotal = new Set(JSON.parse(storage.getItem(rightListTotal)))
	}
	if (storage.getItem(wrongListTotal)) {
		doExercise.wrongListTotal = new Set(JSON.parse(storage.getItem(wrongListTotal)))
	}
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
	document.querySelector(".menu-record>span").innerHTML = `${index + 1}/${window.questionCount}`
	plus.storage.setItem(currentPage, index.toString())
}

function setDoExerciseInfo() {
	document.querySelector(".wrong-number .number-content").innerHTML = doExercise.wrongList.size
	document.querySelector(".right-number .number-content").innerHTML = doExercise.rightList.size
	document.querySelector(".nd-number .number-content").innerHTML = window.questionCount - doExercise.wrongList.size - doExercise.rightList.size
}

function doExercise(answerInfo) {
	if (answerInfo.result) {
		doExercise.rightList.add(answerInfo.questionid)
		doExercise.rightListTotal.add(answerInfo.questionid)
		doExercise.wrongList.delete(answerInfo.questionid)
		doExercise.wrongListTotal.delete(answerInfo.questionid)
	} else {
		doExercise.rightList.delete(answerInfo.questionid)
		doExercise.rightListTotal.delete(answerInfo.questionid)
		doExercise.wrongList.add(answerInfo.questionid)
		doExercise.wrongListTotal.add(answerInfo.questionid)
	}
	doExercise.detail[answerInfo.questionid] = answerInfo
	setDoExerciseInfo()
	storage.setItem(wrongList, JSON.stringify(Array.from(doExercise.wrongList)))
	storage.setItem(rightList, JSON.stringify(Array.from(doExercise.rightList)))
	storage.setItem(wrongListTotal, JSON.stringify(Array.from(doExercise.wrongListTotal)))
	storage.setItem(rightListTotal, JSON.stringify(Array.from(doExercise.rightListTotal)))
}

function beforeRender(questionid) {
	if (window.learn) {
		return true
	}
	let isShow = doExercise.detail[questionid] ? true : false
	return isShow
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
		currentPage: storage.getItem(currentPage) && parseInt(storage.getItem(currentPage)) || 0,
		onPageChange: onPageChange,
		beforeRender: beforeRender
	})
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
		document.querySelector('.question-menu').classList.remove('expand')
		mask.close()
	})
	document.querySelector('.menu-record').addEventListener('tap', function () {
		mask.show(); //显示遮罩
		document.querySelector('.question-menu').classList.add('expand')
	})
	document.querySelector('.menu-flash').addEventListener('tap', function () {
		console.log('.menu-flash')
	})
	document.querySelector('.menu-explain').addEventListener('tap', function () {
		if (document.querySelector('.active .question').classList.contains('show-answer')) {
			document.querySelector('.active .question').classList.remove('show-answer')
		} else {
			document.querySelector('.active .question').classList.add('show-answer')
		}
	})
	document.querySelector('.menu-favorite').addEventListener('tap', function () {
		let questionid = document.querySelector('.active .question').getAttribute('questionid')
		if (doExercise.favoriteList.has(questionid)) {
			doExercise.favoriteList.delete(questionid)
			mui.toast('取消收藏')
		} else {
			doExercise.favoriteList.add(questionid)
			mui.toast('收藏成功')
		}
		storage.setItem(favoriteList, JSON.stringify(Array.from(doExercise.favoriteList)))
	})
	document.querySelector('.mui-title').addEventListener('tap', function (e) {
		let questions = document.querySelectorAll('.question')
		switch (e.target.className) {
			case 'title-learn':
				for (let i = 0; i < questions.length; i++) {
					questions[i].classList.add('show-answer')
				}
				this.classList.add('learn')
				this.classList.remove('exercise')
				window.learn = true
				break
			case 'title-exercise':
				for (let i = 0; i < questions.length; i++) {
					questions[i].classList.remove('show-answer')
				}
				this.classList.remove('learn')
				this.classList.add('exercise')
				window.learn = false
				break
		}
	})
}