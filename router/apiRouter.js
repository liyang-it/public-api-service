// 这个路由文件主要用于处理 请求第三方接口
const responseHandler = require('../utils/response.js')
const cacheHandler = require('../utils/cache.js')
const dateUtil = require('../utils/dateUtil.js')
const express = require('express');
const app = express.Router();
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');

const bodyParser = require('body-parser');
// 使用 body-parser 中间件
app.use(bodyParser.json()); // 解析 application/json 类型的数据
app.use(bodyParser.urlencoded({
	extended: true
})); // 解析 application/x-www-form-urlencoded 类型的数据


// 使用cors中间件
app.use(cors({
	origin: '*', // 允许来自任何源的请求
	methods: ['GET', 'POST', 'PUT', 'DELETE'] // 允许的HTTP方法
}));

/**
 * 查询某个省汽油柴油价格<br>
 * query参数：provinceId(省ID)
 * 可选省ID：
 * 							{"provinceId":"11","name":"北京"},
                {"provinceId":"12","name":"天津"},
                {"provinceId":"13","name":"河北"},
                {"provinceId":"14","name":"山西"},
                {"provinceId":"41","name":"河南"},
                {"provinceId":"37","name":"山东"},
                {"provinceId":"31","name":"上海"},
                {"provinceId":"32","name":"江苏"},
                {"provinceId":"33","name":"浙江"},
                {"provinceId":"34","name":"安徽"},
                {"provinceId":"35","name":"福建"},
                {"provinceId":"36","name":"江西"},
                {"provinceId":"42","name":"湖北"},
                {"provinceId":"43","name":"湖南"},
                {"provinceId":"44","name":"广东"},
                {"provinceId":"45","name":"广西"},
                {"provinceId":"53","name":"云南"},
                {"provinceId":"52","name":"贵州"},
                {"provinceId":"46","name":"海南"},
                {"provinceId":"50","name":"重庆"},
                {"provinceId":"51","name":"四川"},
                {"provinceId":"65","name":"新疆"},
                {"provinceId":"15","name":"内蒙古"},
                {"provinceId":"21","name":"辽宁"},
                {"provinceId":"22","name":"吉林"},
                {"provinceId":"64","name":"宁夏"},
                {"provinceId":"61","name":"陕西"},
                {"provinceId":"23","name":"黑龙江"},
                {"provinceId":"54","name":"西藏"},
                {"provinceId":"63","name":"青海"},
                {"provinceId":"62","name":"甘肃"}
 */
app.get('/switchProvince', (req, res) => {

	const {
		provinceId
	} = req.query;


	if (provinceId == undefined || provinceId.length == 0) {
		responseHandler.fail(res, '参数为空')
		return
	}

	// 判断缓存是否存在
	const cacheKey = `${dateUtil.getNowDate()}_${provinceId}`
	const _get_cahche = cacheHandler.getCache(cacheKey);
	if (_get_cahche != null) {
		responseHandler.success(res, '请求成功', true, _get_cahche)
		return
	}

	const requestUrl = 'https://cx.sinopecsales.com/yjkqiantai/data/switchProvince'
	const requestBody = {
		"provinceId": provinceId
	}

	const config = {
		method: 'post',
		url: requestUrl,
		headers: {
			'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
			'Content-Type': 'application/json',
			'Accept': '*/*',
			'Host': 'cx.sinopecsales.com',
			'Connection': 'keep-alive'
		},
		data: requestBody
	};
	console.info('请求数据', config)

	axios(config).then(function (response) {
		// 加入到缓存
		cacheHandler.setCache(cacheKey, response.data)
		responseHandler.success(res, "请求成功", false, response.data)

	}).catch(function (error) {
		responseHandler.fail(res, error)
	});
});


/** 获取农产品分类信息*/
app.get('/getFrequencyConditions', (req, res) => {
	// 判断缓存是否存在
	const cacheKey = `${dateUtil.getNowDate()}_getFrequencyConditions`
	const _get_cahche = cacheHandler.getCache(cacheKey);
	if (_get_cahche != null) {
		responseHandler.success(res, '请求成功', true, _get_cahche)
		return
	}

	const data = qs.stringify({
		'item': '农产品批发价格'
	});

	const config = {
		method: 'post',
		url: 'http://zdscxx.moa.gov.cn:8080/nyb/getFrequencyConditions',
		headers: {
			'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
			'Accept': '*/*',
			'Host': 'zdscxx.moa.gov.cn:8080',
			'Connection': 'keep-alive',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: data
	};

	console.info('请求数据', config)

	axios(config).then(function (response) {

		const data = response.data
		if (data.message == 'success') {
			// 加入到缓存
			cacheHandler.setCache(cacheKey, response.data, 604800)
			responseHandler.success(res, "请求成功", false, response.data)
		} else {
			responseHandler.fail(res, "获取获取农产品分类数据失败")
		}
	}).catch(function (error) {
		responseHandler.fail(res, error)
	});

})

/**
 * 查询各农村部 表格数据
 * @param {Object} data 请求数据
	 { 
     unit: 价格单位 1 元/斤, 2 元/公斤,
		 page: 当前页,
		 rows: 返回条数,
		 type: 查询范围可选值(周度数据、月度数据、年度数据),
		 subType: 查询类型可选值(农产品批发价格、综合),
		 level: 固定值 2,
		 time: 时间范围数组，根据 type 查询的范围传递对应数据(周(["2020-31","2024-31"])、月(["2020-08","2024-08"])、年(["2024","2024"])),
		 product: 查询的品类,例如 牛肉、羊肉
	 }
 * <br>
 * 示例：
	 {
	 	 unit: 1,
		 page: 1,
		 rows: 20,
		 type: 月度数据,
		 subType: 农产品批发价格,
		 level: 2,
		 time: ["2020-08","2024-08"],
		 product: '牛肉'
	 }
 */

app.post('/getFrequencyData', (req, res) => {
	const jsonData = req.body;

	// 日期默认值，月单位
	let startTime;
	let endTime;
	if (jsonData.time == undefined) {
		startTime = dateUtil.getNowMonthMinOne()
		endTime = dateUtil.getNowMonth()
	} else {
		startTime = jsonData.time[0]
		endTime = jsonData.time[1]
	}
	const config = {
		method: 'post',
		url: 'http://zdscxx.moa.gov.cn:8080/nyb/getFrequencyData',
		headers: {
			'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
			'Accept': '*/*',
			'Host': 'zdscxx.moa.gov.cn:8080',
			'Connection': 'keep-alive',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {
			'page': jsonData.page || 1,
			'rows': jsonData.rows || 10,
			'type': jsonData.type || '月度数据',
			'subType': jsonData.subType || '农产品批发价格',
			'level': 2,
			'time': `["${startTime }", "${endTime}"]`,
			'product': jsonData.product || ''
		}
	};

	console.info('请求数据', config)

	axios(config).then(function (response) {
		const data = response.data
		if (data.message == 'success') {
			// 处理 价格单位
			const unit = jsonData.unit || 1
			if (unit == 1) {
				const pageInfoTable = []
				// 将 公斤价格数据 / 2 转换为斤
				for (let i = 0, size = data.result.pageInfo.table.length; i < size; i++) {
					data.result.pageInfo.table[i].unit = '元/斤'
					let price = Number(data.result.pageInfo.table[i].value)
					price = price / 2
					price = parseFloat(price.toFixed(2))
					data.result.pageInfo.table[i].value = price
					// 将重新赋值的对象加入到集合
					pageInfoTable.push(data.result.pageInfo.table[i])
				}
				// 将新集合覆盖旧集合数据
				data.result.pageInfo.table = pageInfoTable
			}
			responseHandler.success(res, "请求成功", false, data)
		} else {
			responseHandler.fail(res, "获取农产品价格数据失败")
		}
	}).catch(function (error) {
		responseHandler.fail(res, error)
	});

})

// 检查app版本是否需要更新
app.get('/checkVersion', (req, res) => {
	const {
		version
	} = req.query
	// 服务器apk版本
	const app_version = 2;
	if (app_version > version) {
		res.send(true)
	} else {
		res.send(false)
	}
})

// 导出路由模块
module.exports = app