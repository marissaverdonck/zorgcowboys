const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const concerncode = urlParams.get('concerncode')
const name = urlParams.get('name')
const place = urlParams.get('place')
const winstSVG = d3.select('#winstSVG')
var jaartal = document.getElementById("jaartal")
var h2_name = document.getElementById("name")
var h3_place = document.getElementById("place")
const width = 360
const height = 300


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
  const yValue = d => d.perc_winst;
  const xValue = d => d.jaar;
  const margin = { top: 50, right: 20, bottom: 20, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  var foundData = getCompanyData(concerncode);

  function getCompanyData(concerncode) {
    return data.filter(
      function(data) {
        var searchInData = concerncode == data.concerncode
        return searchInData
      }
    )
  }

  jaartal.innerHTML = (d3.min(foundData, xValue) + "-" + d3.max(foundData, xValue))




  // change strings to numbers
  foundData.forEach(foundData => {
    foundData.perc_winst = +foundData.perc_winst;
    foundData.perc_loon = +foundData.perc_loon;
    foundData.omzet_fte = +foundData.omzet_fte;
    foundData.jaar = "'" + foundData.jaar.slice(2, 4);;
  })


  const minValueY = d3.min(foundData, yValue)
  const maxValueY = d3.max(foundData, yValue)

  var domainValueYPlus
  if (maxValueY < 11) { domainValueYPlus = 11 } else {
    domainValueYPlus = maxValueY + 1
  }
  var domainValueYMin
  if (minValueY < 0) {
    domainValueYMin = minValueY

  } else {
    domainValueYMin = 0
  }







  var y = d3.scaleLinear()
    .domain([domainValueYMin, domainValueYPlus])
    .range([innerHeight, 0])
    .nice();






  //   var yAxisScale = d3.scaleLinear()
  //     .domain([d3.min(foundData, yValue), d3.max(foundData, yValue)])
  //     .range([innerHeight - yScale(d3.min(foundData, yValue)), 0]);


  var xScale = d3.scaleBand()
    .domain(foundData.map(xValue))
    .range([0, innerWidth])
    .padding(0.9);



  const g = winstSVG.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


  //   const yAxis = d3.axisLeft(yScale);
  //   const xAxis = d3.axisBottom(xScale);



  const xAxisG = g.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG
    .selectAll('.domain, .tick line')
    .remove();


  xAxisG
    .append('text')
    .attr('y', 40)
    .attr('x', innerWidth / 2)
    .attr('id', "titelY")
    .text('Jaar');



  const yAxisG = g.append('g')
    .call(d3.axisLeft(y))
    .attr('transform', `translate(0, 0)`)

  yAxisG
    .append('text')
    .attr('y', -40)
    .attr('x', innerHeight / -3.5)
    .attr('id', "titelY")
    .text('Winstpercentage');

  yAxisG
    .select('#titelY')
    .attr('transform', 'rotate(-90) ')




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
    .attr('fill', 'red')

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
    .attr("x1", d => xScale(xValue(d)))
    .attr("x2", d => xScale(xValue(d)))
    .attr("y1", d => y(0))
    .attr("y2", d => y(yValue(d)))
    .attr("stroke", "#6b38e8")
    .attr('stroke-width', 1.5)

  g.selectAll('circle').data(foundData)
    .enter().append('circle')
    .attr("cx", d => xScale(xValue(d)))
    .attr("cy", d => y(yValue(d)))
    .attr("r", "4")
    .style("fill", "#F2F2F2")
    .attr("stroke", "#6b38e8")
    .attr('stroke-width', 1.5)





  // .attr('transform', d => `translate(0,${yScale(yValue(d))})`);
}