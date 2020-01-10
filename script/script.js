var list = d3.select('body').append('ul');

// After clicking the search button, get the value from the field
function getInputSearchField() {
  const inputText = document.getElementById("inputText").value;

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

    // update li elements
    var text = list.selectAll('li').data(foundPlace)
    text
      .attr("xlink:href", function(foundPlace) {
        return "http://zorgcowboys/" + foundPlace.concerncode + ".com"
      })
      .text(function(foundPlace) {
        return foundPlace.bedrijfsnaam + ", " + foundPlace.plaats;
      })
      // Open new tab
      .on('click', function(foundPlace) {
        window.open("http://zorgcowboys/" + foundPlace.concerncode + ".com")
      });
    // exit li elements
    text
      .exit()
      .remove();
    // enter li elements
    text
      .enter()
      .append('li')
      .append('a')
      .attr("xlink:href", function(foundPlace) {
        return "http://zorgcowboys/" + foundPlace.concerncode + ".com"
      })
      .text(function(foundPlace) {
        return foundPlace.bedrijfsnaam + ", " + foundPlace.plaats;
      })
      // Open new tab
      .on('click', function(foundPlace) {
        window.open("http://zorgcowboys/" + foundPlace.concerncode + ".com")
      });
  }
}