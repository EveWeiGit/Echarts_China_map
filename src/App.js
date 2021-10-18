import React, {  useEffect, useRef } from 'react';
import './App.css';
import * as echarts from 'echarts';
import { isEmpty } from 'lodash';
import { dataChina, cityValue, geoCoordMap } from './china';
echarts.registerMap('china', dataChina, {});

const convertData = function(data) {
	var res = [];
	for (var i = 0; i < data.length; i++) {
		var geoCoord = geoCoordMap[data[i].name];
		if (geoCoord) {
			res.push({
				name: data[i].name,
				value: geoCoord.concat(data[i].value)
			});
		}
	}
	return res;
};
const mainColor = ['#5F82E6', '#5CBDF6', '#5FE1D4', '#82CB6C', '#F8D454']

function App() {
  const mapRef = useRef(null);

  const isDark = false;

	const top5City = convertData(
		cityValue
			.sort(function(a, b) {
				return b.value - a.value;
			})
			.slice(0, 5)
	);

	// 给城市添加不同颜色
	const handleCityColor = (list) => {
		let res = []
		list.map((ci, index) => {
			// ci['itemStyle'] = {color:mainColor[index]}
			res.push({
				name: ci.name,
				type: 'effectScatter',
				coordinateSystem: 'geo',
				data:[{...ci, itemStyle:{color:mainColor[index]}}],
				encode: {
					value: 2
				},
				symbolSize: function(val) {
					return val[2] / 10;
				},
				showEffectOn: 'emphasis',
				rippleEffect: {
					brushType: 'stroke'
				},
				hoverAnimation: true,
				label: {
					formatter: '{b}',
					position: 'right',
					show: true
				},
				itemStyle: {
					color: mainColor[index],
					shadowBlur: 10,
					shadowColor: '#333'
				},
				zlevel: 1
			})
			return res
		})
		// console.log('res', res)
		return res
	}
	// 生成series的list，这样才有右边的legend列表


	// console.log('top5City', handleCityColor(top5City));
	useEffect(() => {
		if (!isEmpty(mapRef.current)) {
			let echart = echarts.init(mapRef.current);
			const option = {
				color:mainColor,
				tooltip: {
					trigger: 'item'
				},
				geo: {
					roam: false, // 是否开启鼠标缩放和平移漫游
					map: 'china',
					itemStyle: {
						areaColor: isDark ? '#232323' : '#fff',
						borderColor: isDark ? '#fff' : '#313753',
					},
					left:0
				},
				legend:{
					data:['北京', '上海', '南昌', '福州', '石家庄'],
					orient:'vertical',
					textStyle:{
            color: isDark ? '#fff' : '#313753'
          },
          right: 0,
          top: 'center',
					type: 'scroll',
				},
				series:handleCityColor(top5City),
			};
			echart.setOption(option);
			window.addEventListener('resize', function() {
				setTimeout(function() {
					echart.resize();
				}, 200);
			});
		}
	}, [isDark]);


  return (
    <div className="App">
				<div className='map_content' ref={mapRef} />
    </div>
  );
}

export default App;
