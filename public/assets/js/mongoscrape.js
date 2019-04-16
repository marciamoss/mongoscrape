$(function() {

    $("#scrapenews").html("<p id='bare'>mongo scraper</p>");
    
    $('#display').on('click', function (event) {
        event.preventDefault();
        $("#scrapenews").empty();
        // Grab all of the scraped news
        $.getJSON("/api/news", function(data) {
            if(data.length>0){
                // For each news...
                for (var i = 0; i < data.length; i++) {  
                    // ...populate #results with a p-tag that includes the note's title and object id
                        $("#scrapenews").prepend(
                            `<div class="card bg-light mb-3" data-id=${data[i]._id}">
                                <div class="card-header">${data[i].headline}</div>
                                <div class="card-body">
                                    <h5 class="card-title"><a href="https://www.nytimes.com/section/us${data[i].url}">https://www.nytimes.com/section/us${data[i].url}</a></h5>
                                    <p class="card-text">${data[i].summary}</p>
                                    <form class="form-inline my-2 my-lg-0">
                                    <button class="btn btn-md btn-success font-weight-bold my-2 my-sm-0 mr-2 saveArticle" data-id=${data[i]._id}>Save Article!</button>
                                    </form>
                                </div>
                            </div>`
                        );
                        $('.saveArticle').unbind().click(function(event) {
                            event.preventDefault();
                            articleid=$(this).attr("data-id");       
                            $.ajax({
                                type: "POST",
                                dataType: "json",
                                url: "/",
                                data: {
                                  save: 'Yes',
                                  articleid: articleid
                                }
                              })
                              // If that API call succeeds, add the title and a delete button for the note to the page
                            .then(function(data) {  
                            });
                            $('#savemsg').modal('show');
                        });
        
                }
            }else{
                $("#scrapenews").html("<p id='bare'>mongo scraper</p>");
            }
            
        });
    });  
    
    $('#scrape').on('click', function (event) {
        event.preventDefault();  
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
        $('#confirm').modal('show');
 
    });

    $('#savednews').on('click', function (event) {
        event.preventDefault();
        $("#scrapenews").empty();
        // Grab all of the scraped news
        $.getJSON("/api/savednews", function(data) {
            if(data.length>0){
                // For each news...
                for (var i = 0; i < data.length; i++) {  
                    // ...populate #results with a p-tag that includes the note's title and object id
                        $("#scrapenews").prepend(
                            `<div class="card bg-light mb-3" data-id=${data[i]._id}">
                                <div class="card-header">${data[i].headline}</div>
                                <div class="card-body">
                                    <h5 class="card-title"><a href="https://www.nytimes.com/section/us${data[i].url}">https://www.nytimes.com/section/us${data[i].url}</a></h5>
                                    <p class="card-text">${data[i].summary}</p>
                                    <form class="form-inline my-2 my-lg-0">
                                    <button class="btn btn-md btn-success font-weight-bold my-2 my-sm-0 mr-2 notes" data-id=${data[i]._id}>Save Article!</button>
                                    </form>
                                </div>
                            </div>`
                        );
       
                }
            }else{
                $("#scrapenews").html("<p id='bare'>mongo scraper</p>");
            }
            
        });
    }); 

});
