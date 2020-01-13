var section = d3.select('#results')


// After clicking the search button, get the value from the field
function getInputSearchField() {
  const inputText = document.getElementById("inputText").value;
  console.log(inputText)
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
    var foundPlace = getCompanyByPlace(inputText);

    // filter the data by input search field
    function getCompanyByPlace(inputText) {
      return data.filter(
        function x(data) {
          var x = inputText == data.plaats || inputText == data.bedrijfsnaam
          return x
        }
      );
    }

    // d3 elements
    // selectAll (li), because li dont excist, it can  be updatet. 
    var section_h1_1 = section.select('#resultsText1')
    var section_h1_2 = section.select('#resultsText2')
    var section_h1_3 = section.select('#resultsText3')
    var numberOfResults = foundPlace.length
    var article = section.selectAll('li').data(foundPlace).enter().append('article');
    var allArticles = section.selectAll('article').data(foundPlace)
    var article_imgKindOfCare = d3.selectAll('.kindOfCare').data(foundPlace)
    var article_a = section.selectAll('a').data(foundPlace)
    var article_h2 = article_a.selectAll('a > h2').data(foundPlace)
    var article_h3 = d3.selectAll('article > h3').data(foundPlace)
    var article_p = d3.selectAll('article > p').data(foundPlace)
    var article_imgAlert = d3.selectAll('#alert').data(foundPlace)

    console.log(numberOfResults)

    // Update elements

    section_h1_1
      .text("Resultaten voor ")
    section_h1_2
      .text(" ' " + inputText + "' ")
    section_h1_3
      .text(" (" + numberOfResults + ")")


    article_imgKindOfCare
      .attr("src", function(foundPlace) {
        if (foundPlace.thuiszorg == 'yes' || foundPlace.thuiszorg == 'ja') {
          console.log('thuiszorg' + foundPlace.thuiszorg)
          return "images/icons/home_white.png";
        } else if (foundPlace.gehandicaptenzorg == 'yes' || foundPlace.gehandicaptenzorg == 'ja') {
          console.log('gehandicaptenzorg' + foundPlace.gehandicaptenzorg)
          return "images/icons/handicap_white.png";
        } else if (foundPlace.geestelijkegezondheidszorg == 'yes' || foundPlace.geestelijkegezondheidszorg == 'ja') {
          console.log('geestelijkegezondheidszorg' + foundPlace.geestelijkegezondheidszorg)
          return "images/icons/mental_white.png";
        }
      })
    article_a
      .attr("xlink:href", function(foundPlace) {
        return "http://zorgcowboys/" + foundPlace.plaats + foundPlace.concerncode + ".com"
      })
    article_h2
      .attr('id', 'article_h2')
      .text(function(foundPlace) {
        return foundPlace.bedrijfsnaam;
      })
      // Open new tab
      .on('click', function(foundPlace) {
        window.open("http://zorgcowboys/" + foundPlace.concerncode + ".com")
      })
    article_h3
      .text(function(foundPlace) {
        return foundPlace.plaats;
      })
    article_p
      .text(function(foundPlace) {
        return "Winstpercentage: " + foundPlace.perc_winst + "%";
      })
    article_imgAlert
      .attr("src", function(foundPlace) {
        if (foundPlace.perc_winst > 10) {
          return "images/icons/alert_solid.png";
        } else if (foundPlace.perc_winst < 10) {
          return "images/icons/check_solid.png";
        } else {
          return "images/icons/Percentage.png";
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
      .attr("src", function(foundPlace) {
        if (foundPlace.thuiszorg == 'yes' || foundPlace.thuiszorg == 'ja') {
          console.log('thuiszorg' + foundPlace.thuiszorg)

          return "images/icons/home_white.png";
        } else if (foundPlace.gehandicaptenzorg == 'yes' || foundPlace.gehandicaptenzorg == 'ja') {
          console.log('gehandicaptenzorg' + foundPlace.gehandicaptenzorg)
          return "images/icons/handicap_white.png";
        } else if (foundPlace.geestelijkegezondheidszorg == 'yes' || foundPlace.geestelijkegezondheidszorg == 'ja') {
          console.log('geestelijkegezondheidszorg' + foundPlace.geestelijkegezondheidszorg)
          return "images/icons/mental_white.png";
        }
      })
    article
      .append('a')
      .attr("xlink:href", function(foundPlace) {
        return "http://zorgcowboys/" + foundPlace.plaats + foundPlace.concerncode + ".com"
      })
      .append('h2')
      .attr('id', 'article_h2')
      .text(function(foundPlace) {
        return foundPlace.bedrijfsnaam;
      })
      // Open new tab
      .on('click', function(foundPlace) {
        window.open("http://zorgcowboys/" + foundPlace.concerncode + ".com")
      })
    article
      .append('h3')
      .text(function(foundPlace) {
        return foundPlace.plaats;
      })
    article
      .append('img')
      .attr('class', 'winst')
      .attr("src", "images/icons/money_purple.png")

    article
      .append('p')
      .attr('class', 'winst')
      .text(function(foundPlace) {
        return "Winstpercentage: " + foundPlace.perc_winst + "%";
      })
    article
      .append('img')
      .attr('class', 'winst')
      .attr('id', 'alert')
      .attr("src", function(foundPlace) {
        if (foundPlace.perc_winst > 10) {
          return "images/icons/alert_solid.png";
        } else if (foundPlace.perc_winst < 10) {
          return "images/icons/check_solid.png";
        } else {
          return "images/icons/Percentage.png";
        }
      })
    article
      .append('div')
    article
      .append('img')
      .attr('class', 'loon')
      .attr("src", "images/icons/wallet_purple.png")
    article
      .append('p')
      .attr('class', 'loon')
      .text(function(foundPlace) {
        return "Percentage loon: " + foundPlace.perc_loon + "%";
      })
    article
      .append('img')
      .attr('class', 'loon')
      .attr('id', 'alert')
      .attr("src", function(foundPlace) {
        if (foundPlace.perc_loon > 40) {
          return "images/icons/alert_solid.png";
        } else if (foundPlace.perc_loon < 40) {
          return "images/icons/check_solid.png";
        } else {
          return "images/icons/Percentage.png";
        }
      })
    article
      .append('div')
    article
      .append('img')
      .attr('class', 'fte')
      .attr("src", "images/icons/user_purple.png")
    article
      .append('p')
      .attr('class', 'fte')
      .text(function(foundPlace) {
        return "Omzet per FTE: €" + foundPlace.omzet_fte;
      })
    article
      .append('img')
      .attr('class', 'fte')
      .attr('id', 'alert')
      .attr("src", function(foundPlace) {
        if (foundPlace.omzet_fte > 125000) {
          return "images/icons/alert_solid.png";
        } else if (foundPlace.omzet_fte < 125000) {
          return "images/icons/check_solid.png";
        } else {
          return "images/icons/Percentage.png";
        }
      })
  }
}

// searchButton.addEventListener("click", getInputSearchField);