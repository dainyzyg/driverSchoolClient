window.ddSilder = class ddSilder {
	constructor(options) {
		this.options = Object.assign({}, options)
		this.element = document.querySelector(options.el)
		this.width = this.element.clientWidth
		this.data = options.data
		this.currentPage = options.currentPage || 0
		this.init()
		this.bindEvents()
	}
	init() {
		this.driftY = 0
		this.clientRect = this.element.getBoundingClientRect()
		this.currentEl = this.element.children[0]
		this.nextEl = this.element.children[1]
		this.prevEl = this.element.children[2]
		this.currentEl.style.transform = 'translate3d(0,0,0)'
		this.nextEl.style.transform = 'translate3d(100%,0,0)'
		this.prevEl.style.transform = 'translate3d(-100%,0,0)'

		//webkitTransform
		this.currentEl.style.webkitTransform = 'translate3d(0,0,0)'
		this.nextEl.style.webkitTransform = 'translate3d(100%,0,0)'
		this.prevEl.style.webkitTransform = 'translate3d(-100%,0,0)'

		this.renderEl(this.currentEl, this.currentPage)
		this.renderEl(this.nextEl, this.currentPage + 1)
		this.renderEl(this.prevEl, this.currentPage - 1)
	}
	set currentEl(el) {
		this._currentEl = el
		el.classList.add('active')
	}
	get currentEl() {
		return this._currentEl
	}
	set nextEl(el) {
		this._nextEl = el
		el.classList.remove('active')
	}
	get nextEl() {
		return this._nextEl
	}
	set prevEl(el) {
		this._prevEl = el
		el.classList.remove('active')
	}
	get prevEl() {
		return this._prevEl
	}

	set currentPage(index) {
		this._currentPage = index
		this.options.onPageChange && this.options.onPageChange(index)
	}
	get currentPage() {
		return this._currentPage
	}
	renderEl(el, index) {
		//el && (el.innerHTML = data[index] || '')
		let dataItem = window.questionsJson[this.data[index]]
		let isShow = this.options.beforeRender(this.data[index]) ? 'show-answer' : ''
		if (!dataItem) {
			return
		}
		let answers = ''
		let rightIcon = '<span class="mui-icon mui-icon-checkmarkempty">'
		let wrongIcon = '<span class="mui-icon mui-icon-closeempty">'
		let typeName = ''
		switch (dataItem.type) {
			case 1:
				let isA = dataItem.answer.toLowerCase() == 'a'
				answers = `<div class="question-answer" isanswer="${isA}" value="a">
							<div class="option-name">A</div>
							<div class="option-text">正确</div>
							<div class="option-result">
								${dataItem.answer.toLowerCase() == 'a' ? rightIcon : wrongIcon}
							</div>
						</div>
						<div class="question-answer" isanswer="${!isA}" value="b">
							<div class="option-name">B</div>
							<div class="option-text">错误</div>
							<div class="option-result">
								${dataItem.answer.toLowerCase() == 'b' ? rightIcon : wrongIcon}
							</div>
						</div>`
				typeName = '判断'
				break
			case 2:
				['optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'optionF'].forEach(option => {
					let letter = option.replace('option', '')
					let isanswer = dataItem.answer.toLowerCase() == letter.toLowerCase()
					if (dataItem[option]) {
						answers += `<div class="question-answer" isanswer="${isanswer}" value="${letter.toLowerCase()}">
							<div class="option-name">${letter}</div>
							<div class="option-text">${dataItem[option]}</div>
							<div class="option-result">
								${dataItem.answer.toLowerCase() == letter.toLowerCase() ? rightIcon : wrongIcon}
							</div>
						</div>`
					}
				})
				typeName = '单选'
				break
			case 3:
				['optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'optionF'].forEach(option => {
					let letter = option.replace('option', '')
					let isanswer = dataItem.answer.toLowerCase().match(letter.toLowerCase()) ? true : false
					if (dataItem[option]) {
						answers += `<div class="question-answer" isanswer="${isanswer}" value="${letter.toLowerCase()}">
							<div class="option-name">${letter}</div>
							<div class="option-text">${dataItem[option]}</div>
							<div class="option-result">
								${isanswer ? rightIcon : wrongIcon}
							</div>
						</div>`
					}
				})
				typeName = '多选'
				break
			default:
				break
		}
		let media = ''
		if (dataItem.imgUrl || dataItem.videoUrl) {
			media = `<img class="question-img" src="../../testDatabase/res/${dataItem.imgUrl || dataItem.videoUrl.replace('.mp4','.gif')}" />`
		}
		el.innerHTML = `<div class="question ${isShow}" questiontype="${dataItem.type}" answer="${dataItem.answer}" questionId="${this.data[index]}">
			<div class="question-title">
				<div class="question-type">${typeName}</div>
				<span>${index + 1}.${dataItem.title}</span>
			</div>
			<div class="question-media">
				${media}
			</div>
			<div class="question-answers">
				${answers}
			</div>
			<div class="question-button">
				<button type="button" class="mui-btn mui-btn-block confirm">确定</button>
			</div>
			<div class="question-explain">
				<div class="msg-content">
					<div class="msg-content-inner">
						${dataItem.explain1}
					</div>
					<div class="msg-content-arrow"></div>
				</div>
			</div>
		</div>
		`
	}
	bindEvents() {
		//		document.addEventListener('touchmove', function(e) {
		//			e.preventDefault()
		//		})
		'touchstart touchmove touchend'.split(' ').forEach(evn => {
			//将四个触控函数（申明在后面）绑定到每个页面
			this.element.addEventListener(evn, this[evn].bind(this), false)
		})
	}
	touchstart(e) {
		this.flag = null
		this.currentEl.style.transition = 'none'
		this.nextEl.style.transition = 'none'
		this.prevEl.style.transition = 'none'

		//webkitTransform
		this.currentEl.style.webkitTransition = 'none'
		this.nextEl.style.webkitTransition = 'none'
		this.prevEl.style.webkitTransition = 'none'

		var touches = e.touches[0] //触控开始
		this.moveX = 0
		this.moveY = 0
		//记录落点
		this.pageX = touches.pageX
		this.pageY = touches.pageY
	}
	touchmove(e) {
		var touches = e.touches[0]
		var X = touches.pageX - this.pageX
		var Y = touches.pageY - this.pageY
		this.flag = this.flag || (Math.abs(X) > Math.abs(Y) ? 'X' : 'Y')
		if (this.flag === 'X') {
			e.preventDefault()
			e.stopPropagation()
			this.moveX = X
			var isFirst = this.currentPage == 0 ? true : false
			var isLast = this.currentPage == this.data.length - 1 ? true : false
			this.setX(this.currentEl, X, this.driftY)
			X > 0 && !isFirst && this.setX(this.prevEl, X - this.width)
			X < 0 && !isLast && this.setX(this.nextEl, X + this.width)
		} else {
			this.moveY = Y
			this.setY(this.currentEl, Y)
		}

	}
	touchend(e) {
		this.currentEl.style.transition = 'transform .3s ease-out'

		//webkitTransform
		this.currentEl.style.webkitTransition = '-webkit-transform .3s ease-out'

		var minRange = 50
		if (!this.flag) return
		e.preventDefault() //滑动结束前往下一页面,next()方法调用了go()方法
		if (this.moveX < -minRange && this.nextEl && this.currentPage < this.data.length - 1) {
			this.nextEl.style.transition = 'transform .3s ease-out'
			this.nextEl.style.transform = 'translate3d(0,0,0)'

			//webkitTransform
			this.nextEl.style.webkitTransition = '-webkit-transform .3s ease-out'
			this.nextEl.style.webkitTransform = 'translate3d(0,0,0)'

			this.setX(this.currentEl, -this.width, this.driftY)
			this.prevEl && (this.tempEl = this.prevEl)
			this.prevEl = this.currentEl
			this.currentEl = this.nextEl
			this.tempEl && (this.nextEl = this.tempEl)
			this.nextEl.style.transform = 'translate3d(100%,0,0)'

			//webkitTransform
			this.nextEl.style.webkitTransform = 'translate3d(100%,0,0)'

			this.currentPage++
				this.renderEl(this.nextEl, this.currentPage + 1)
			this.driftY = 0
		} else if (this.moveX > minRange && this.prevEl && this.currentPage > 0) {
			this.prevEl.style.transition = 'transform .3s ease-out'
			this.prevEl.style.transform = 'translate3d(0,0,0)'

			//webkitTransform
			this.prevEl.style.webkitTransition = '-webkit-transform .3s ease-out'
			this.prevEl.style.webkitTransform = 'translate3d(0,0,0)'

			this.setX(this.currentEl, this.width, this.driftY)
			this.nextEl && (this.tempEl = this.nextEl)
			this.nextEl = this.currentEl
			this.currentEl = this.prevEl
			this.tempEl && (this.prevEl = this.tempEl)
			this.prevEl.style.transform = 'translate3d(-100%,0,0)'

			//webkitTransform
			this.prevEl.style.webkitTransform = 'translate3d(-100%,0,0)'

			this.currentPage--
				this.renderEl(this.prevEl, this.currentPage - 1)
			this.driftY = 0
		} else if (this.moveX > 0) {
			this.prevEl.style.transition = 'transform .3s ease-out'
			this.prevEl.style.transform = 'translate3d(-100%,0,0)'
			this.currentEl.style.transform = `translate3d(0,${this.driftY}px,0)`

			//webkitTransform
			this.prevEl.style.webkitTransition = '-webkit-transform .3s ease-out'
			this.prevEl.style.webkitTransform = 'translate3d(-100%,0,0)'
			this.currentEl.style.webkitTransform = `translate3d(0,${this.driftY}px,0)`

		} else if (this.moveX < 0) {
			this.nextEl.style.transition = 'transform .3s ease-out'
			this.currentEl.style.transform = `translate3d(0,${this.driftY}px,0)`
			this.nextEl.style.transform = 'translate3d(100%,0,0)'

			//webkitTransform
			this.nextEl.style.webkitTransition = '-webkit-transform .3s ease-out'
			this.currentEl.style.webkitTransform = `translate3d(0,${this.driftY}px,0)`
			this.nextEl.style.webkitTransform = 'translate3d(100%,0,0)'
		}
		if (this.flag == 'Y') {
			var clientRect = this.currentEl.getBoundingClientRect()
			if (this.clientRect.top < clientRect.top) {
				this.currentEl.style.transition = 'transform .3s ease-out'
				this.currentEl.style.transform = 'translate3d(0,0,0)'

				//webkitTransform
				this.currentEl.style.webkitTransition = '-webkit-transform .3s ease-out'
				this.currentEl.style.webkitTransform = 'translate3d(0,0,0)'

				this.driftY = 0
			} else if (this.clientRect.top + this.clientRect.height > clientRect.top + clientRect.height) {
				this.currentEl.style.transition = 'transform .3s ease-out'

				//webkitTransform
				this.currentEl.style.webkitTransition = '-webkit-transform .3s ease-out'

				if (this.clientRect.height >= clientRect.height) {
					this.currentEl.style.transform = 'translate3d(0,0,0)'

					//webkitTransform
					this.currentEl.style.webkitTransform = 'translate3d(0,0,0)'

					this.driftY = 0
				} else {
					let height = this.clientRect.height - clientRect.height
					this.currentEl.style.transform = `translate3d(0,${height}px,0)`

					//webkitTransform
					this.currentEl.style.webkitTransform = `translate3d(0,${height}px,0)`

					this.driftY = height
				}

			} else {
				this.driftY = this.driftY + this.moveY
			}

		}
	}
	go(index) {
		this.currentPage = index
		this.renderEl(this.currentEl, this.currentPage)
		this.renderEl(this.nextEl, this.currentPage + 1)
		this.renderEl(this.prevEl, this.currentPage - 1)
	}
	next() {
		if (this.currentPage >= this.data.length - 1) {
			return;
		}
		this.currentEl.style.transition = 'transform .3s ease-out'
		this.nextEl.style.transition = 'transform .3s ease-out'
		this.nextEl.style.transform = 'translate3d(0,0,0)'

		//webkitTransform
		this.currentEl.style.webkitTransition = '-webkit-transform .3s ease-out'
		this.nextEl.style.webkitTransition = '-webkit-transform .3s ease-out'
		this.nextEl.style.webkitTransform = 'translate3d(0,0,0)'

		this.setX(this.currentEl, -this.width, this.driftY)
		this.prevEl && (this.tempEl = this.prevEl)
		this.prevEl = this.currentEl
		this.currentEl = this.nextEl
		this.tempEl && (this.nextEl = this.tempEl)
		this.nextEl.style.transform = 'translate3d(100%,0,0)'

		////webkitTransform
		this.nextEl.style.webkitTransform = 'translate3d(100%,0,0)'

		this.currentPage++;
		this.renderEl(this.nextEl, this.currentPage + 1)
		this.driftY = 0
	}
	setX(el, x, y = 0) {
		el && (el.style.transform = `translate3d(${x}px,${y}px,0)`)

		//webkitTransform
		el && (el.style.webkitTransform = `translate3d(${x}px,${y}px,0)`)

	}
	setY(el, y, unit) {
		y += this.driftY
		el && (el.style.transform = 'translate3d(0,' + y + (unit || 'px') + ',0)')

		//webkitTransform
		el && (el.style.webkitTransform = 'translate3d(0,' + y + (unit || 'px') + ',0)')

	}
}