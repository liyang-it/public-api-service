// 这个路由文件主要用于处理 请求第三方接口

const express = require('express');
const app = express.Router();
const axios = require('axios');
/**
 * 查询某个省汽油柴油价格<br>
 * query参数：provinceId(省ID)
 */
app.get('/switchProvince', (req, res) => {
	const {
		provinceId
	} = req.query;
	if (provinceId == undefined) {
		res.json({
			'code': 500,
			'message': '请求失败',
			'data': '参数为空'
		})
		return
	}

	if (provinceId.length == 0) {
		res.json({
			'code': 500,
			'message': '请求失败',
			'data': '参数为空'
		})
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

	axios(config).then(function (response) {
		res.json({
			'code': 200,
			'message': '请求成功',
			'data': response.data
		});
	}).catch(function (error) {
		res.json({
			'code': 200,
			'message': '请求错误',
			'data': error
		});
	});


});


// 导出路由模块
module.exports = app