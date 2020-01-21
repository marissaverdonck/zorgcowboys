const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const concerncode = urlParams.get('concerncode');
const searchword = urlParams.get('search');
const winstSVG = d3.select('#winstSVG');
const loonSVG = d3.select('#loonSVG');
const fteSVG = d3.select('#fteSVG');
const jaartal = document.getElementById("jaartal");
const h2_name = document.getElementById("name");
const h3_place = document.getElementById("place");
const samenvattingWinst = document.getElementById("samenvattingWinst");
const samenvattingLoon = document.getElementById("samenvattingLoon");
const samenvattingFte = document.getElementById("samenvattingFte");
const backbutton = document.getElementById("back");
const width = 280;
const height = 330;
const widthLoon = 280;
const heightLoon = 100;
const widthFte = 210;
const heightFte = 300;
const margin = { top: 50, right: 0, bottom: 20, left: 28 };
const marginLoon = { top: 45, right: 40, bottom: 5, left: 0 };
const marginFte = { top: 60, right: 0, bottom: 5, left: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const innerWidthLoon = widthLoon - marginLoon.left - marginLoon.right;
const innerHeightLoon = heightLoon - marginLoon.top - marginLoon.bottom;
const innerWidthFte = widthFte - marginFte.left - marginFte.right;
const innerHeightFte = heightFte - marginFte.top - marginFte.bottom;

h2_name.innerHTML = name
h3_place.innerHTML = place
backbutton.setAttribute("href", "result.html?search=" + searchword)

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
  // Omzet FTE
  const yValueFte = d => d.omzet_fte;
  const xValueFte = d => d.jaar;
  // Show years in title Winstpercentage
  jaartal.innerHTML = (d3.min(foundData, xValue) + "-" + d3.max(foundData, xValue))






  // Get data from latetst year and make a new array
  // Loonpercentage
  const maxYear = d3.max(foundData, xValue)
    // Winst
  const winstData = new Object();
  const WinstDataArray = [winstData]
  var i;
  for (i = 0; i < foundData.length; i++) {
    if (foundData[i].jaar == maxYear && isNaN(foundData[i].perc_winst) == false) {
      winstData.jaar = foundData[i].jaar;
      winstData.perc_winst = foundData[i].perc_winst;
    } else if (foundData[i].jaar == (maxYear - 1) && isNaN(foundData[i].perc_winst) == false) {
      winstData.jaar = foundData[i].jaar;
      winstData.perc_winst = foundData[i].perc_winst;
    } else if (foundData[i].jaar == (maxYear - 2) && isNaN(foundData[i].perc_winst) == false) {
      winstData.jaar = foundData[i].jaar;
      winstData.perc_winst = foundData[i].perc_winst;
    } else {}
  }




  const loonData = new Object();
  const loonDataArray = [loonData]
  var i;
  for (i = 0; i < foundData.length; i++) {
    if (foundData[i].jaar == maxYear && isNaN(foundData[i].perc_loon) == false) {
      loonData.jaar = foundData[i].jaar;
      loonData.perc_loon = foundData[i].perc_loon;
      h2_name.innerHTML = foundData[i].bedrijfsnaam
      h3_place.innerHTML = foundData[i].plaats
    } else if (foundData[i].jaar == (maxYear - 1) && isNaN(foundData[i].perc_loon) == false) {
      loonData.jaar = foundData[i].jaar;
      loonData.perc_loon = foundData[i].perc_loon;

    } else if (foundData[i].jaar == (maxYear - 2) && isNaN(foundData[i].perc_loon) == false) {
      loonData.jaar = foundData[i].jaar;
      loonData.perc_loon = foundData[i].perc_loon;
    } else {}
  }
  // Omzet FTE
  const fteData = new Object();
  const fteDataArray = [fteData]
  var i;
  for (i = 0; i < foundData.length; i++) {
    if (foundData[i].jaar == maxYear && isNaN(foundData[i].omzet_fte) == false) {
      fteData.jaar = foundData[i].jaar;
      fteData.omzet_fte = foundData[i].omzet_fte;

    } else if (foundData[i].jaar == (maxYear - 1) && isNaN(foundData[i].omzet_fte) == false) {
      fteData.jaar = foundData[i].jaar;
      fteData.omzet_fte = foundData[i].omzet_fte;

    } else if (foundData[i].jaar == (maxYear - 2) && isNaN(foundData[i].omzet_fte) == false) {
      fteData.jaar = foundData[i].jaar;
      fteData.omzet_fte = foundData[i].omzet_fte;

    } else {}
  }

  // change strings to numbers
  foundData.forEach(foundData => {
    foundData.perc_winst = +foundData.perc_winst;
    foundData.perc_loon = +foundData.perc_loon;
    loonData.perc_loon = +loonData.perc_loon;
    fteData.omzet_fte = +fteData.omzet_fte;
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
  const maxValueYFte = fteData.omzet_fte
  console.log(maxValueYFte)

  let domainValueYFte;
  if (maxValueYFte < 130000) { domainValueYFte = 130000 } else {
    domainValueYFte = maxValueYFte
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
    // Omzet FTE

  const yScaleFte = d3.scaleLinear()
    .domain([0, domainValueYFte])
    .range([innerHeightFte, 0])
  const xScaleFte = d3.scaleBand()
    .domain(0, 1)
    .range([0, innerWidthFte])





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



  // Omzet FTE
  const gFte = fteSVG.append('g')
    .attr('transform', `translate(${marginFte.left},${marginFte.top})`);

  console.log(fteDataArray)
  console.log(fteData)

  gFte.selectAll('rect').data(fteDataArray)
    .enter().append('rect')
    .attr('x', 20)
    .attr('width', 180)
    .attr('height', d => innerHeightFte - yScaleFte(yValueFte(d)))
    .attr("fill", "#1beaae")
    .attr('transform', d => `translate(0,${yScaleFte(yValueFte(d))})`);



  const yAxisGFte = gFte.append('g')
    .call(d3.axisRight(yScaleFte))
    .attr('transform', `translate(${innerWidthFte},0)`);

  yAxisGFte
    .selectAll('.tick line')
    .attr('x2', -innerWidth)
    .attr("id", d => "number" + d)
    .attr('opacity', 0)

  yAxisGFte
    .selectAll('.tick text')
    .attr("id", d => "numbertxt" + d)
    .attr('opacity', 0)


  yAxisGFte
    .select('#number120000')
    .attr('stroke', '#f65645')
    .attr('stroke-dasharray', 8)
    .attr('stroke-width', 2)
    .attr('opacity', 1)

  yAxisGFte
    .select('#numbertxt120000')
    .attr('opacity', 1)
    .text("€125.000")


  yAxisGFte
    .selectAll('.domain')
    .remove()

  function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return num_parts.join(".");
  }

  yAxisGFte
    .append('text')
    .attr('y', innerHeightFte - (innerHeightFte / domainValueYFte * fteData.omzet_fte) + 30)
    // .attr('y', 0)
    .attr('x', -innerWidthFte + 60)
    .attr('id', "titelYFte")
    .attr('fill', "#6b38e8")
    .text('€' + thousands_separators(Math.floor(fteData.omzet_fte)) + ',-');





  console.log(winstData.perc_winst + '%')
    //Summary fill in
  samenvattingWinst.innerHTML = (winstData.perc_winst + '%');
  samenvattingLoon.innerHTML = (Math.floor(loonData.perc_loon) + '%');
  samenvattingFte.innerHTML = ('€' + thousands_separators(Math.floor(fteData.omzet_fte)) + ',-');
}