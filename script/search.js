const section = d3.select('#results')
const searchButton = document.getElementById("searchButton")
const name = document.getElementById("name")
const filterThuis = document.getElementById("filterThuis")
const filterHandicap = document.getElementById("filterHandicap")
const filterGeestelijk = document.getElementById("filterGeestelijk")
const filteron = document.getElementsByClassName("filteron")


// After clicking the search button, get the value from the field
function getInputSearchField() {
  const oldInputText = document.getElementById("inputText").value;
  // Remove whitespace at end of text
  const a = oldInputText.length - 1;
  const lastCharacter = oldInputText.charAt(a)
  if (lastCharacter == " ") {
    var inputText = oldInputText.slice(0, a)
  } else {
    var inputText = oldInputText
  }
  searchButton.setAttribute("href", "result.html?search=" + inputText)
}
searchButton.addEventListener("click", getInputSearchField);

// Fetch gives access to the json file
// .then wait till data is loaded, otherwise crash
fetch('data.json')
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    getData(myJson)
  })



function filterGeestelijkegezondheidszorg() {
  fetch('data.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      filterGeestelijk(myJson)
    })

  function filterGeestelijk(data) {
    var dataGeestelijk = data.filter(
      function(data) {
        const geestelijkegezondheidszorgLowerCase = data.geestelijkegezondheidszorg.toLowerCase()
        const filterGeestelijkegezondheidszorg = geestelijkegezondheidszorgLowerCase == "ja" || geestelijkegezondheidszorgLowerCase == "yes"
        return filterGeestelijkegezondheidszorg
      }
    );
    getData(dataGeestelijk)
  }
}


function filterHandicapzorg() {
  fetch('data.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      filterHandicap(myJson)
    })

  function filterHandicap(data) {
    var dataHandicap = data.filter(
      function(data) {
        const handicapzorgLowerCase = data.gehandicaptenzorg.toLowerCase()
        const filterHandicapzorg = handicapzorgLowerCase == "ja" || handicapzorgLowerCase == "yes"
        return filterHandicapzorg
      }
    );
    getData(dataHandicap)
  }
}

function filterThuiszorg() {
  fetch('data.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      filterThuis(myJson)
    })

  function filterThuis(data) {
    var dataThuis = data.filter(
      function(data) {
        const thuiszorgLowerCase = data.thuiszorg.toLowerCase()
        const filterThuiszorg = thuiszorgLowerCase == "ja" || thuiszorgLowerCase == "yes"
        return filterThuiszorg
      }
    );
    getData(dataThuis)
  }
}


function filterGeestelijkegezondheidszorg() {
  fetch('data.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      filterGeestelijk(myJson)
      console.log(myJson)
    })

  function filterGeestelijk(data) {
    var dataGeestelijk = data.filter(
      function(data) {
        const geestelijkegezondheidszorgLowerCase = data.geestelijkegezondheidszorg.toLowerCase()
        const filterGeestelijkegezondheidszorg = geestelijkegezondheidszorgLowerCase == "ja" || geestelijkegezondheidszorgLowerCase == "yes"
        return filterGeestelijkegezondheidszorg
      }
    );
    getData(dataGeestelijk)
  }
}


function nofilter() {
  fetch('data.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      getData(myJson)
    })
}


function getData(data) {

  //Filter on double concerncodes and latest years (2017/2018)
  var i = 0;
  const checkdoubleconcerncode = [];
  const dataFiltered = [];
  for (i = 0; i < data.length; i++) {
    if (checkdoubleconcerncode.indexOf(data[i].concerncode) == -1 && data[i].jaar == 2018 && data[i].perc_winst > 70) {
      checkdoubleconcerncode.push(data[i].concerncode)
      dataFiltered.push(data[i])
    }
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
        return "images/icons/home_white.svg";
      } else if (dataFiltered.gehandicaptenzorg == 'yes' || dataFiltered.gehandicaptenzorg == 'ja') {
        return "images/icons/handicap_white.svg";
      } else if (dataFiltered.geestelijkegezondheidszorg == 'yes' || dataFiltered.geestelijkegezondheidszorg == 'ja') {
        return "images/icons/mental_white.svg";
      }
    });
  article_a
    .attr("xlink:href", function(dataFiltered) {
      return "detail.html?" + "concerncode=" + dataFiltered.concerncode
    });
  article_h2
    .attr('id', 'article_h2')
    .text(function(dataFiltered) {
      return dataFiltered.bedrijfsnaam;
    })
    // Open new tab
    .on('click', function(dataFiltered) {
      window.location.assign("detail.html?" + "concerncode=" + dataFiltered.concerncode)
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
        return "images/icons/alert_solid.svg";
      } else if (dataFiltered.perc_winst < 10) {
        return "images/icons/check_solid.svg";
      } else {
        return "images/icons/missing_violet.svg";
      }
    });
  article_imgAlertLoon
    .attr("src", function(dataFiltered) {
      if (dataFiltered.perc_loon < 40) {
        return "images/icons/alert_solid.svg";
      } else if (dataFiltered.perc_loon > 40) {
        return "images/icons/check_solid.svg";
      } else {
        return "images/icons/missing_violet.svg";
      }
    });
  article_imgAlertFte
    .attr("src", function(dataFiltered) {
      if (dataFiltered.omzet_fte > 125000) {
        return "images/icons/alert_solid.svg";
      } else if (dataFiltered.omzet_fte < 125000) {
        return "images/icons/check_solid.svg";
      } else {
        return "images/icons/missing_violet.svg";
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
        return "images/icons/home_white.svg";
      } else if (dataFiltered.gehandicaptenzorg == 'yes' || dataFiltered.gehandicaptenzorg == 'ja') {
        return "images/icons/handicap_white.svg";
      } else if (dataFiltered.geestelijkegezondheidszorg == 'yes' || dataFiltered.geestelijkegezondheidszorg == 'ja') {
        return "images/icons/mental_white.svg";
      }
    });
  article
    .attr("xlink:xlink:href", function(dataFiltered) {
      return "detail.html?" + "concerncode=" + dataFiltered.concerncode
    })
    .append('h2')
    .attr('id', 'article_h2')
    .text(function(dataFiltered) {
      return dataFiltered.bedrijfsnaam;
    })
    .on('click', function(dataFiltered) {
      window.location.assign("detail.html?" + "concerncode=" + dataFiltered.concerncode)
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
    .attr("src", "images/icons/money_purple_big.png");
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
        return "images/icons/alert_solid.svg";
      } else if (dataFiltered.perc_winst < 10) {
        return "images/icons/check_solid.svg";
      } else {
        return "images/icons/missing_violet.svg";
      }
    })
    //Loon
  article
    .append('div');
  article
    .append('img')
    .attr('class', 'loon')
    .attr("src", "images/icons/wallet_purple_big.png");
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
        return "images/icons/alert_solid.svg";
      } else if (dataFiltered.perc_loon > 40) {
        return "images/icons/check_solid.svg";
      } else {
        return "images/icons/missing_violet.svg";
      }
    });
  article
    .append('div')
    //FTE
  article
    .append('img')
    .attr('class', 'fte')
    .attr("src", "images/icons/person_purple_big.png");
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
        return "images/icons/alert_solid.svg";
      } else if (dataFiltered.omzet_fte < 125000) {
        return "images/icons/check_solid.svg";
      } else {
        return "images/icons/missing_violet.svg";
      }
    })
  console.log(filteron.length)
  return dataFiltered

}

function thuisOn() { filterThuis.classList.add('filteron') }

function thuisOff() { filterThuis.classList.remove('filteron') }

function handicapOn() { filterHandicap.classList.add('filteron') }

function handicapOff() { filterHandicap.classList.remove('filteron') }

function geestelijkOn() { filterGeestelijk.classList.add('filteron') }

function geestelijkOff() { filterGeestelijk.classList.remove('filteron') }

function toggle() { this.classList.toggle('filteron') }


function checkFilter() {
  if (filteron.length == 0) {
    return nofilter()
  } else { console.log("aan") }
}

filterThuis.addEventListener('click', filterThuiszorg)
filterThuis.addEventListener('click', toggle)
filterThuis.addEventListener('click', handicapOff)
filterThuis.addEventListener('click', geestelijkOff)
filterThuis.addEventListener('click', checkFilter)

filterHandicap.addEventListener('click', filterHandicapzorg);
filterHandicap.addEventListener('click', toggle);
filterHandicap.addEventListener('click', thuisOff);
filterHandicap.addEventListener('click', geestelijkOff);
filterHandicap.addEventListener('click', checkFilter)

filterGeestelijk.addEventListener('click', filterGeestelijkegezondheidszorg)
filterGeestelijk.addEventListener('click', toggle)
filterGeestelijk.addEventListener('click', handicapOff)
filterGeestelijk.addEventListener('click', thuisOff)
filterGeestelijk.addEventListener('click', checkFilter)