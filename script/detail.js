const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const concerncode = urlParams.get('concerncode')
const name = urlParams.get('name')
const place = urlParams.get('place')
const winstSVG = d3.select('#winstSVG')
const loonSVG = d3.select('#loonSVG')
const jaartal = document.getElementById("jaartal")
const h2_name = document.getElementById("name")
const h3_place = document.getElementById("place")
const width = 280
const height = 330
const widthLoon = 280
const heightLoon = 100
const margin = { top: 50, right: 0, bottom: 20, left: 28 };
const marginLoon = { top: 45, right: 40, bottom: 5, left: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const innerWidthLoon = widthLoon - marginLoon.left - marginLoon.right;
const innerHeightLoon = heightLoon - marginLoon.top - marginLoon.bottom;

h2_name.innerHTML = name
h3_place.innerHTML = place

fetch('data.json')
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    getData(myJson)
  })

function getData(data) {

  function getCompanyData(concerncode) {
    return data.filter(
      function(data) {
        const searchInData = concerncode == data.concerncode
        return searchInData
      }
    )
  }
  // Algemeen
  const foundData = getCompanyData(concerncode);


  // Winstpercentage
  const yValue = d => d.perc_winst;
  const xValue = d => d.jaar;

  // Loonpercentage
  const yValueLoon = d => d.jaar;
  const xValueLoon = d => d.perc_loon;
  // Show years in Winstpercentage
  jaartal.innerHTML = (d3.min(foundData, xValue) + "-" + d3.max(foundData, xValue))


  // Loonpercentage
  // Get the latetst year with perc_loon and make a new array
  const loonData = new Object();
  const loonDataArray = [loonData]
  var i;
  for (i = 0; i < foundData.length; i++) {
    if (foundData[i].jaar === d3.max(foundData, yValueLoon) && isNaN(foundData[i].perc_loon) == false) {
      loonData.jaar = foundData[i].jaar;
      loonData.perc_loon = foundData[i].perc_loon;
      console.log(loonData)
    } else if (foundData[i].jaar === (d3.max(foundData, yValueLoon)) - 1 && isNaN(foundData[i].perc_loon) == false) {
      loonData.jaar = foundData[i].jaar;
      loonData.perc_loon = foundData[i].perc_loon;
      console.log(loonData)
    } else if (foundData[i].jaar === (d3.max(foundData, yValueLoon)) - 2 && isNaN(foundData[i].perc_loon) == false) {
      loonData.jaar = foundData[i].jaar;
      loonData.perc_loon = foundData[i].perc_loon;
      console.log(loonData)
    } else {
      console.log("onbekend")

    }
  }

  // change strings to numbers
  foundData.forEach(foundData => {
    foundData.perc_winst = +foundData.perc_winst;
    foundData.perc_loon = +foundData.perc_loon;
    loonData.perc_loon = +loonData.perc_loon;
    foundData.omzet_fte = +foundData.omzet_fte;
    foundData.jaar = "'" + foundData.jaar.slice(2, 4);;
  })

  // Show the healthy line on the chart
  // Winstpercentage
  const minValueY = d3.min(foundData, yValue)
  const maxValueY = d3.max(foundData, yValue)
  let domainValueYPlus
  if (maxValueY < 11) { domainValueYPlus = 11 } else {
    domainValueYPlus = maxValueY + 1
  }
  let domainValueYMin
  if (minValueY < 0) {
    domainValueYMin = minValueY
  } else {
    domainValueYMin = 0
  }
  const maxValueXLoon = loonData.perc_loon;
  let domainValueXLoon;
  if (maxValueXLoon < 40) { domainValueXLoon = 40 } else {
    domainValueXLoon = domainValueXLoon
  }





  // Set the range of the chart
  // Winstpercentage
  const yScale = d3.scaleLinear()
    .domain([domainValueYMin, domainValueYPlus])
    .range([innerHeight, 0])
    .nice();
  const xScale = d3.scaleBand()
    .domain(foundData.map(xValue))
    .range([0, innerWidth])
    .padding(0.9);
  // Loonpercentage 
  const xScaleLoon = d3.scaleLinear()
    .domain([0, 100])
    .range([0, innerWidthLoon])
  const yScaleLoon = d3.scaleBand()
    .domain(0, 1)
    .range([0, innerHeightLoon])




  // Winstpercentage
  const g = winstSVG.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxisG = g.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG
    .selectAll('.domain, .tick line')
    .remove();

  xAxisG
    .append('text')
    .attr('y', 37)
    .attr('x', innerWidth - 15)
    .attr('id', "titelY")
    .text('Jaar');

  const yAxisG = g.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(0, 0)`)

  yAxisG
    .append('text')
    .attr('y', -15)
    .attr('x', 23)
    .attr('id', "titelY")
    .text('Winst%');

  yAxisG
    .select('#titelY')
    // .attr('transform', 'rotate(-90) ')

  yAxisG
    .selectAll('.tick line')
    .attr('x2', innerWidth)
    .attr("id", d => "number" + d)

  yAxisG
    .selectAll('.tick text')
    .attr("id", d => "numbertxt" + d)

  yAxisG
    .select('#number10')
    .attr('stroke', '#f65645')
    .attr('stroke-dasharray', 7)
    .attr('stroke-width', 2)

  yAxisG
    .select('#number10txt')

  yAxisG
    .select('#number0')
    .attr('stroke-width', 2)

  yAxisG
    .selectAll('.domain')
    .attr('stroke', '#d8cedb')
    .remove()

  // g.selectAll('rect').data(foundData)
  //   .enter().append('rect')
  //   .attr('x', d => xScale(xValue(d)))
  //   .attr('y', d => y(Math.max(0, yValue(d))))
  //   .attr('width', xScale.bandwidth())
  //   .attr('height', d => Math.abs(y(yValue(d)) - y(0)))

  g.selectAll('a').data(foundData)
    .enter()
    .append('line')
    .attr("x1", d => xScale(xValue(d)) + 3)
    .attr("x2", d => xScale(xValue(d)) + 3)
    .attr("y1", d => yScale(0))
    .attr("y2", d => yScale(yValue(d)))
    .attr("stroke", "#6b38e8")
    .attr('stroke-width', 1.5)

  g.selectAll('circle').data(foundData)
    .enter().append('circle')
    .attr("cx", d => xScale(xValue(d)) + 3)
    .attr("cy", d => yScale(yValue(d)))
    .attr("r", "4")
    .style("fill", "#F2F2F2")
    .attr("stroke", "#6b38e8")
    .attr('stroke-width', 1.5)

  // Loonpercentage
  const gLoon = loonSVG.append('g')
    .attr('transform', `translate(${marginLoon.left},${marginLoon.top})`);


  gLoon.selectAll('rect').data(loonDataArray)
    .enter().append('rect')
    .attr('y', d => yScaleLoon(d.jaar))
    .attr('width', d => xScaleLoon(xValueLoon(d)))
    .attr('height', 65)
    .attr("fill", "#6b38e8");

  const xAxisGLoon = gLoon.append('g')
    .call(d3.axisBottom(xScaleLoon))
    .attr('transform', `translate(0, ${innerHeightLoon})`);

  xAxisGLoon
    .selectAll('.domain, .tick line')
    .attr('opacity', 0)

  xAxisGLoon
    .selectAll('.tick text')
    .attr('opacity', 0)
    // .attr('fill', "#6b38e8")
    // .attr("y", 25)

  xAxisGLoon
    .append('text')
    .attr('y', innerHeightLoon - 55)
    .attr('x', innerWidthLoon / 100 * loonData.perc_loon + 35)
    .attr('id', "titelY")
    .attr('fill', "#6b38e8")
    .text(Math.floor(loonData.perc_loon) + '%');

  xAxisGLoon
    .selectAll('.tick line')
    .attr("id", d => "loonnumber" + d)

  xAxisGLoon
    .selectAll('.tick text')
    .attr("id", d => "loonnumbertxt" + d)

  xAxisGLoon
    .select('#loonnumber40')
    .attr('opacity', 1)
    .attr('stroke', '#f65645')
    .attr('stroke-dasharray', 7)
    .attr('stroke-width', 2)
    .attr('y1', 30)
    .attr('y2', -68)


  xAxisGLoon
    .select('#loonnumbertxt40')
    .attr('opacity', 1)
    .attr('y', 35)
    .text("40%")

  //   xAxisGLoon
  //     .selectAll('.domain')
  //     .attr('stroke', '#d8cedb')
  //     .remove()

}