$(function() {
    $("#scrapenews").html("<p id='bare'>mongo scraper</p>");
    
    $('#display').on('click', function (event) {
        event.preventDefault();
        displaynews("/api/news");
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
        displaynews("/api/news");
        $('#confirm').modal('show');
 
    });

    $('#savednews').on('click', function (event) {
        event.preventDefault();
        displaynews("/api/savednews")
    }); 

    function displaynews(newsapi){
        $("#scrapenews").empty();
        // Grab all of the scraped news
        $.getJSON(`${newsapi}`, function(data) {
            if(data.length>0){
                let buttondisp;
                // For each news...
                for (var i = 0; i < data.length; i++) {  
                    if(newsapi==="/api/news"){
                        buttondisp=`<button class="btn btn-md btn-success font-weight-bold my-2 my-sm-0 mr-2 saveArticle" data-id=${data[i]._id}>Save Article!</button>`;
                    }else if(newsapi==="/api/savednews"){
                        buttondisp=`<button class="btn btn-md btn-info font-weight-bold my-2 my-sm-0 mr-2 addNotes" data-id=${data[i]._id}>Add Notes</button>
                                    <button class="btn btn-md btn-danger font-weight-bold my-2 my-sm-0 mr-2 deletesaved" data-id=${data[i]._id}>Delete from saved</button>`;
                    }
                    // ...populate #results with a p-tag that includes the note's title and object id
                    $("#scrapenews").prepend(
                        `<div class="card bg-light mb-3" data-id=${data[i]._id}">
                            <div class="card-header">${data[i].headline}</div>
                            <div class="card-body">
                                <h5 class="card-title"><a href="https://www.nytimes.com${data[i].url}" target="blank">https://www.nytimes.com${data[i].url}</a></h5>
                                <p class="card-text">${data[i].summary}</p>
                                <form class="form-inline my-2 my-lg-0">
                                ${buttondisp}
                                </form>
                            </div>
                        </div>`
                    );
                    if(newsapi==="/api/news"){
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
                            .then(function(data) {  
                            });
                            $('#savemsg').modal('show');
                            displaynews("/api/news");
                        });
                    }
                    else if(newsapi==="/api/savednews"){                       
                        $('.addNotes').unbind().click(function(event) {
                            event.preventDefault();
                            let uid=$(this).attr("data-id");
                            $("#allnotes").empty();
                            function displaynotes(){
                                for(var i=0;i<data.length;i++){
                                    if(data[i]._id===uid){
                                        for(var j=0;j<data[i].notes.length;j++){
                                            $("#allnotes").prepend(`<li>${data[i].notes[j].usernote}<span class="delete">X</span></li`);
                                        }
                                    }  
                                }
                            }
                            displaynotes();
                            $('#add-notes').modal('show'); 
                            // delete note
                            $('.delete').unbind().click(function(event) {
                                let note, noteid;
                                note= $(this).parent().text();
                                note=note.substring(0,((note.length)-1));
                                for(var i=0;i<data.length;i++){
                                    if(data[i]._id===uid){
                                        for(var j=0;j<data[i].notes.length;j++){
                                            if(data[i].notes[j].usernote===note){
                                                noteid=data[i].notes[j]._id;
                                            }
                                        }
                                    }  
                                }
                                $(this).parent().empty();
                                $.ajax({
                                    type: "POST",
                                    dataType: "json",
                                    url: "/",
                                    data: {
                                    deletenote: 'Yes',
                                    nid: noteid,
                                    usernote: note
                                    }
                                })
                                .then(function(data) {  
                                    displaynews("/api/savednews");
                                });
                                
                            });
                            
                            //////////////////
                            $('#savethisnote').unbind().click(function(event) {
                                event.preventDefault();
                                let usernote=$(".thoughts").val().trim();
                                $(".thoughts").val("");
                                if(usernote !== ""){
                                    $.ajax({
                                        type: "POST",
                                        dataType: "json",
                                        url: "/",
                                        data: {
                                        addnote: 'Yes',
                                        uid,
                                        usernote
                                        }
                                    })
                                    .then(function(data) {  
                                        displaynews("/api/savednews");
                                        $("#allnotes").prepend(`<li>${usernote}<span class="delete">X</span></li`);
                                    });
                                }   
                            });
                        });
                    }
                }
            }else{
                $("#scrapenews").html("<p id='bare'>mongo scraper</p>");
            }
            
        });

    }

});
