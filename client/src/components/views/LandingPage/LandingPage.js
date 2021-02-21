import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {Icon, Col, Card, Row} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import {continents, price} from './Sections/Data';
import SearchFeature from './Sections/SearchFeature';

function LandingPage() {
	
	const [Products, setProducts] = useState([])
	const [Skip, setSkip] = useState(0)
	const [Limit, setLimit] = useState(8)
	const [PostSize, setPostSize] = useState(0)
	const [Filters, setFilters] = useState({
		continents: [],
		price: []
	})
	const [SearchTerm, setSearchTerm] = useState("")
	
	
	useEffect(()=> {
		
		let body = {
			skip: Skip,
			limit: Limit
		}
		
		getProducts(body)
		
	}, [])
	
	const getProducts = (body) => {
		Axios.post('api/product/products', body)
			.then(response => {
				if(response.data.success){
					if(body.loadMore) {
						setProducts([...Products, ...response.data.productsInfo])
					} else {
						setProducts(response.data.productsInfo)
					}
					setPostSize(response.data.postSize)
				} else {
					alert('상품 가져오기 실패')
				}
			})
	}
	
	const loadMoreHandler = () => {
		
		let skip = Skip + Limit
		
		let body = {
			skip: skip,
			limit: Limit,
			loadMore: true
		}

		getProducts(body)
		setSkip(skip)
	}
	
	const renderCards = Products.map((product, index) => {
		
		return (
		<Col lg={6} md={8} sm={12} xs={24} key={index}>
			<Card
				cover={
					<a href={`/product/${product._id}`}>
						<ImageSlider
							images={product.images}
						/>
					</a>
				}
			>
				<Meta
					title={product.title}
					description={`$${product.price}`}
				/>
			</Card>
		</Col>
		)
	})
	
	const showFilteredResults = (filters) => {
		
		let body = {
			skip: 0,
			limit: Limit,
			loadMore: false,
			filters: filters
		}
		
		getProducts(body)
		setSkip(0)
	}
	
	const handlePrice = (value) => {
		const data = price;
		
		let array = [];
		
		for(let key in data) {
			if(data[key]._id === parseInt(value, 10)) {
				array = data[key].array;
			}
		}
		
		return array;
	}
	
	const handleFilters = (filters, category) => {
		
		const newFilters = {...Filters}
		newFilters[category] = filters
		
		console.log('filters', filters)
		
		if(category === "price"){
			let priceValues = handlePrice(filters)
			newFilters[category] = priceValues
		}
		
		showFilteredResults(newFilters)
		
		setFilters(newFilters)
	}
	
	const updateSearchTerm = (newSearchTerm) => {
		
		let body = {
			skip: 0,
			limit: Limit,
			filters: Filters,
			searchTerm: newSearchTerm
		}
		
		setSkip(0)
		setSearchTerm(newSearchTerm)
		getProducts(body)
	}
	
    return (
        <div style={{width: '75%', margin: '3rem auto'}}>
			<div style={{textAlign: 'center'}}>
				<h2>
					Let's Travel Anywhere <Icon type="rocket"/>
				</h2>
			</div>
			
			{/* Filter */}
			<Row gutter={[16,16]}>
				
				{/* CheckBox */}
				<Col lg={12} xs={24}>
					<CheckBox 
						list = {continents} 
						handleFilters={filters => handleFilters(filters, "continents")}
					/>
				</Col>

				{/* RadioBox */}
				<Col lg={12} xs={24}>
					<RadioBox 
						list = {price} 
						handleFilters={filters => handleFilters(filters, "price")}
					/>
				</Col>
				
			</Row>
			
			{/* Search */}
			<div style={{
					display:'flex', 
					justifyContent:'flex-end', 
					margin: '1rem auto'}}>
				
				<SearchFeature 
					refreshFunction = {updateSearchTerm}	
				/>
			
			</div>	
			
			{/* Cards */}
			<div style={{margin: '5% 0'}}>
				<Row gutter={[16, 16]}>
					{renderCards}
				</Row>
			</div>
			
			{PostSize >= Limit &&
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<button onClick={loadMoreHandler}>더보기</button>
				</div>
			}
		</div>
    )
}

export default LandingPage
