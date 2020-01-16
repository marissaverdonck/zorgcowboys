const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const concerncode = urlParams.get('concerncode')
const winstSVG = d3.select('#winstSVG')
const width = 360
const height = 500

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
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
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
  // change strings to numbers
  foundData.forEach(foundData => {
    foundData.perc_winst = +foundData.perc_winst;
    foundData.perc_loon = +foundData.perc_loon;
    foundData.omzet_fte = +foundData.omzet_fte;
    foundData.jaar = +foundData.jaar;
  })

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(foundData, yValue)])
    .range([innerHeight, 0]);

  var xScale = d3.scaleBand()
    .domain(foundData.map(xValue))
    .range([0, innerWidth])
    .padding(0.1);

  const g = winstSVG.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


  //   const yAxis = d3.axisLeft(yScale);
  //   const xAxis = d3.axisBottom(xScale);

  g.append('g').call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${innerHeight})`);


  g.append('g').call(d3.axisLeft(yScale))
    .attr('transform', `translate(0, 0)`)




  g.selectAll('rect').data(foundData)
    .enter().append('rect')
    .attr('x', d => xScale(xValue(d)))
    // .attr('width', d => xScale(xValue(d)))
    // .attr('height', yScale.bandwidth());
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(yValue(d)))
    .attr('transform', d => `translate(0,${yScale(yValue(d))})`);













}