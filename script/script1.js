const sectionResults = d3.select('#results');



// const searchButton = document.getElementById("searchButton");


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
      )
    }

    // appended elements to update
    var article = sectionResults.selectAll('article').data(foundPlace)
    var article_a = d3.selectAll('#article_a').data(foundPlace)
    var article_h2 = d3.selectAll('#article_h2').data(foundPlace)
    var article_p = d3.selectAll('#article_p').data(foundPlace)
    console.log(article)
    console.log(article_a)

    // update elements


    article
      .attr("xlink:href", function(foundPlace) {
        return "http://zorgcowboys/" + foundPlace.plaats + foundPlace.concerncode + ".com"
      });
    article_h2
      .text(function(foundPlace) {
        return foundPlace.bedrijfsnaam;
      })
      // Open new tab
      .on('click', function(foundPlace) {
        window.open("http://zorgcowboys/" + foundPlace.plaats + foundPlace.concerncode + ".com")
      });
    article_p
      .text(function(foundPlace) {
        return foundPlace.plaats;
      });
    exit elements


    article
      .exit()
      .remove();




    // enter elements
    article
      .enter()
      .append('article')
      .append('a')
      .attr('id', 'article_a')
      .attr("xlink:href", function(foundPlace) {
        return "http://zorgcowboys/" + foundPlace.plaats + foundPlace.concerncode + ".com"
      });
    article
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
      .append('p')
      .attr('id', 'article_p')
      .text(function(foundPlace) {
        return foundPlace.plaats;
      })

    article
      .append('div')
      .attr('id', 'winst')

    var winst = d3.selectAll('#winst');


    winst
      .append("img")
      .attr("src", "images/icons/money_purple.png")
    winst
      .append('p')
      .text(function(foundPlace) {
        return "Winstpercentage: " + foundPlace.perc_winst + "%";
      })
    winst
      .append("img")
      .attr("src", "images/icons/money_purple.png")

    article
      .append('div')
      .attr('id', 'loon')
    var loon = d3.selectAll('#loon');
    loon
      .append("img")
      .attr("src", "images/icons/money_purple.png")
    loon
      .append('p')
      .text(function(foundPlace) {
        return "Percentage loon: " + foundPlace.perc_loon + "%";
      })
    loon
      .append("img")
      .attr("src", "images/icons/money_purple.png")
    article
      .append('div')
      .attr('id', 'fte')
    var fte = d3.selectAll('#fte');
    fte
      .append("img")
      .attr("src", "images/icons/money_purple.png")
    fte
      .append('p')
      .text(function(foundPlace) {
        return "Omzet per FTE: €" + foundPlace.omzet_fte;
      })
    fte
      .append("img")
      .attr("src", "images/icons/money_purple.png")




  }
}

// searchButton.addEventListener("click", getInputSearchField);