const express = require('express');
const router = express.Router();
const multer = require('multer');
const {Product} = require('../models/Product')


//=================================
//             Product
//=================================

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})
 
let upload = multer({ storage: storage }).single("file")

router.post("/image", (req, res) => {
	//이미지 저장
	upload(req, res, err=> {
		if(err) {
			return res.json({success:false, err})
		}
		return res.json({success:true, filePath: res.req.file.path, fileName: res.req.file.filename})
	})
})

router.post("/", (req, res) => {
	//받아온 정보들을 DB에 넣어 준다
	const product = new Product(req.body)
	
	product.save((err) => {
		if(err) return res.status(400).json({success: false, err})
		return res.status(200).json({success: true})
	})
})	

router.post("/products", (req, res) => {
	//Product Collection의 모든 상품 정보 가져오기

	let limit = req.body.limit ? parseInt(req.body.limit) : 20;
	let skip = req.body.skip ? parseInt(req.body.skip) : 0;
	let term = req.body.searchTerm 
	
	let findArgs = {};
	
	for(let key in req.body.filters) {
		if(req.body.filters[key].length > 0) {
			
			console.log('key', key)
			
			if(key === "price") {
				findArgs[key] = {
					//Greater than equal
					$gte: req.body.filters[key][0],
					//Less than equal
					$lte: req.body.filters[key][1]
				}
			} else {
				findArgs[key] = req.body.filters[key];
			}
			
		}
	}
	
	if(term) {
		Product.find(findArgs)
			.find({$text:{$search: term}})
			.populate("writer")
			.skip(skip)
			.limit(limit)
			.exec((err, productsInfo) => {
				if(err) return res.status(400).json({success: false, err})
				return res.status(200).json({
					success: true, 
					productsInfo: productsInfo,  
					postSize: productsInfo.length
				})
			})
	} else {
		Product.find(findArgs)
			.populate("writer")
			.skip(skip)
			.limit(limit)
			.exec((err, productsInfo) => {
				if(err) return res.status(400).json({success: false, err})
				return res.status(200).json({
					success: true, 
					productsInfo: productsInfo,  
					postSize: productsInfo.length
				})
			})
	}
	
	
})	



router.get(`/products_by_id`, (req, res) => {
	
	//productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
	
	let type = req.query.type
	let productIds = req.query.id
	
	if(type === "array") {
		let ids = req.query.id.split(',')
		productIds = ids.map(item => {
			return item
		})
	}
	
	Product.find({ _id: { $in: productIds } })
		.populate('writer')
		.exec((err, product) => {
			if(err) return res.status(400).send(err)
			return res.status(200).send(product)
		})
	
})


module.exports = router;
