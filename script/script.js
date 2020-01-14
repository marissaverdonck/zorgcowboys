var section = d3.select('#results')

// After clicking the search button, get the value from the field
function getInputSearchField() {

  const oldInputText = document.getElementById("inputText").value;

  // Remove whitespace at end of text
  var a = oldInputText.length - 1;
  var lastCharacter = oldInputText.charAt(a)
  if (lastCharacter == " ") {
    var inputText = oldInputText.slice(0, a)
  } else {
    var inputText = oldInputText
  }

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
    var foundData = searchData(inputText);
    // filter the data by input search field
    function searchData(inputText) {
      // Get de style differences out of the data
      return data.filter(
        function(data) {
          var inputLowerCase = inputText.toLowerCase()
          var placeLowerCase = data.plaats.toLowerCase()
          var companyLowerCase = data.bedrijfsnaam.toLowerCase()
          var searchInDataFields = inputLowerCase == placeLowerCase || inputLowerCase == companyLowerCase
          return searchInDataFields
        }
      );
    }

    //Filter on double concerncodes and latest years (2017/2018)
    var i = 0;
    var checkdoubleconcerncode = [];
    var dataFiltered = [];
    for (i = 0; i < foundData.length; i++) {
      if (checkdoubleconcerncode.indexOf(foundData[i].concerncode) == -1 && foundData[i].jaar == 2018) {
        checkdoubleconcerncode.push(foundData[i].concerncode)
        dataFiltered.push(foundData[i])
      } else if (checkdoubleconcerncode.indexOf(foundData[i].concerncode) == -1 && foundData[i].jaar == 2017) {
        checkdoubleconcerncode.push(foundData[i].concerncode)
        dataFiltered.push(foundData[i])
      }
      console.log(dataFiltered)
    }

    // d3 elements
    // selectAll (li), because li dont excist, it can  be updatet. 
    var section_h1_1 = section.select('#resultsText1')
    var section_h1_2 = section.select('#resultsText2')
    var section_h1_3 = section.select('#resultsText3')
    var numberOfResults = dataFiltered.length
    var article = section.selectAll('li').data(dataFiltered).enter().append('article').append('a');
    var allArticles = section.selectAll('article').data(dataFiltered)
    var article_imgKindOfCare = d3.selectAll('.kindOfCare').data(dataFiltered)
    var article_a = section.selectAll('a').data(dataFiltered)
    var article_h2 = d3.selectAll('a > h2').data(dataFiltered)
    var article_h3 = d3.selectAll('a > h3').data(dataFiltered)
    var article_p = d3.selectAll('a > p').data(dataFiltered)
    var article_pWinst = d3.selectAll('#textwinst').data(dataFiltered)
    var article_pLoon = d3.selectAll('#textloon').data(dataFiltered)
    var article_pFte = d3.selectAll('#textfte').data(dataFiltered)
    var article_imgAlertWinst = d3.selectAll('#alertwinst').data(dataFiltered)
    var article_imgAlertLoon = d3.selectAll('#alertloon').data(dataFiltered)
    var article_imgAlertFte = d3.selectAll('#alertfte').data(dataFiltered)

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
          console.log('thuiszorg' + dataFiltered.thuiszorg)
          return "images/icons/home_white.png";
        } else if (dataFiltered.gehandicaptenzorg == 'yes' || dataFiltered.gehandicaptenzorg == 'ja') {
          console.log('gehandicaptenzorg' + dataFiltered.gehandicaptenzorg)
          return "images/icons/handicap_white.png";
        } else if (dataFiltered.geestelijkegezondheidszorg == 'yes' || dataFiltered.geestelijkegezondheidszorg == 'ja') {
          console.log('geestelijkegezondheidszorg' + dataFiltered.geestelijkegezondheidszorg)
          return "images/icons/mental_white.png";
        }
      });
    article_a
      .attr("xlink:href", function(dataFiltered) {
        return "http://zorgcowboys/" + dataFiltered.plaats + dataFiltered.concerncode + ".com"
      });
    article_h2
      .attr('id', 'article_h2')
      .text(function(dataFiltered) {
        return dataFiltered.bedrijfsnaam;
      })
      // Open new tab
      .on('click', function(dataFiltered) {
        window.open("http://zorgcowboys/" + dataFiltered.concerncode + ".com")
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
          return 'Winstpercentage: Ontbreekt'
        } else {
          return "Winstpercentage: " + dataFiltered.perc_winst + "%";
        }
      });
    article_pLoon
      .text(function(dataFiltered) {
        if (dataFiltered.perc_loon == 'NA' || dataFiltered.perc_loon == 'Inf') {
          return 'Percentage loon: Ontbreekt'
        } else {
          return "Percentage loon: " + dataFiltered.perc_loon + "%";
        }
      });
    article_pFte
      .text(function(dataFiltered) {
        if (dataFiltered.omzet_fte == 'NA' || dataFiltered.omzet_fte == 'Inf') {
          return 'Percentage loon: Ontbreekt'
        } else {
          return "Percentage loon: " + dataFiltered.omzet_fte + "%";
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
      .attr("xlink:href", function(dataFiltered) {
        return "http://zorgcowboys/" + dataFiltered.plaats + dataFiltered.concerncode + ".com"
      })
      .append('h2')
      .attr('id', 'article_h2')
      .text(function(dataFiltered) {
        return dataFiltered.bedrijfsnaam;
      })
      // Open new tab
      .on('click', function(dataFiltered) {
        window.open("http://zorgcowboys/" + dataFiltered.concerncode + ".com")
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
          return 'Winstpercentage: Ontbreekt'
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
      .attr("src", "images/icons/missing_violet.png");
    article
      .append('p')
      .attr('class', 'loon')
      .attr('id', 'textloon')
      .text(function(dataFiltered) {
        if (dataFiltered.perc_loon == 'NA' || dataFiltered.perc_loon == 'Inf') {
          return 'Percentage loon: Ontbreekt'
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
          return 'Omzet per FTE: Ontbreekt'
        } else {

          return "Omzet per FTE: €" + dataFiltered.omzet_fte;
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
}

// searchButton.addEventListener("click", getInputSearchField);