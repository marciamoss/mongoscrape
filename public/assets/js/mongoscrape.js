$(function() {
    $("#scrapenews").html("<p id='bare'>mongo scraper</p>");
     
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
        //displaynews("/api/news");
        $('#confirm').modal('show');
        $('#scrapecomplete').on('click', function (event) {
            window.location.href = '/';
        });  
 
    });

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
        $('#savemsgclose').on('click', function (event) {
            window.location.href = '/';
        });  
    });

    $('#savednews').on('click', function (event) {
        event.preventDefault();
        window.location.href = '/savednews';
    }); 

    $('.addNotes').unbind().click(function(event) {
        event.preventDefault();
        let uid=$(this).attr("data-id");
        $('#add-notes').modal('show'); 
        $("#allnotes").empty();
        $.getJSON("/api/savednews", function(data) {
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    if(data[i]._id===uid){
                        for(var j=0;j<data[i].notes.length;j++){
                            $("#allnotes").prepend(`<li>${data[i].notes[j].usernote}<span class="delete">X</span></li`);
                        }
                    }  
                }
                //save note
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
                            $("#allnotes").prepend(`<li>${usernote}<span class="delete">X</span></li`);
                        });
                    }   
                });
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
                    $(this).parent().remove();
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "/",
                        data: {
                        deletenote: 'Yes',
                        nid: noteid,
                        uid: uid,
                        usernote: note
                        }
                    })
                    .then(function(data) {   
                    });
                });
            }
        });   
    });
});
