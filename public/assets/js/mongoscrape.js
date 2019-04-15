$(function() {

    $("#scrapenews").html("<p id='bare'>mongo scraper</p>");
    
    $('#display').on('click', function (event) {
        event.preventDefault();
        $("#scrapenews").empty();
        // Grab all of the scraped news
        $.getJSON("/api/news", function(data) {
            console.log(data.length);
            // For each news...
            for (var i = 0; i < data.length; i++) {  
            // ...populate #results with a p-tag that includes the note's title and object id
                $("#scrapenews").prepend(
                    `<div class="card bg-light mb-3" data-id=${data[i]._id}">
                        <div class="card-header">${data[i].headline}</div>
                        <div class="card-body">
                            <h5 class="card-title"><a href="https://www.nytimes.com/section/us${data[i].url}">https://www.nytimes.com/section/us${data[i].url}</a></h5>
                            <p class="card-text">${data[i].summary}<span class='delete'>X</span></p>
                        </div>
                    </div>`);

            }
        });
    });  
    
    $('#scrape').on('click', function (event) {
        console.log("scrape clicked");
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/",
            data: {
              scrape: 'Yes',
            }
          })
          // If that API call succeeds, add the title and a delete button for the note to the page
        .then(function(data) {
            
        });
 
    });




});
