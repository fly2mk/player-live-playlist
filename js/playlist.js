const player = videojs("player");

//Table rows draggable
var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index) {
        $(this).width($originals.eq(index).width())
    });
    return $helper;
},
    updateIndex = function(e, ui) {
        $('td.index', ui.item.parent()).each(function (i) {
            $(this).html(i+1);
        });
        $('input[type=text]', ui.item.parent()).each(function (i) {
            $(this).val(i + 1);
        });
    };

//Table rows re-order
$("#playlist-tbl tbody").sortable({
    helper: fixHelperModified,
    stop: updateIndex
}).disableSelection();

$("tbody").sortable({
    distance: 5,
    delay: 100,
    opacity: 0.6,
    cursor: 'move',
    update: function() {}
});

//Default playlist array. ToDo: Get the playlist from API
var playlist = [
    {
        title: "Sintel trailer",
        src: 'http://media.w3.org/2010/05/sintel/trailer.mp4'    
    },
    {
        title: "Tears of steel",
        src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    }
]


const init = function(){
    updateTableRows();

    player.src({
        src: playlist[0].src,
        type: getVideoType(playlist[0].src)
    });
}

const updateTableRows = function() {
    //Clear the table content to update
    $('#tbl-body').empty()

    var tableRows = '';

    //Iterate table rows
    playlist.map((pl,i)=>{
        var title = pl.title;
        var src = pl.src
        tableRows += '<tr><td>'+title+'</td>'
        +'<td>'
        +'<i class="fa fa-play-circle action" onClick=\'playVideo("'+src+'")\' />'
        +'<i class="fa fa-trash action" onClick=\'deleteVideo('+i+')\' />'
        +'</td></tr>';
    })

    //Update table content
    $('#tbl-body').append(tableRows)
}

//Delete video
const deleteVideo = function(id) {

    $('#confirm').modal({
        backdrop: 'static',
        keyboard: false
    }).on('click', '#delete', function(e) {
        playlist.splice(id, 1); //Pass the playlist id to delete
        updateTableRows();
      });
    $("#cancel").on('click',function(e){
        $('#confirm').modal.model('hide');
    });
}

//Get video type
const getVideoType = function(url) {
    var content_type = "";

    if(url.endsWith(".mp4")){
        content_type = "video/mp4";
    }else if(url.endsWith(".m3u8")){
        content_type = "application/x-mpegURL";
    }else if(url.endsWith(".mpd")){
        content_type = "application/dash+xml"
    }else{
        alert("Unsupported format");
    }

    return content_type
}

//Play video
const playVideo = function(url) {    
    if(url == "")
        alert("Invalid video source")

    player.src({
        src: url,
        type: getVideoType(url)
    });

    player.autoplay(true)
}

//Clear the modal
$('#add-video').click(function(){
    $('#video_url').val("")
    $('#video_title').val("")
})

$('#save').click(function(){
    
    var title = $('#video_title').val();
    var url = $('#video_url').val();

    if (title == '') {
        alert("Title should not be empty");
        return false;
    }else if (url == '') {
        alert("Video url should not be empty");
        return false;
    }

    //Close Add Videos Modal
    $('#playlistVideoAdd').modal('toggle');

    //Append data to playlist array
    playlist.push({title: title, src: url})

    //Update table rows in UI
    updateTableRows();
})

$(document).ready(function(){
    //Initialize with playlist data and generate the table
    init();
})