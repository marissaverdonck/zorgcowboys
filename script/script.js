// After click search button get the value from the field
function getInputSearchField() {
  const inputText =
    document.getElementById("inputText").value;
  console.log(inputText)
    // // fill in the value in p-element
    // document.getElementById(
    //   "output2").innerHTML = inputText;



  // Fetch geeft toegang tot het json file
  // .then wacht tot de data binnen is, anders crash
  fetch('data.json')
    .then(response => response.json())
    .then(json => getData(json));



  function getData(data) {
    console.log(data)

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

    // Find by Place


    function getCompanyByPlace(plaats) {

      return data.filter(
        function(data) {
          return data.plaats == plaats
        }
      );
    }

    var foundPlace = getCompanyByPlace(inputText);
    var ul = d3.select('body').append('ul');
    ul.selectAll('li')
      .data(foundPlace)
      .enter()
      .append("li")
      .append("a")
      .attr("xlink:href", function(foundPlace) {
        return "http://zorgcowboys/" + foundPlace.concerncode + ".com"
      })
      // Open new tab
      .on('click', function(foundPlace) {
        window.open("http://zorgcowboys/" + foundPlace.concerncode + ".com")
      })
      .text(function(foundPlace) {
        return foundPlace.bedrijfsnaam + ", " + foundPlace.plaats;
      })

  }
}
// Without D3
// var foundPlace = getCompanyByPlace('HEEMSKERK');
// for (let i = 0; i < foundPlace.length; i++) {
//   var para = document.createElement("P");
//   para.innerText = foundPlace[i].bedrijfsnaam;
//   document.body.appendChild(para);