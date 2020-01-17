const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const concerncode = urlParams.get('concerncode')
const name = urlParams.get('name')
const place = urlParams.get('place')
const winstSVG = d3.select('#winstSVG')
var jaartal = document.getElementById("jaartal")
var h2_name = document.getElementById("name")
var h3_place = document.getElementById("place")



h2_name.innerHTML = name
h3_place.innerHTML = place

const width = 360
const height = 300

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
  const margin = { top: 50, right: 20, bottom: 20, left: 30 };
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



  var yScale = d3.scaleLinear()
    .domain([0, d3.max(foundData, yValue)])
    .range([innerHeight, -10]);

  var xScale = d3.scaleBand()
    .domain(foundData.map(xValue))
    .range([0, innerWidth])
    .padding(0.9);



  const g = winstSVG.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


  //   const yAxis = d3.axisLeft(yScale);
  //   const xAxis = d3.axisBottom(xScale);

  const xAxis = d3.axisBottom(xScale)
    .tickSize(90)

  const xAxisG = g.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG
    .selectAll('.domain, .tick line')
    .remove();

  //   xAxisG
  //     .append('text')
  //     .attr('y', 40)
  //     .attr('x', innerWidth / 2)
  //     .attr('fill', 'black')
  //     .text('Jaartal');




  const yAxisG = g.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(0, 0)`)



  yAxisG
    .selectAll('.domain, .tick line')
    .remove();

  g.selectAll('rect').data(foundData)
    .enter().append('rect')
    .attr('x', d => xScale(xValue(d)))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(yValue(d)))
    .attr('transform', d => `translate(0,${yScale(yValue(d))})`);














}