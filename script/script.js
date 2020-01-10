var list = d3.select('body').append('ul');

// After clicking the search button, get the value from the field
function getInputSearchField() {
  const inputText = document.getElementById("inputText").value;



  // Fetch geeft toegang tot het json file
  // .then wacht tot de data binnen is, anders crash
  fetch('data.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      getData(myJson)
    })

  function getData(data) {







    var foundPlace = getCompanyByPlace(inputText);

    // filter the data by inputText
    function getCompanyByPlace(inputText) {


      return data.filter(

        function x(data) {
          var x = inputText == data.plaats || inputText == data.bedrijfsnaam

          return x

        }




      );


    }


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
    text
      .exit()
      .remove();
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

// Find by Name
// function getCompanyByName(bedrijfsnaam) {
//   return data.filter(
//     function(data) {
//       return data.bedrijfsnaam == bedrijfsnaam
//     }
//   );
// }
// var foundName = getCompanyByName('Zuidoostzorg');
// document.getElementById('output1').innerHTML = foundName[0].bedrijfsnaam
// console.log(foundName);












// Without D3
// var foundPlace = getCompanyByPlace('HEEMSKERK');
// for (let i = 0; i < foundPlace.length; i++) {
//   var para = document.createElement("P");
//   para.innerText = foundPlace[i].bedrijfsnaam;
//   document.body.appendChild(para);