// Fetch geeft toegang tot het json file
// .then wacht tot de data binnen is, anders crash
fetch('data.json')
  .then(response => response.json())
  .then(json => getData(json));

function getData(data) {
  console.log(data)

  function getCompanyByName(bedrijfsnaam) {
    return data.filter(
      function(data) {
        return data.bedrijfsnaam == bedrijfsnaam
      }
    );
  }

  function getCompanyByPlace(plaats) {
    return data.filter(
      function(data) {
        return data.plaats == plaats
      }
    );
  }

  // var foundName = getCompanyByName('Zuidoostzorg');
  // document.getElementById('output1').innerHTML = foundName[0].bedrijfsnaam
  // console.log(foundName);

  var foundPlace = getCompanyByPlace('HEEMSKERK');
  var ul = d3.select('body').append('ul');
  ul.selectAll('li')
    .data(foundPlace)
    .enter()
    .append("li")
    .append("a")
    .attr("xlink:href", function(foundPlace) {
      return foundPlace.concerncode
    })




  .text(function(foundPlace) {
      return foundPlace.bedrijfsnaam + ", " + foundPlace.plaats + ", " +
        foundPlace.concerncode;

    }


  )






}






// var foundPlace = getCompanyByPlace('HEEMSKERK');
// for (let i = 0; i < foundPlace.length; i++) {
//   var para = document.createElement("P");
//   para.innerText = foundPlace[i].bedrijfsnaam;
//   document.body.appendChild(para);