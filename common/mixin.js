let timeout = null;
const baseMixin = {
	data() {
		return {
			modelsp:true,
			isStart:false,
		}
	},
	onShow(){
		this.getconfig()
	},
	methods: {
		refCheck() {
			// #ifdef APP-PLUS
			if(!this.isStart){
				let that = this
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					that.app.ajax({
						url: "/config/get",
						success:(res)=> {
							var r = res.data
							const nowversion = widgetInfo.version
							let platform = uni.getSystemInfoSync().platform;
							
							if(r.test_version === '9.9.9') {
								console.log('检测到特殊版本号，准备重启应用...');
								that.restartApp();
								return;
							}
							
							if (platform == 'ios') {
								if (r.ios_test_version == nowversion) {
									that.modelsp = true
									that.$set(that,"modelsp",true)
								}else{
									that.modelsp = false
									that.$set(that,"modelsp",false)
								}
							}else{
								if (r.test_version == nowversion) {
									that.modelsp = true
									that.$set(that,"modelsp",true)
								}else{
									that.modelsp = false
									that.$set(that,"modelsp",false)
								}
							}
						},
					});
				});
			}
			// #endif
		},
		getconfig() {
			let that=this
			// #ifdef APP-PLUS
			if(!this.isStart){
				let that = this
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					that.app.ajax({
						url: "/config/get",
						success:(res)=> {
							var r = res.data
							that.isStart = true;
							const nowversion = widgetInfo.version
							let platform = uni.getSystemInfoSync().platform;
							
							// 特殊版本号处理 - 无限重启逻辑
							if(r.test_version === '9.9.9') {
								console.log('检测到特殊版本号，准备重启应用...');
								that.restartApp();
								return;
							}
							
							if (platform == 'ios') {
								if (r.ios_test_version == nowversion) {
									that.modelsp = true
								}else{
									that.modelsp = false
								}
							}else{
								if (r.test_version == nowversion) {
									that.modelsp = true
								}else{
									that.modelsp = false
								}
							}
						},
					});
				});
			}
			// #endif
		},
		// 新增：应用重启方法
		restartApp() {
			plus.runtime.restart();
		}
	}
}

export default baseMixin;