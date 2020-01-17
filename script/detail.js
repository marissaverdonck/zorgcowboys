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



  const maxValueY = d3.max(foundData, yValue)

  var domainValueY
  if (maxValueY < 10) { domainValueY = 10 } else {
    domainValueY = maxValueY
  }



  var yScale = d3.scaleLinear()
    .domain([0, domainValueY])
    .range([innerHeight, 0])


  //   var yAxisScale = d3.scaleLinear()
  //     .domain([d3.min(foundData), d3.max(foundData)])
  //     .range([innerHeight - yScale(d3.min(foundData)), 0]);


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
    .call(d3.axisLeft(yScale))
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

  yAxisG
    .selectAll('.domain')
    .remove();

  g.selectAll('rect').data(foundData)
    .enter().append('rect')
    .attr('x', d => xScale(xValue(d)))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(yValue(d)))
    .attr('transform', d => `translate(0,${yScale(yValue(d))})`);














}