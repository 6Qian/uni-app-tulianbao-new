import $aes from "./ar-aes.js";
module.exports = {
	//接口访问地址
	host: "https://api.whjcf.top/api",
	api(){ //api地址
		let apiList = {
			dev: "https://api.whjcf.top/api", 
			prod: "https://api.whjcf.top/api"
		}
		return apiList[this.getServerProd()];
	},
	systemInfo: uni.getSystemInfoSync(),

	//是否为苹果手机
	isIOS: uni.getSystemInfoSync().osName === "android" ? false : true,

	//无需登录白名单内容页
	noMustLogin: [
		"/pages/home/index",
		"/pages/release/index",
		"/pages/mine/index",
		"/pages/webview/index",
		"/pages/webview/ysxy",
		"/pages/webview/yhxy",
		"/pages/public/login",
		"/pages/public/smslogin",
		"/pages/task/project_detail",
	],
	generateRandomFourDigitNumber() {
	    let randomNumber = Math.floor(Math.random() * 9000) + 1000;
	    return randomNumber.toString();
	},
	apple(payid, orderid , type) {
		/* 	1苹果支付码，字符串 
			2订单id后面抛回去 苹果支付不能获取支付结果，要在支付完调接口修改订单状态
			3类型，主要给自己判断在哪里支付的
		*/
		let that = this
		console.log(payid, orderid)
		plus.payment.getChannels((channels) => {
			console.log(1);
			console.log(channels);
			for (var i in channels) {
				var channel = channels[i];
				if (channel.id == 'appleiap') {
					console.log("苹果")
					let iap = channel;
					//支付参数
					iap.requestOrder([payid], function(orderList) {
						//必须调用此方法才能进行 iap 支付 
						console.log('requestOrder success666: ' + JSON.stringify(orderList))
						that.applePay(orderList[0] , orderid , type)
					}, function(e) {
						console.log(e)
						// console.log('requestOrder failed: ' + JSON.stringify(e));
						// console.log('暂不支持苹果 iap 支付')
					});
				}
			}
		}, function(e) {
			console.log("获取iap支付通道失败：" + e.message);
		});
	},
	applePay(para , orderid , type) {
		setTimeout(()=>{
			uni.hideToast()
		},1000)
		console.log(para)
		uni.requestPayment({
			provider: 'appleiap',
			orderInfo: {
				productid: para.productid,
				username: orderid, // 用户标识
				optimize: true // 设置 optimize: true 解决丢单问题  
			},
			/* 
			orderInfo可传参数一览
			productid: (String 类型 )(必填) 商品的标识，你在苹果那里添加的商品标识 
			username: (String 类型 )(可选) 购买用户名称，我喜欢在这里传入订单号，这样支付成功时就可以获得订单号 
			quantity: (String 类型 )(可选) 商品数量，默认为 "1" 
			optimize:(Boolean)(可选) HX 3.1.10 版本新增参数，解决用户未绑定支付方式造成的丢单问题； 
			*/
			success: (es) => {
				console.log(es)
				let params = {
					TransactionID: es.transactionIdentifier,
					Payload: es.transactionReceipt,
					orderId: orderid,
				}
				if(type) {
					//参数调接口改变订单状态
					uni.$emit('paymentSuccess', {
						...params,
						type: type
					})
				}else {
					uni.$emit('paymentSuccess', {
						...params
					})
				}
				
			},
			fail: (err) => {
				console.log('取消支付',err);
			},
			complete: () => {
				// console.log("payment结束");
			}
		})
	},

	//获取当前是测试服还是正式服
	getServerProd() {
		var apiServer = uni.getStorageSync("apiServer");
		if (apiServer) {
			if (apiServer == "dev" || apiServer == "prod") {
				return apiServer;
			} else {
				return "prod";
			}
		} else {
			return process.env.NODE_ENV === "development" ? "dev" : "prod";
		}
	},

	
	
	// 获取OAID
	getOAID() {
		let _this = this;
		return new Promise((resolve) => {
			if(uni.getStorageSync("oaid")){
				resolve(uni.getStorageSync("oaid"));
				return;
			}
			
			// #ifdef APP-PLUS
			if(_this.isIOS){
				uni.setStorageSync("oaid", "0");
				resolve("0");
			}else{
				resolve("0");
				
				/*
				const oaidTool = uni.requireNativePlugin("oaid-tool");
				oaidTool.getOAID((str) => {
					uni.setStorageSync("oaid", str);
					resolve(str)
				});
				*/
			}
			return;
			// #endif
			
			// #ifndef APP-PLUS
			uni.setStorageSync("oaid", "0");
			resolve("0");
			return;
			// #endif
		});
	},

	// 将文件直传到阿里云
	uploadOss(e) {
		let _this = this;
	
		// load变化回调
		if (e.loadCall) {
			e.loadCall({type: "open",text: "获取上传参数..",});
		}
	
		// 是否打开load
		if (e.load) {
			_this.showLoading();
		}
		
		
		// load变化回调
		if (e.loadCall) {
			e.loadCall({type: "open",text: "上传中.."});
		}
		
		let uploadTask = uni.uploadFile({
			url: _this.api() +  "/user/upload",
			filePath: e.filePath,
			name: "file",
			formData: { prefix: e.prefix || ""},
			timeout: 1000 * 60 * 10,
			header: _this.headers(),
			success: (res) => {
				if (e.load) {
					_this.hideLoading();
				}
				
				if (e.loadCall) {
					e.loadCall({type: "close"});
				}
				
				if (res.statusCode == 200) {
					let ret = JSON.parse(res.data);
					
					e.success && e.success(ret);
				} else {
					if (e.error) {
						e.error("上传失败，网络异常");
					} else {
						_this.toast("上传失败，网络异常");
					}
				}
			},
			fail: (res) => {
				console.log(res);
				if (res.errMsg == "uploadFile:fail abort") {} else {
					if (e.error) {
						e.error("上传失败，网络异常");
					} else {
						_this.toast("上传失败，网络异常");
					}
				}
			},
			complete: (res) => {
				setTimeout(() => {
					uploadTask.offProgressUpdate();
							
					if (e.load) {
						_this.hideLoading();
					}
							
					if (e.loadCall) {
						e.loadCall({type: "close"});
					}
					e.done && e.done(res);
				}, 200);
			},
		});
							
		e.uploadTask && e.uploadTask(uploadTask);
		uploadTask.onProgressUpdate((res) => {
			// console.log(res);
							
			// load变化回调
			if (e.loadCall) {
				const progress = res.progress;
				e.loadCall({type: "open",text: `当前已上传${progress}%`});
			}
			e.progress && e.progress(res);
		});
	},

	//网络请求方法
	ajax(option) {
		var _this = this;
		if (option.load) {
			_this.showLoading();
		}
		
		var opt = {
			url: _this.api() + option.url,
			data: option.data || {},
			method: option.method || "get",
			header: option.header || _this.headers(),
			timeout: 1000 * 60,
			success: (res) => {
				_this.isLogPush && console.log("[HTTP Response]: ", res);
				option.load && _this.hideLoading();

				//if(res.data.data && res.data.data.complain_id){
				// 	setTimeout(()=>{
				// 		uni.navigateTo({
				// 			url:'/pages/banned/index'+'?complain_id='+res.data.data.complain_id+"&complain_token="+res.data.data.complain_token
				// 		})
				// 	},1500)
				// }
				if (res.data.code == 401) {
					
					_this.loginExit();
					if(option.logout){
						option.logout(res.data);
					}else{
						_this.toast('请先登陆');
					}
				} else {
					option.success && option.success(res.data);
				}
			},
			fail: (res) => {
				option.load && _this.hideLoading();
				uni.getNetworkType({
					success(net) {
						if (net.networkType == "none") {
							if (option.error) {
								option.error && option.error({message: "请检查您的手机网络!",});
							} else {
								_this.toast("请检查您的手机网络!");
							}
						} else {
							option.load && _this.hideLoading();

							if (res.errMsg == "request:fail abort") {
								// 主动中断，不做处理
							} else {
								if (option.error) {
									option.error && option.error({message: "网络错误!",});
								} else {
									_this.toast("网络错误!");
								}
							}
						}
					},
				});
			},
			complete: (res) => {
				uni.stopPullDownRefresh();
				if (option.feed) {
					_this.feedbackGeneratorState();
				}
				option.done && option.done(res);
			},
			formData: option.data || {},
		};
		var requestTask = uni.request(opt);
		option.requestTask && option.requestTask(requestTask);
	},

	// 下载文件
	downloadFile(e) {
		let _this = this;

		// load变化回调
		if (e.loadCall) {
			e.loadCall({
				type: "open",
				text: "开始下载..",
			});
		}

		// 是否打开load
		if (e.load) {
			_this.showLoading();
		}

		var downloadTask = uni.downloadFile({
			url: e.url,
			timeout: 1000 * 60 * 60,
			success: (res) => {
				if (e.load) {
					_this.hideLoading();
				}

				if (e.loadCall) {
					e.loadCall({
						type: "close",
					});
				}

				if (res.statusCode == 200) {
					e.success && e.success(res);
				} else {
					if (e.error) {
						e.error("下载失败，网络异常");
					} else {
						_this.toast("下载失败，网络异常");
					}
				}
			},
			fail: (res) => {
				if (res.errMsg == "downloadFile:fail abort") {} else {
					if (e.error) {
						e.error("下载失败，网络异常");
					} else {
						_this.toast("下载失败，网络异常");
					}
				}
			},
			complete: (res) => {
				setTimeout(() => {
					downloadTask.offProgressUpdate();
					if (e.load) {
						_this.hideLoading();
					}

					if (e.loadCall) {
						e.loadCall({
							type: "close",
						});
					}

					e.done && e.done(res);
				}, 200);
			},
		});

		e.downloadTask && e.downloadTask(downloadTask);

		downloadTask.onProgressUpdate((res) => {
			// load变化回调
			if (e.loadCall) {
				e.loadCall({
					type: "open",
					text: `已下载${res.progress}%`,
				});
			}
			e.progress && e.progress(res);
		});
	},

	//获取token
	token() {
		if (this.isLogin()) {
			let userInfo = this.getUserInfo();
			return userInfo.token;
		} else {
			return "";
		}
	},

	//生成headers
	headers() {
		let _this = this;
		let system = uni.getSystemInfoSync();
		let time = parseInt(new Date().getTime() / 1000);
		let oaid = uni.getStorageSync("oaid") || "";
		_this.getOAID();
		
		let header = {
			'authorization': _this.token(),  //鉴权token
			// "Content-Type": "application/json",
			"Login-Type": _this.getUseType() == "app" ? 1 : 2, //用户使用设备 app还是H5
			"Time": time || "", //请求时间戳
			"systemType": system.platform == "ios" ? "ios" : "android", //系统类别，安卓还是苹果
			"System": system.system || "", //系统名称如iOS 16
			"Language": system.language || "", // 使用语言
			"Package-Name": _this.PackageName, //App包名
			"Ua": system.ua, // UA标识
		
			// #ifndef APP-PLUS
			"Version-Name": "1.0.0",
			"X-Channel": "h5", //渠道号 _this.getChannel()
			"Device-Id": "h5", //设备ID
			"Brand": "", //手机品牌
			"Version": "", //框架引擎版本
			"OA-ID": "", //OAID
			// #endif
		
			// #ifdef APP-PLUS
			"appversion":plus.runtime.version,
			"Version-Name": plus.runtime.version, //App版本
			"X-Channel": _this.getChannel(), //渠道号 _this.getChannel()
			"Device-Id": system.deviceId, //设备ID
			"Brand": system.brand || "", //手机品牌
			"Version": system.version || "", //框架引擎版本
			"OA-ID": (oaid == "0" || oaid == "") ? "" : oaid, //OAID
			// #endif
		};
		return header;
	},

	//toast提示
	toast(msg, image) {
		this.feedbackGeneratorState();
		if (this.isIOS) {
			// #ifdef APP-PLUS
			plus.nativeUI.toast(msg, {
				background: "#4b4b4c",
				verticalAlign: "center",
				icon: image ? image : "none",
			});
			return;
			// #endif
		}
		uni.showToast({
			icon: "none",
			image: image ? image : undefined,
			title: msg,
			position: "center",
		});
	},

	//alert提示
	alert(option) {
		uni.showModal({
			title: option.title || "提示",
			content: option.content || "弹窗内容",
			showCancel: false,
			confirmText: option.confirmText || "确认",
			confirmColor: option.confirmColor || "#475BC3",
			success: function(res) {
				option.success && option.success();
			},
		});
	},

	//confirm提示
	confirm(option) {
		uni.showModal({
			title: option.title || "提示",
			content: option.editable != true ?
				option.content || "弹窗内容" : option.content || undefined,
			cancelText: option.cancelText || "取消",
			cancelColor: option.cancelColor || "#000000",
			confirmText: option.confirmText || "确认",
			confirmColor: option.confirmColor || "#475BC3",
			editable: option.editable || false,
			placeholderText: option.placeholderText || "",
			success: function(res) {
				if (res.confirm) {
					option.success && option.success(res);
				}
				if (res.cancel) {
					option.error && option.error(res);
				}
			},
		});
	},

	//判断是否安装了某个App
	isApplication(e) {
		// #ifdef APP-PLUS
		var isInstall = plus.runtime.isApplicationExist(e);
		if (isInstall) {
			return true;
		} else {
			return false;
		}
		// #endif
		// #ifndef APP-PLUS
		return false;
		// #endif
	},
	
	//获取当前使用设备
	getUseType() {
		// #ifdef APP-PLUS
		return "app";
		// #endif

		// #ifdef H5
		var uawx = navigator.userAgent.toLowerCase();
		var isWeixin = uawx.indexOf("micromessenger") != -1;
		if (isWeixin) {
			return "wechat";
		}

		return "h5";
		// #endif

		// #ifdef MP-WEIXIN
		return "wxmp";
		// #endif

		return "unknown";
	},

	//加载loading
	showLoading(e) {
		// #ifdef APP-PLUS
		plus.nativeUI.showWaiting(e && e.title != undefined ? e.title : "", {
			width: "100px",
			height: "100px",
			modal: e && e.mask != undefined ? e.mask : true,
			round: "13px",
			back: "close",
			loading: {},
		});
		// #endif

		// #ifndef APP-PLUS
		if (!e) {
			var e = {
				mask: true,
			};
		}
		if (!e.title) {
			e.title = "加载中";
		}

		uni.showLoading(e);
		// #endif
	},

	//隐藏loading
	hideLoading() {
		// #ifdef APP-PLUS
		plus.nativeUI.closeWaiting();
		// #endif

		// #ifndef APP-PLUS
		uni.hideLoading();
		// #endif
	},

	//生成随机字符串
	random_char(n) {
		var random_charset = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",];
		var res = "";
		for (var i = 0; i < n; i++) {
			var id = Math.ceil(Math.random() * 35);
			res += random_charset[id];
		}
		return res;
	},

	//获取当前渠道号
	getChannel() {
		var system = uni.getSystemInfoSync();
		// #ifdef APP-PLUS
		if (system.platform == "ios") {
			return "AppStore";
		} else {
			return plus.runtime.channel || "app";
		}
		// #endif
		
		// #ifndef APP-PLUS
			return "h5";
		// #endif
	},

	//触感反馈
	feedbackGeneratorState() {
		// #ifdef APP-PLUS
		var platform = uni.getSystemInfoSync().platform;
		if (platform == "android") {
			if (typeof plus != "undefined") {
				plus.device.vibrate(12);
			}
		} else if (platform == "ios") {
			var UISelectionFeedbackGenerator = plus.ios.importClass(
				"UISelectionFeedbackGenerator"
			);
			var impact = new UISelectionFeedbackGenerator();
			impact.init();
			impact.selectionChanged();
		}
		// #endif
	},
	
	// 突破放大
	openImage(index, arry){
		uni.previewImage({
			current: index,
			urls: arry,
			indicator: "number"
		});
	},

	//返回上一页方法  force代表是否强制返回首页
	goBack(force) {
		const len = getCurrentPages().length;
		if (len === 1) {
			if(this.getRoute() !== "/pages/home/index"){
				// #ifdef H5
				uni.reLaunch({
					url: "/pages/home/index"
				})
				// #endif
				
				// #ifndef H5
				uni.navigateBack({
					delta: 1,
				});
				// #endif
			}
		} else {
			if(force){
				uni.navigateBack({
					delta: len - 1,
				});
			}else{
				uni.navigateBack({
					delta: 1,
				});
			}
		}
	},

	//将一个数组分割为多个数组
	chunk(array, size) {
		//获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
		var length = array.length;
		//判断不是数组，或者size没有设置，size小于1，就返回空数组
		if (!length || !size || size < 1) {
			return [];
		}
		//核心部分
		var index = 0; //用来表示切割元素的范围start
		var resIndex = 0; //用来递增表示输出数组的下标

		//根据length和size算出输出数组的长度，并且创建它。
		var result = new Array(Math.ceil(length / size));
		//进行循环
		while (index < length) {
			//循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
			result[resIndex++] = array.slice(index, (index += size));
		}

		//输出新数组
		return result;
	},

	//分享
	open_share(opt) {
		opt.done = opt.done || function(res) {};

		var option = {
			provider: opt.type || "weixin",
			scene: opt.scene || "WXSceneSession",
			type: opt.type_id || 0,
			href: opt.url || "",
			title: opt.title || "",
			summary: opt.content || "",
			imageUrl: opt.image || "",
			//imageUrl:"https://static.zhubazhuan.com/avatar/001/1/1818862.png",
			success: function(res) {
				opt.done(true);
			},
			fail: function(err) {
				console.log(err);
				opt.done(false);
			},
		};

		if (opt.type == "system") {
			uni.shareWithSystem(option);
		} else {
			uni.share(option);
		}
	},

	//获取当前页面路由地址
	getRoute(force) {
		var pageList = getCurrentPages();
		if (pageList.length > 0) {
			var page = "/" + pageList[pageList.length - 1].route;
		} else {
			var page = "";
		}
		if (force) {
			page = page.replace(/\//g, "_");
			return page;
		} else {
			return page;
		}
	},

	//通用跳转页面
	openUrl(option) {
		let _this = this;
		
		// #ifdef APP-PLUS
		if (this.getRoute() == option.url) {
			return;
		}
		// #endif
		_this.hideKeyboard();

		//不处于白名单，并且未登录状态
		if (_this.noMustLogin.indexOf(option.url) == -1 && !_this.isLogin()) {
			_this.toLogin();
			return;
		}

		var data = {
			url: option.url,
			data: option.data || {},
			animationType: option.animationType || "pop-in",
			animationDuration: 250,
		};

		var params = Object.keys(data.data).map(function(key) {return (encodeURIComponent(key) + "=" + encodeURIComponent(data.data[key]));}).join("&");
		data.url += "?" + params;

		if (option.openType == "navigateTo" || option.openType == undefined) {
			uni.navigateTo(data);
		} else if (option.openType == "redirectTo") {
			uni.redirectTo(data);
		} else if (option.openType == "reLaunch") {
			uni.reLaunch(data);
		} else if (option.openType == "switchTab") {
			uni.switchTab(data);
		}
	},

	//数据库时间转换为普通的时间戳
	mysqlTimeto(time) {
		var myDate = new Date(time + "+0800");
		if (myDate == "Invalid Date") {
			time = time.replace(/T/g, " "); //去掉T
			time = time.replace(/-/g, "/");
			time = time.replace(/\.\d+/, " "); //去掉毫秒
			myDate = new Date(time + "+0800");
			return myDate;
		} else {
			return myDate;
		}
	},

	//时间戳转换为时间
	timestampToTime(timestamp, zh) {
		var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + (zh ? "年" : "-");
		var M =
			(date.getMonth() + 1 < 10 ?
				"0" + (date.getMonth() + 1) :
				date.getMonth() + 1) + (zh ? "月" : "-");
		var D =
			(date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
			(zh ? "日 " : " ");
		var h =
			(date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
		var m =
			(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
			":";
		var s =
			date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		return Y + M + D + h + m + s;
	},

	//数据库时间转换成时间戳或者MM/DD
	toTime(strTime, type) {
		var myDate;
		if (strTime) {
			myDate = this.mysqlTimeto(strTime);
		} else {
			myDate = new Date();
		}

		var year = myDate.getFullYear();
		var month = myDate.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		var day = myDate.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		var hours = myDate.getHours();
		if (hours < 10) {
			hours = "0" + hours;
		}
		var minute = myDate.getMinutes();
		if (minute < 10) {
			minute = "0" + minute;
		}
		var second = myDate.getSeconds();
		if (second < 10) {
			second = "0" + second;
		}

		if (type == "MM/DD") {
			return month + "/" + day;
		} else if (type == "YYYY/MM/DD hh:mm") {
			return year + "/" + month + "/" + day + " " + hours + ":" + minute;
		} else if (type == "YYYY/MM/DD hh:mm:ss") {
			return (
				year +
				"/" +
				month +
				"/" +
				day +
				" " +
				hours +
				":" +
				minute +
				":" +
				second
			);
		} else if (type == "MM/DD hh:mm") {
			return month + "/" + day + " " + hours + ":" + minute;
		} else if (type == "MM/DD hh:mm:ss") {
			return month + "/" + day + " " + hours + ":" + minute + ":" + second;
		} else if (type == "YYYY/MM/DD") {
			return year + "/" + month + "/" + day;
		} else if (type == "YYYYMMDDhhmmss") {
			return (
				year +
				"" +
				month +
				"" +
				day +
				"" +
				hours +
				"" +
				minute +
				"" +
				second +
				""
			);
		} else if (type == "YYYYMMDD") {
			return year + "" + month + "" + day;
		} else if (type == "YYYY/MM") {
			return year + "/" + month;
		} else if (type == "YYYY-MM") {
			return year + "-" + month;
		} else {
			return myDate;
		}
	},

	//将字符串时间转换为时间戳
	getDateTimeStamp(dateStr) {
		return Date.parse(("" + dateStr).replace(/-/gi, "/"));
	},

	//将时间戳转换为xx之前
	getDateDiff(time, type) {
		var publishTime = Math.ceil(time / 1000),
			d_seconds,
			d_minutes,
			d_hours,
			d_days,
			timeNow = parseInt(new Date().getTime() / 1000),
			d,
			date = new Date(publishTime * 1000),
			Y = date.getFullYear(),
			M = date.getMonth() + 1,
			D = date.getDate(),
			H = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();
		//小于10的在前面补0
		if (M < 10) {
			M = "0" + M;
		}
		if (D < 10) {
			D = "0" + D;
		}
		if (H < 10) {
			H = "0" + H;
		}
		if (m < 10) {
			m = "0" + m;
		}
		if (s < 10) {
			s = "0" + s;
		}

		d = timeNow - publishTime;
		d_days = parseInt(d / 86400);
		d_hours = parseInt(d / 3600);
		d_minutes = parseInt(d / 60);
		d_seconds = parseInt(d);

		if (d_days > 0 && d_days < 2) {
			return d_days + "天前";
		} else if (d_days <= 0 && d_hours > 0) {
			return d_hours + "小时前";
		} else if (d_hours <= 0 && d_minutes > 0) {
			return d_minutes + "分钟前";
		} else if (d_seconds < 60) {
			if (d_seconds <= 0) {
				return "刚刚";
			} else {
				return d_seconds + "秒前";
			}
		} else {
			if (type == "article") {
				if (d_days >= 2 && d_days < 30) {
					return M + "-" + D;
				} else if (d_days >= 30) {
					return Y + "-" + M + "-" + D;
				}
			} else {
				if (d_days >= 2 && d_days < 30) {
					return M + "-" + D + " " + H + ":" + m;
				} else if (d_days >= 30) {
					return Y + "-" + M + "-" + D + " " + H + ":" + m;
				}
			}
		}
	},
	
	// 将秒数转换为时分秒格式
	getSecondTime(value) {
	  let secondTime = parseInt(value); // 秒
	  let minuteTime = 0; // 分
	  let hourTime = 0; // 时
	  if (secondTime > 60) {
	    //如果秒数大于60，将秒数转换成整数
	    //获取分钟，除以60取整，得到整数分钟
	    minuteTime = parseInt(secondTime / 60);
	    //获取秒数，秒数取余，得到整数秒数
	    secondTime = parseInt(secondTime % 60);
	    //如果分钟大于60，将分钟转换成小时
	    if (minuteTime > 60) {
	      //获取小时，获取分钟除以60，得到整数小时
	      hourTime = parseInt(minuteTime / 60);
	      //获取小时后取余的分，获取分钟除以60取余的分
	      minuteTime = parseInt(minuteTime % 60);
	    }
	  }
	  //若秒数是个位数，前面用0补齐
	  secondTime = secondTime < 10 ? "0" + secondTime : secondTime;
	  var result = "" + secondTime + "";
	  if (minuteTime > 0) {
	  	//若分钟数是个位数，前面用0补齐
	    minuteTime = minuteTime < 10 ? "0" + minuteTime : minuteTime;
	    result = "" + minuteTime + ":" + result;
	  } else {
	  	//若分钟数为0，用"00"表示
	    result = "" + "00" + ":" + result;
	  }
	
	  if (hourTime > 0) {
	  	//若小时数是个位数，前面用0补齐
	    hourTime = hourTime < 10 ? "0" + hourTime : hourTime;
	    result = "" + hourTime + ":" + result;
	  } else {
	    //若小时数为0，用"00"表示
	    result = "" + "00" + ":" + result;
	  }
	  return result;
	},


	//转换数字
	castNum(num) {
		if (num < 10000) {
			return num;
		} else if (num >= 10000 && num < 100000000) {
			var newNum = (num / 10000).toFixed(1) + "万";
			return newNum;
		} else if (num >= 100000000 && num < 10000000000000000) {
			var newNum = (num / 100000000).toFixed(2) + "亿";
			return newNum;
		} else if (num >= 10000000000000000 && num < 1000000000000000000000000) {
			var newNum = (num / 10000000000000000).toFixed(2) + "亿亿";
			return newNum;
		} else {
			var newNum = "亿亿以上+";
			return newNum;
		}
	},

	//登录或退出后，需刷新的地方
	reshMyInfo() {
		uni.$emit("updateMyInfo"); // 首页刷新获取用户数据
		uni.$emit("reshDynamic"); // 首页刷新获取用户数据
	},

	//登录成功
	loginSuccess(data) {
		this.setUserInfo(data);
		this.reshMyInfo();
	},

	//退出登录
	loginExit() {
		this.removeUserInfo();
		this.reshMyInfo();
		setTimeout(() => {
			if (getCurrentPages().length > 1) {
				uni.navigateTo({
					url:"/pages/public/login"
				})
				// uni.navigateBack({
				// 	delta: getCurrentPages().length,
				// });
			}
		}, 300);
	},

	//获取用户信息
	getUserInfo() {
		if (uni.getStorageSync("userInfo")) {
			return uni.getStorageSync("userInfo");
		} else {
			return false;
		}
	},

	//写入用户信息
	setUserInfo(data) {
		uni.setStorageSync("userInfo", data);
	},

	//删除用户信息
	removeUserInfo() {
		uni.removeStorageSync("userInfo");
	},

	//是否处于登录
	isLogin() {
		if (uni.getStorageSync("userInfo")) {
			return true;
		} else {
			return false;
		}
	},

	//跳转到登录页
	toLogin(isBack = false) {
		let _this = this;
		_this.openUrl({
			url: "/pages/public/login",
		});
	},

	//一键绑定手机号
	androidUniverifyMobileBind() {
		return new Promise((resolve, reject) => {
			let _this = this;
			_this.showLoading();
			uni.login({
				provider: "univerify",
				univerifyStyle: {
					closeIcon: {
						path: "static/img/loginClose.png", // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持
					},
					icon: {
						path: "static/img/logo.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
					},
					backgroundColor: "#FFF", // 授权页面背景颜色，默认值：#ffffff
					fullScreen: false,
					phoneNum: {
						color: "#202020", // 手机号文字颜色 默认值：#202020
					},
					slogan: {
						color: "#BBBBBB", //  slogan 字体颜色 默认值：#BBBBBB
					},
					authButton: {
						title: "本机号码一键绑定",
						disabledColor: "#4381f0",
						normalColor: "#4381f0", // 授权按钮正常状态背景颜色 默认值：#3479f5
						highlightColor: "#4381f0", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
					},
					otherLoginButton: {
						textColor: "#656565", // 其他登录按钮文字颜色 默认值：#656565
						title: "绑定其它手机", // 其他登录方式按钮文字 默认值：“其他登录方式”
					},
					privacyTerms: {
						checkBoxSize: 26,
						defaultCheckBoxState: false, // 条款勾选框初始状态 默认值： true
						uncheckedImage: "/static/img/login_no.png", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)   
						checkedImage: "/static/img/login_green_active.png", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)   
					},
				},
				success(res) {
					// 登录成功
					_this.hideLoading();
					resolve(res);
				},
				fail(res) {
					// 登录失败


					if (res.errCode == 30003) {
						//用户关闭验证界面
					} else if (res.errCode == 30008) {
						//用户点击了自定义按钮
					} else {
						if (
							res.errCode != 30002 &&
							res.errCode != 20202 &&
							res.errCode != 30005
						) {
							_this.toast(res.errMsg);
						}
					}

					_this.hideLoading();
					uni.closeAuthView();
					reject(res);
				},
				complete() {
					//预取号
					uni.preLogin({
						provider: "univerify"
					});
					uni.closeAuthView();
				},
			});
		});
	},

	//打开一键登录界面
	openUniverify(option) {
		var _this = this;
		var system = uni.getSystemInfoSync();
		uni.login({
			provider: "univerify",
			univerifyStyle: {
				closeIcon: {
					path: "static/img/loginClose.png", // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持
				},
				icon: {
					path: "static/img/logo.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
				},
				backgroundColor: "#F9F9F9", // 授权页面背景颜色，默认值：#ffffff
				fullScreen: false,
				phoneNum: {
					color: "#202020", // 手机号文字颜色 默认值：#202020
				},
				slogan: {
					color: "#BBBBBB", //  slogan 字体颜色 默认值：#BBBBBB
				},
				authButton: {
					title: option.buttonText || "本机号码一键登录",
					disabledColor: "#414141",
					normalColor: "#414141", // 授权按钮正常状态背景颜色 默认值：#3479f5
					highlightColor: "#414141", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
				},
				otherLoginButton: {
					textColor: "#656565", // 其他登录按钮文字颜色 默认值：#656565
					title: option.otherButtonText || "短信验证码方式登录", // 其他登录方式按钮文字 默认值：“其他登录方式”
				},
				privacyTerms: {
					checkBoxSize: 26,
					defaultCheckBoxState: system.platform == "ios" ? true : false, // 条款勾选框初始状态 默认值： true
					uncheckedImage: system.platform == "ios" ? undefined : "/static/img/login_no.png", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)checkedImage: system.platform == "ios" ? undefined :"/static/img/login_green_active.png", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
					checkedImage: system.platform == "ios" ? undefined : "/static/img/login_green_active.png", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
				},
			},
			success(res) {
				// 登录成功
				_this.hideLoading();
				option.success && option.success(res);
			},
			fail(res) {
				// 登录失败
				if (res.errCode == 30003) {
					//用户关闭验证界面
				} else if (res.errCode == 30008) {
					//用户点击了自定义按钮
					option.error && option.error(res);
				} else {
					if (res.errCode != 30002 && res.errCode != 20202 && res.errCode != 30005) {
						_this.toast(res.errMsg);
					}
					option.error && option.error(res);
				}

				_this.hideLoading();
				uni.closeAuthView();
			},
			complete() {
				//预取号
				uni.preLogin({provider: "univerify"});
				uni.closeAuthView();
			},
		});
	},
	
	// 获取某个uniapp打包的第三方服务
	getServices(type = 'share', serviceName = 'weixin'){
		return new Promise((resolve, reject) => {
			plus[type].getServices((services) => {
				let item = null;
				for (const service of services) {
					if (service.id === serviceName) {
						item = service;
					}
				}
				
				if(item){
					resolve(item);
				}else{
					reject(`没有找到${serviceName}服务`);
				}
			},(err) => {
				reject(err);
			});
		})
	},
	
	// 将数组的顺序打乱
	shuffle(arry) {
		let array = JSON.parse(JSON.stringify(arry));
	    let m = array.length,t, i;
	    while (m) {
	        i = Math.floor(Math.random() * m--);
	        t = array[m];
	        array[m] = array[i];
	        array[i] = t;
	    }
	    return array;
	},
	
	// 对数组某个字段进行排序排序
	abilitySort(arr, property, type) {
		if (arr) {
			return arr.sort(function(a, b) {
				const val1 = a[property];
				const val2 = b[property];
				if (type == "desc") {
					return val1 - val2; // 升序排列
				} else {
					return val2 - val1; // 降序排列
				}
			});
		} else {
			return arr;
		}
	},
	
	// 数组去重
	unique(arr) {
		for (var i = 0; i < arr.length; i++) {
			for (var j = i + 1; j < arr.length; j++) {
				if (arr[i] == arr[j]) {
					//第一个等同于第二个，splice方法删除第二个
					arr.splice(j, 1);
					j--;
				}
			}
		}
		return arr;
	},

	// 隐藏键盘
	hideKeyboard() {
		uni.hideKeyboard();
	},

	// 秒数转换为分：秒 格式
	secondToDuration(time, zh) {
		var second = parseInt(time);
		if (isNaN(second)) {
			return "-";
		}

		if (time >= 3600) {
			var returnHours = Math.floor(time / 3600);
			var suprSecond = time % 3600;
			var returnMinute = Math.floor(suprSecond / 60);
			var returnSecond = Math.floor(suprSecond % 60);
			if (returnHours < 10) {
				returnHours = "0" + returnHours;
			}
			if (returnMinute < 10) {
				returnMinute = "0" + returnMinute;
			}
			if (returnSecond < 10) {
				returnSecond = "0" + returnSecond;
			}

			if (zh) {
				return `${returnHours}时${returnMinute}分${returnSecond}秒`;
			} else {
				return `${returnHours}:${returnMinute}:${returnSecond}`;
			}
		} else {
			var returnMinute = Math.floor(time / 60);
			var returnSecond = Math.floor(time % 60);
			if (returnMinute == -1 || returnSecond == -1) {
				return "-";
			}

			if (returnMinute < 10) {
				returnMinute = "0" + returnMinute;
			}
			if (returnSecond < 10) {
				returnSecond = "0" + returnSecond;
			}

			if (zh) {
				return `${returnMinute}分${returnSecond}秒`;
			} else {
				return `${returnMinute}:${returnSecond}`;
			}
		}
	},
	
	// 将bytes转为尺寸
	bytesToSize(bytes) {
		var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		if (bytes == 0) {
			return "0 Byte";
		}
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return (bytes / Math.pow(1024, i)).toFixed(2) + sizes[i];
	},

	//弹出AppStore评分
	storeKit() {
		// #ifdef APP-PLUS
		if (this.systemInfo.osName == "ios") {
			let storeKit = uni.requireNativePlugin("Xty-StoreKit");
			var storeKitStroage = uni.getStorageSync("storeKitStroage");
			if (storeKitStroage) {
				if (new Date().getTime() - storeKitStroage >= 86400000 * 30) {
					//30天以内弹过就不弹出了
					storeKit.review();
					uni.setStorageSync("storeKitStroage", new Date().getTime());
				}
			} else {
				storeKit.review();
				uni.setStorageSync("storeKitStroage", new Date().getTime());
			}
		}
		// #endif
	},

	// 判断是否启动过App
	isStartupEd() {
		let startupEd = uni.getStorageSync("startupEd");
		return startupEd ? true : false;
	},

	// 打开过App后
	startupEd() {
		uni.setStorageSync("startupEd", true);
	},

	// 禁止/启用下拉
	changTimer: null,
	changePagePull(status, routes) {
		return;
		// #ifdef APP-PLUS
		clearTimeout(this.changTimer);
		uni.stopPullDownRefresh();

		this.changTimer = setTimeout(() => {
			let pages = getCurrentPages();
			pages.map((item, index) => {
				if ("/" + item.route == routes) {
					let currentWebview = item.$getAppWebview();

					var nowSupport = currentWebview.getStyle().pullToRefresh.support;
					if (nowSupport != status) {
						currentWebview.setStyle({
							pullToRefresh: {
								support: status,
							},
						});
					}
				}
			});
		}, 200);
		// #endif
	},

	// 监听存在圆圈下拉刷新时，弹窗蒙层快速滑动也能下拉的问题
	maskMoveCircle(status, routes) {
		return;
		// this.toast(routes);
		var canCircle = ["/pages/home/index"];
		if (canCircle.indexOf(routes) != -1) {
			var circleStorage = uni.getStorageSync("circleLayer") || {};
			var stokey = canCircle[canCircle.indexOf(routes)].replace(/\//g, "_");
			var pageLayerCount = circleStorage[stokey] || 0;
			if (status) {
				pageLayerCount++;
			} else {
				pageLayerCount--;
			}

			circleStorage[stokey] = pageLayerCount;

			// this.toast(JSON.stringify(circleStorage[stokey]));
			uni.setStorageSync("circleLayer", circleStorage);
			if (status) {
				//禁用下拉
				this.changePagePull(!status, routes);
			} else {
				//开启下拉
				if (pageLayerCount <= 0) {
					this.changePagePull(!status, routes);
				}
			}
		}
	},

	// 获取文件扩展名
	getSuffix(filename) {
		let pos = filename.lastIndexOf(".");
		let suffix = "";
		if (pos != -1) {
			suffix = filename.substring(pos + 1);
		}
		return suffix.toLowerCase();
	},

	// iOS归因请求
	iosAdsPost(call) {
		// #ifdef APP-PLUS
		let _this = this;
		if(_this.isIOS){
			let AdsTool = uni.requireNativePlugin("TranscriptsPlugin-AdsTool");
			let adsToken = "";
			try {
				adsToken = AdsTool.getToken() ? AdsTool.getToken().token : "";
			} catch (_) { }
			if (adsToken) {
				call && call({
					token: adsToken,
					status: 404,
					info: "App: 加载中..",
				});
			
				uni.request({
					url: "https://api-adservices.apple.com/api/v1/",
					timeout: 50000,
					method: "post",
					header: { "Content-Type": "text/plain" },
					data: adsToken,
					success(res) {
						call && call({
							token: adsToken,
							status: res.statusCode,
							info: res.data ? res.data : "App: 归因返回为空数据",
						});
					},
					fail(err) {
						call && call({
							token: adsToken,
							status: 404,
							info: err.errMsg,
						});
					}
				});
			} else {
				call && call({
					token: "",
					status: 500,
					info: "App: token为空，可能是因为iOS14.3以下",
				});
			}
		}
		// #endif
	},
	
	// 安卓归因上报
	androidReport(e = {}, token = undefined){
		// #ifdef APP-PLUS
		let _this = this;
		if(!_this.isIOS){
			/* e.actionType 类型，String  	e.actionParam 付费金额，Number */
			let enumeration = {
				applicationActivation: {
					name: "应用激活",
					channel: {huawei: "1",baidu: "activate",vivo: "ACTIVATION",xiaomi: "APP_ACTIVE"},
				},
				startingApp: {
					name: "启动应用", 
					channel: {huawei: "2",baidu: "deeplink",vivo: "",xiaomi: ""},
				},
				nextDayState: {
					name: "次日留存", 
					channel: {huawei: "3",baidu: "retain_1day",vivo: "RETENTION_1",xiaomi: "APP_RETENTION"},
				},
				pay: {
					name: "付费", 
					channel: {huawei: "4",baidu: "orders",vivo: "PAY",xiaomi: "APP_PAY"},
				},
				reg: {
					name: "注册", 
					channel: {huawei: "7",baidu: "register",vivo: "REGISTER",xiaomi: "APP_REGISTER"},
				},
				placeRrder: {
					name: "下单", 
					channel: {huawei: "18",baidu: "ec_buy",vivo: "",xiaomi: ""},
				},
			}
			if(e.actionType){
				let item = enumeration[e.actionType];
				if(item){
					if(item.channel[_this.getChannel()] !== undefined && item.channel[_this.getChannel()] !== ""){
						let payload = {channel: _this.getChannel(), reportName: item.name};
						
						// 华为上报
						if(payload.channel === "huawei"){
							let pluginAscribe = uni.requireNativePlugin("plugin-ascribe");
							pluginAscribe.getHuaweiAscribe(ret => {
								if(ret && ret.trackId){
									try{
										let trackId = JSON.parse(ret.trackId);
										Object.assign(payload, {
											url: "/support/sendIad/sendHuaweiIad",
											actionType: item.channel[payload.channel] || "", 
											actionParam: e.actionParam || undefined, 
											huaweiCallBack: trackId.callback || "", //归因里面的callBack
											taskId: trackId.taskid || "", //归因里面的taskid
											subTaskId: trackId.subTaskId || "", //归因里面的subTaskId
											RTAID: trackId.RTAID || "", //归因里面的RTAID
											channel: trackId.channel || "", //归因里面的channel
											enterAppGalleryTime: ret.enterAppGalleryTime || "", //归因里面的enterAppGalleryTime
											downloadTime: ret.downloadTime || "", //归因里面的downloadTime
											installedTime: ret.installedTime || "", //归因里面的installedTime
										});
										_this.androidReportPost(payload, token);
									}catch(e){
										
									}
								}else{
									
								}
							});
							
							return;
						}
						
						// 百度上报
						if(payload.channel == "baidu"){
							Object.assign(payload, {
								url: "/support/sendIad/sendBaiduIad",
								a_type: item.channel[payload.channel] || "", 
								a_value: e.actionParam || undefined, 
							});
						}
						
						// vivo上报
						if(payload.channel == "vivo"){
							Object.assign(payload, {
								url: "/support/sendIad/sendVivoIad",
								cvType: item.channel[payload.channel] || "", 
								cvParam: e.actionParam || undefined, 
							});
						}
						
						// 小米上报
						if(payload.channel == "xiaomi"){
							Object.assign(payload, {
								url: "/support/sendIad/sendXiaomiIad",
								conv_type: item.channel[payload.channel] || "", 
								conv_weight: e.actionParam || undefined, 
							});
						}
						
						_this.androidReportPost(payload, token);
					}else{
						console.log(`Android Ads Report Fail (${_this.getChannel()}): '${item.name}'行为不支持上报给当前渠道`);
					}
				}else{
					console.log(`Android Ads Report Fail (${_this.getChannel()}): 该行为无需上报`);
				}
			}else{
				console.log(`Android Ads Report Fail (${_this.getChannel()}): 没有传入行为类型参数`);
			}
		}
		// #endif
	},
	
	// 安卓归因上报请求
	androidReportPost(payload, token){
		let _this = this;
		let header = _this.headers();
		if(token !== undefined && token !== ""){
			header["Authorized-Key"] = token;
		}
		
		_this.ajax({
			url: payload.url,
			method: "post",
			header,
			data: {
				iadJson: $aes.AES.encrypt(JSON.stringify(payload), _this.aes.key, _this.aes.iv)
			},
			success:(res) => {
				console.log(`Android Ads Report Success (${payload.channel}): '${payload.reportName}'行为上报成功，${JSON.stringify(res)}`);
			},
			error:(err) => {
				console.log(`Android Ads Report Fail (${payload.channel}): '${payload.reportName}'行为上报失败，${JSON.stringify(err)}`);
			}
		});
	},
	
	// 设置底部安全区域背景颜色
	setSafeAreaBackgroundColor(color) {
		color || (color = "#FFFFFF");
		if (!this.isIOS) {
			let context = plus.android.runtimeMainActivity();
			let win = plus.android.invoke(context, "getWindow");
			let icolor = plus.android.invoke("android.graphics.Color", "parseColor", color);
			plus.android.invoke(win, "setNavigationBarColor", icolor);
		}
	},
	
	// 获取包名
	getPackageName(){
		// #ifdef APP-PLUS
		if (this.isIOS) {  
			// 获取苹果应用包名（bundleId）
			return plus.ios.importClass('NSBundle').mainBundle().bundleIdentifier();
		} else {  
			// 获取安卓应用包名  
			return plus.android.runtimeMainActivity().getPackageName();
		}
		// #endif
		
		return "h5";
	},
	
	// 登出某个授权登录的服务
	empowerLogout(type){
		return new Promise((resolve, reject) => {
			plus.oauth.getServices(function(services){
				for(var i in services){
					if(services[i].id === type){
						services[i].logout(function(e){
							resolve();
						}, function(e){
							reject();
						});
					}
				}
			}, function(e){
				reject();
			});
		});
	},
	
	// 版本号比较
	version(v1, v2) {
		if (v1 === v2) return 0;
		if (v1 === void 0) return -1;
		if (v2 === void 0) return 1;
		let v1r = v1.split(".");
		let v2r = v2.split(".");
		let lenMax = Math.max(v1r.length, v2r.length);
		if (lenMax !== v1r.length) {
			for (let i = 0; i < lenMax - v1r.length; i++) {
				v1r.unshift("00");
			}
		}
		if (lenMax !== v2r.length) {
			for (let i = 0; i < lenMax - v2r.length; i++) {
				v2r.unshift("00");
			}
		}

		for (let i = 0; i < lenMax; i++) {
			if (parseInt(v1r[i]) === parseInt(v2r[i])) continue;
			return parseInt(v1r[i]) > parseInt(v2r[i]) ? 1 : -1;
		}
		return 0;
	},
	
	// rpx转为px
	rpx2px(rpx){
		return (this.systemInfo.screenWidth / 750 * rpx);
	},
	
	// 获取缓存中是否允许播放背景音乐
	isPlayBackgroundMusic(){
		return (uni.getStorageSync("backgroundMusicStatus") !== undefined && uni.getStorageSync("backgroundMusicStatus") !== '') ? uni.getStorageSync("backgroundMusicStatus") : true;
	},
	
	// 写入缓存中是否允许播放背景音乐
	setIsBackgroundMusic(status){
		uni.setStorageSync("backgroundMusicStatus", status);
	},
	
	// 截取字符串
	subString(str, leng = 20){
		if(str.length <= leng){
			return str;
		}else{
			return str.substring(0, leng) + "...";
		}
	},
	
	// 通用的开始播放音乐
	playMusic(e){
		uni.$audio.loop = e.loop === undefined ? false : e.loop;
		uni.$audio.startTime = 0;
		uni.$audio.playbackRate = 1.0;
		uni.$audio.src = e.src;
		uni.$audio.play();
	},
	
	// 取多少到多少之间的随机数
	getRand(m, n)  {
	    return Math.ceil(Math.random() * (n-m+1) + m-1)
	},
	
	// 打开用户协议或隐私政策
	openUserPrivacy(type = 'privacy'){
		plus.runtime.openWeb(`${this.host}${type}.html`);
	},
	
	// 唤起在线客服
	openService(){
		let _this = this;
		_this.ajax({
			url: "/base/customer",
			load: true,
			success(res){
				// #ifdef APP-PLUS
					plus.runtime.openURL(res.data.info.customer.url);
					/*
					_this.getServices("share","weixin").then((e) => {
						e.openCustomerServiceChat({
							corpid: res.data.info.customer.corpid,
							url: res.data.info.customer.url,
						});
					}).catch((err) => {
						plus.runtime.openURL(res.data.info.customer.url);
					});*/
				// #endif
				// #ifdef H5
					window.open(res.data.info.customer.url, "_blank");
				// #endif
			}
		})
	},
	
	// 是否安装了微信
	isWechat() {
		// #ifdef APP-PLUS
		var isWechat = plus.runtime.isApplicationExist({
			pname: "com.tencent.mm",
			action: "weixin://",
		});
		if (isWechat) {
			return true;
		} else {
			return false;
		}
		// #endif
		// #ifndef APP-PLUS
		return false;
		// #endif
	},
	
	// 是否安装了QQ
	isQQ() {
		// #ifdef APP-PLUS
		var isWechat = plus.runtime.isApplicationExist({
			pname: "com.tencent.mobileqq",
			action: "mqq://",
		});
		if (isWechat) {
			return true;
		} else {
			return false;
		}
		// #endif
		// #ifndef APP-PLUS
		return false;
		// #endif
	},
	
	// 获取当前版本是否处于审核
	getToExamine(){
		// #ifdef APP-PLUS
		if(this.isIOS){
			let iosToExamine = uni.getStorageSync("iosToExamine");
			if(plus.runtime.version === iosToExamine){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
		// #endif
		
		return false;
	},
	
	// 评论内容替换表情字符串  为图片
	commentReplace(prop) {
		let content = prop.message;
	    let reg = /\[(.*?)\]/g;
	    let res = content.match(reg);
	    if (res) {
	        for (let i = 0; i < res.length; i++) {
	            let emo = this.findEmo(res[i]);
	           content = content.replace(res[i], emo);
	        }
	    }
		content = `
			<span class="nick ell">${prop.nickname}</span>
			${prop.reply_nickname ? '<span class="reply ell">回复</span>' : ''}
			${prop.reply_nickname ? '<span class="nick ell">' + prop.reply_nickname + '</span>' : ''}
		` + "：" + content;
		return content;
	},
	
	// 评论内容替换表情字符串  为图片
	commentReplace2(content) {
	    let reg = /\[(.*?)\]/g;
	    let res = content.match(reg);
	    if (res) {
	        for (let i = 0; i < res.length; i++) {
	            let emo = this.findEmo(res[i]);
	           content = content.replace(res[i], emo);
	        }
	    }
		return content;
	},
	
	// 查找表情的路径
	findEmo(name) {
	    let path = "";
	    for (let i = 0; i < this.emo.length; i++) {
	        if (this.emo[i].name == name) {
	            path = `<img src='${this.api()}${this.emo[i].path}' style="vertical-align: middle;margin:0 -1.5px;margin-top:-2px;width:28px;display:inline-block;" />`;
	            break;
	        }
	    }
	    return path;
	},
	
	/**
	 * H5 端图片压缩工具（兼容 uni-app）
	 * @param {String} filePath - 图片临时路径（来自 uni.chooseImage 的 tempFilePath）
	 * @param {Object} options - 压缩配置
	 * @param {Number} options.quality - 质量（0-1，默认 0.8）
	 * @param {Number} options.maxWidth - 最大宽度（默认 1080）
	 * @param {Number} options.maxHeight - 最大高度（默认 1920）
	 * @return {Promise<String>} 压缩后的图片临时路径（DataURL 或 Blob URL）
	 */
	compressImageH5(filePath, options = {}) {
		let that = this
	  return new Promise((resolve, reject) => {
	    const {
	      quality = 0.8,
	      maxWidth = 1080,
	      maxHeight = 1920
	    } = options;
	
	    // 1. 创建图片对象，获取原始尺寸
	    const img = new Image();
	    img.crossOrigin = 'anonymous'; // 解决跨域问题
	    img.onload = function() {
	      // 2. 计算压缩后的尺寸（按比例缩放）
	      let width = img.width;
	      let height = img.height;
	
	      // 如果图片尺寸超过最大限制，按比例缩小
	      if (width > maxWidth || height > maxHeight) {
	        const scale = Math.min(maxWidth / width, maxHeight / height);
	        width = width * scale;
	        height = height * scale;
	      }
	
	      // 3. 创建 Canvas 并绘制图片
	      const canvas = document.createElement('canvas');
	      const ctx = canvas.getContext('2d');
	      canvas.width = width;
	      canvas.height = height;
	      ctx.drawImage(img, 0, 0, width, height); // 将图片绘制到 Canvas
	
	      // 4. 导出压缩后的图片（转为 DataURL）
	      // 支持 'image/jpeg' 或 'image/png'，jpeg 格式支持 quality 参数
	      const mimeType = 'image/jpeg';
	      const dataUrl = canvas.toDataURL(mimeType, quality);
	
	      // 5. 将 DataURL 转为 Blob 并生成临时 URL（部分上传接口需要 Blob 格式）
	      const blob = that.dataURLToBlob(dataUrl, mimeType);
	      const blobUrl = URL.createObjectURL(blob);
	
	      resolve(blobUrl); // 返回 Blob URL 用于上传
	    };
	
	    img.onerror = function(err) {
	      reject(new Error('图片加载失败：' + err.message));
	    };
	
	    // 加载图片（H5 端的 tempFilePath 可能是 Blob URL 或本地路径）
	    img.src = filePath;
	  });
	},
	// 辅助函数：将 DataURL 转为 Blob 对象
	dataURLToBlob(dataUrl, mimeType) {
	  const byteString = atob(dataUrl.split(',')[1]);
	  const ab = new ArrayBuffer(byteString.length);
	  const ia = new Uint8Array(ab);
	  for (let i = 0; i < byteString.length; i++) {
	    ia[i] = byteString.charCodeAt(i);
	  }
	  return new Blob([ab], { type: mimeType });
	}
};