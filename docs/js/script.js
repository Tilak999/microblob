$(document).ready(function(){
  if(location.hash != '') {
    render(location.hash.substr(1))
    preview()
  }
  else {
    var toolbarOptions = [
      [{ 'header': 1}, { 'header': 2}],
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['clean']                                         // remove formatting button
    ];
    
    var quill = new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });
  }
});

function publish() {
  var textcode = $('.ql-editor').html();
  var zipped = pako.gzip(encodeURI(textcode));
  var zipstr = String.fromCharCode.apply(null,zipped)
  console.log(zipped);
  var blob = btoa(zipstr);
  setHash(blob);
  preview();
}

function stringTointArray(str){
  uint = []
  for(i = 0; i < str.length; i++){
    uint.push(str.charCodeAt(i))
  }
  return uint;
}

function preview(el) {
  var text = $(el).text()||"";

  if(text == 'Preview'){
    $(el).text("Edit");
    $('.ql-toolbar').toggle();
    $('.ql-editor').attr('contenteditable','false');
    var inputTitle = $('input.title').val() || "Untitled";
    $('p.title').text(inputTitle).show();
    $('input.title').hide();
  }
  else if(text == 'Edit'){
    $(el).text("Preview");
    $('.ql-toolbar').toggle()
    $('.ql-editor').attr('contenteditable','true')
    var inputTitle = $('input.title').val() || "Untitled";
    $('p.title').text(inputTitle).hide();
    $('input.title').show();
  }
  else{
    $(el).text("Edit");
    $('.ql-toolbar').toggle();
    $('.ql-editor').attr('contenteditable','false');
    $('p.title').show();
    $('input.title').hide();
    $('.header button').hide();
  }
}

function setHash(blob){
  var inputTitle = encodeURI($('input.title').val() || "Untitled")
  location.hash = "#" + inputTitle + "/" + blob
}

function render(data){
  var Title = decodeURI(data.split('/')[0])
  var encodedstr = atob(data.substr(data.indexOf("/")+1,data.length))
  var decodedstr = stringTointArray(encodedstr)
  var unzippedarr = pako.ungzip(decodedstr)
  var urlEncodedStr = String.fromCharCode.apply(null,unzippedarr)
  output = decodeURI(urlEncodedStr)

  $('p.title').text(Title);
  $('#editor').addClass('ql-container ql-snow');
  $('#editor').html('<div class="ql-editor">'+output+'</div>');
}