const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchword = urlParams.get('search');
const section = d3.select('#results')
const searchButton = document.getElementById("searchButton")
const name = document.getElementById("name")
const inputText = searchword

// Fetch gives access to the json file
// .then wait till data is loaded, otherwise crash
fetch('data.json')
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    getData(myJson)
  })

function getData(data) {
  const foundData = searchData(inputText);
  // filter the data by input search field
  function searchData(inputText) {
    // Get de style differences out of the data
    return data.filter(
      function(data) {
        const inputLowerCase = inputText.toLowerCase()
        const placeLowerCase = data.plaats.toLowerCase()
        const companyLowerCase = data.bedrijfsnaam.toLowerCase()
        const searchInDataFields = inputLowerCase == placeLowerCase || inputLowerCase == companyLowerCase
        return searchInDataFields
      }
    );
  }

  //Filter on double concerncodes and latest years (2017/2018)
  var i = 0;
  const checkdoubleconcerncode = [];
  const dataFiltered = [];
  for (i = 0; i < foundData.length; i++) {
    if (checkdoubleconcerncode.indexOf(foundData[i].concerncode) == -1 && foundData[i].jaar == 2018) {
      checkdoubleconcerncode.push(foundData[i].concerncode)
      dataFiltered.push(foundData[i])
    }
    // else if (checkdoubleconcerncode.indexOf(foundData[i].concerncode) == -1 && foundData[i].jaar > 2017) {
    //   checkdoubleconcerncode.push(foundData[i].concerncode)
    //   dataFiltered.push(foundData[i])
    // }
  }

  // d3 elements
  // selectAll (li), because li dont excist, it can  be updatet. 
  const section_h1_1 = section.select('#resultsText1')
  const section_h1_2 = section.select('#resultsText2')
  const section_h1_3 = section.select('#resultsText3')
  const numberOfResults = dataFiltered.length
  const article = section.selectAll('li').data(dataFiltered).enter().append('article').append('a');
  const allArticles = section.selectAll('article').data(dataFiltered)
  const article_imgKindOfCare = d3.selectAll('.kindOfCare').data(dataFiltered)
  const article_a = section.selectAll('a').data(dataFiltered)
  const article_h2 = d3.selectAll('a > h2').data(dataFiltered)
  const article_h3 = d3.selectAll('a > h3').data(dataFiltered)
  const article_p = d3.selectAll('a > p').data(dataFiltered)
  const article_pWinst = d3.selectAll('#textwinst').data(dataFiltered)
  const article_pLoon = d3.selectAll('#textloon').data(dataFiltered)
  const article_pFte = d3.selectAll('#textfte').data(dataFiltered)
  const article_imgAlertWinst = d3.selectAll('#alertwinst').data(dataFiltered)
  const article_imgAlertLoon = d3.selectAll('#alertloon').data(dataFiltered)
  const article_imgAlertFte = d3.selectAll('#alertfte').data(dataFiltered)

  // Update elements
  section_h1_1
    .text("Resultaten voor ");
  section_h1_2
    .text(" ' " + inputText + "' ");
  section_h1_3
    .text(" (" + numberOfResults + ")");
  article_imgKindOfCare
    .attr("src", function(dataFiltered) {
      if (dataFiltered.thuiszorg == 'yes' || dataFiltered.thuiszorg == 'ja') {
        return "images/icons/home_white.png";
      } else if (dataFiltered.gehandicaptenzorg == 'yes' || dataFiltered.gehandicaptenzorg == 'ja') {
        return "images/icons/handicap_white.png";
      } else if (dataFiltered.geestelijkegezondheidszorg == 'yes' || dataFiltered.geestelijkegezondheidszorg == 'ja') {
        return "images/icons/mental_white.png";
      }
    });
  article_a
    .attr("xlink:href", function(dataFiltered) {
      return "detail.html?" + "concerncode=" + dataFiltered.concerncode + "&search=" + inputText
    });
  article_h2
    .attr('id', 'article_h2')
    .text(function(dataFiltered) {
      return dataFiltered.bedrijfsnaam;
    })
    // Open new tab
    .on('click', function(dataFiltered) {
      window.location.assign("detail.html?" + "concerncode=" + dataFiltered.concerncode + "&search=" + inputText)
    });
  article_h3
    .text(function(dataFiltered) {
      return dataFiltered.plaats;
    });
  article_p
    .text(function(dataFiltered) {
      return "Winstpercentage: " + dataFiltered.perc_winst + "%";
    });
  article_pWinst
    .text(function(dataFiltered) {
      if (dataFiltered.perc_winst == 'NA' || dataFiltered.perc_winst == 'Inf') {
        return 'Winstpercentage: ontbreekt'
      } else {
        return "Winstpercentage: " + dataFiltered.perc_winst + "%";
      }
    });
  article_pLoon
    .text(function(dataFiltered) {
      if (dataFiltered.perc_loon == 'NA' || dataFiltered.perc_loon == 'Inf') {
        return 'Percentage loon: ontbreekt'
      } else {
        return "Percentage loon: " + dataFiltered.perc_loon + "%";
      }
    });
  article_pFte
    .text(function(dataFiltered) {
      if (dataFiltered.omzet_fte == 'NA' || dataFiltered.omzet_fte == 'Inf') {
        return 'Percentage loon: ontbreekt'
      } else {
        return "Percentage loon: " + Math.floor(dataFiltered.omzet_fte) + "%";
      }
    });
  article_imgAlertWinst
    .attr("src", function(dataFiltered) {
      if (dataFiltered.perc_winst > 10) {
        return "images/icons/alert_solid.png";
      } else if (dataFiltered.perc_winst < 10) {
        return "images/icons/check_solid.png";
      } else {
        return "images/icons/missing_violet.png";
      }
    });
  article_imgAlertLoon
    .attr("src", function(dataFiltered) {
      if (dataFiltered.perc_loon < 40) {
        return "images/icons/alert_solid.png";
      } else if (dataFiltered.perc_loon > 40) {
        return "images/icons/check_solid.png";
      } else {
        return "images/icons/missing_violet.png";
      }
    });
  article_imgAlertFte
    .attr("src", function(dataFiltered) {
      if (dataFiltered.omzet_fte > 125000) {
        return "images/icons/alert_solid.png";
      } else if (dataFiltered.omzet_fte < 125000) {
        return "images/icons/check_solid.png";
      } else {
        return "images/icons/missing_violet.png";
      }
    })
    // Exit  elements
  allArticles
    .exit()
    .remove();

  // Enter elements
  article
    .append('img')
    .attr('class', 'kindOfCare')
    .attr("src", function(dataFiltered) {
      if (dataFiltered.thuiszorg == 'yes' || dataFiltered.thuiszorg == 'ja') {
        return "images/icons/home_white.png";
      } else if (dataFiltered.gehandicaptenzorg == 'yes' || dataFiltered.gehandicaptenzorg == 'ja') {
        return "images/icons/handicap_white.png";
      } else if (dataFiltered.geestelijkegezondheidszorg == 'yes' || dataFiltered.geestelijkegezondheidszorg == 'ja') {
        return "images/icons/mental_white.png";
      }
    });
  article
    .attr("xlink:xlink:href", function(dataFiltered) {
      return "detail.html?" + "concerncode=" + dataFiltered.concerncode + "&search=" + inputText
    })
    .append('h2')
    .attr('id', 'article_h2')
    .text(function(dataFiltered) {
      return dataFiltered.bedrijfsnaam;
    })
    .on('click', function(dataFiltered) {
      window.location.assign("detail.html?" + "concerncode=" + dataFiltered.concerncode + "&search=" + inputText)
    });
  article
    .append('h3')
    .text(function(dataFiltered) {
      return dataFiltered.plaats;
    });
  //Winst
  article
    .append('img')
    .attr('class', 'winst')
    .attr("src", "images/icons/money_purple.png");
  article
    .append('p')
    .attr('class', 'winst')
    .attr('id', 'textwinst')
    .text(function(dataFiltered) {
      if (dataFiltered.perc_winst == 'NA' || dataFiltered.perc_winst == 'Inf') {
        return 'Winstpercentage: ontbreekt'
      } else {
        return "Winstpercentage: " + dataFiltered.perc_winst + "%";
      }
    });
  article
    .append('img')
    .attr('class', 'winst')
    .attr('id', 'alertwinst')
    .attr('class', 'alert')
    .attr("src", function(dataFiltered) {
      if (dataFiltered.perc_winst > 10) {
        return "images/icons/alert_solid.png";
      } else if (dataFiltered.perc_winst < 10) {
        return "images/icons/check_solid.png";
      } else {
        return "images/icons/missing_violet.png";
      }
    })
    //Loon
  article
    .append('div');
  article
    .append('img')
    .attr('class', 'loon')
    .attr("src", "images/icons/wallet_purple.png");
  article
    .append('p')
    .attr('class', 'loon')
    .attr('id', 'textloon')
    .text(function(dataFiltered) {
      if (dataFiltered.perc_loon == 'NA' || dataFiltered.perc_loon == 'Inf') {
        return 'Percentage loon: ontbreekt'
      } else {
        return "Percentage loon: " + dataFiltered.perc_loon + "%";
      }
    });
  article
    .append('img')
    .attr('class', 'loon')
    .attr('id', 'alertloon')
    .attr('class', 'alert')
    .attr("src", function(dataFiltered) {
      if (dataFiltered.perc_loon < 40) {
        return "images/icons/alert_solid.png";
      } else if (dataFiltered.perc_loon > 40) {
        return "images/icons/check_solid.png";
      } else {
        return "images/icons/missing_violet.png";
      }
    });
  article
    .append('div')
    //FTE
  article
    .append('img')
    .attr('class', 'fte')
    .attr("src", "images/icons/user_purple.png");
  article
    .append('p')
    .attr('class', 'fte')
    .attr('id', 'textfte')
    .text(function(dataFiltered) {
      if (dataFiltered.omzet_fte == 'NA' || dataFiltered.omzet_fte == 'Inf') {
        return 'Omzet per FTE: ontbreekt'
      } else {
        return "Omzet per FTE: €" + Math.floor(dataFiltered.omzet_fte);
      }
    });
  article
    .append('img')
    .attr('class', 'fte')
    .attr('class', 'alert')
    .attr('id', 'alertfte')
    .attr("src", function(dataFiltered) {
      if (dataFiltered.omzet_fte > 125000) {
        return "images/icons/alert_solid.png";
      } else if (dataFiltered.omzet_fte < 125000) {
        return "images/icons/check_solid.png";
      } else {
        return "images/icons/missing_violet.png";
      }
    })
}