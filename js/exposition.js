function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function sanitize(word) {
  word = replaceAll(word, ".", "")
  word = replaceAll(word, ",", "")
  word = replaceAll(word, "\"", "")
  word = replaceAll(word, "\'", "")
  word = replaceAll(word, ";", "")
  word = replaceAll(word, ":", "")
  word = replaceAll(word, "/", "")
  word = replaceAll(word, "\\", "")
  word = replaceAll(word, "?", "")
  word = replaceAll(word, "!", "")
  word = replaceAll(word, "~", "")
  word = replaceAll(word, "\`", "")
  word = replaceAll(word, "(", "")
  word = replaceAll(word, ")", "")
  word = replaceAll(word, "[", "")
  word = replaceAll(word, "]", "")
  word = replaceAll(word, "“", "")
  word = replaceAll(word, "”", "")
  word = replaceAll(word, "'", "")
    return word;
}

function signify(passage) {
    $("#result").html("");
    passage = passage.split(" ");
    str = ""
    total = passage.length;
    publish = new Array(total);

    for(count = 0; count < total; count++){
        cleaned = sanitize(passage[count]);


        $.ajax({
          url: "https://dictionary-smartsign.rhcloud.com/videos?keywords=" + cleaned,
          method: 'GET',
          dataType: 'jsonp',
          async: false,
          more: passage[count],
          clean: cleaned,
          rank: count
        }).then(function(data) {
          res = [];
          data.data.forEach(function(element) {
              res.push({"title":element.title, "thumb":element.thumbnailStandard, "youtube":element.id});
          });
          if (data.total > 0) {
             out = "<span onclick=\"modal('" + this.clean + "', '" + replaceAll(JSON.stringify(res), "\"", "_DQUOTE_") + "')\" class='box tooltip' style='cursor:pointer;' > "
             + this.more + "  <span class='tooltiptext' style='font-size: 10pt;'>How to sign \'" + this.clean + "\'</span></span>";
          } else {
            out = this.more + " ";
          }
          publish[this.rank] = out;
          $("#result").html(publish.join(" "));
        });


    }
}

function modal(clean, data) {
  obj = JSON.parse(replaceAll(data, "_DQUOTE_", "\""));
  var modal = document.getElementById('myModal');
  modal.style.display = "block";
  $("#modal-list").html("")
  $("#modal-title").html(clean)
  obj.forEach(function(element) {
    //$("#modal-list").append("<iframe width=\"952\" height=\"536\" src=\"https://www.youtube.com/embed/" + element.youtube + "\" frameborder=\"0\" allowfullscreen></iframe>");
    $("#modal-list").append("<iframe src='http://www.youtube.com/embed/" + element.youtube + "' width=\"800\" height=\"450\" frameborder=\"0\"></iframe>");
  });

}

function extract(noun) {

    $("#img-result").html("");
    $.ajax({
      url: "https://simple.wikipedia.org/w/api.php?action=query&prop=extracts&redirects=1 &format=json&origin=*&exintro=&titles=" + noun,
      method: 'GET',
      dataType: 'json',
      async: true
    }).then(function(data) {
      res = (data.query.pages[Object.keys(data.query.pages)[0]].extract);
      if (!res) {
        res = "No results found!"
        $("#result").html(res);
      } else {
        signify(res);


        $.ajax({
          url: "https://simple.wikipedia.org/w/api.php?action=query&titles=" + noun + "&prop=images&format=json&origin=*&redirects=1",
          method: 'GET',
          dataType: 'json',
          async: true
        }).then(function(imgs) {
            res2 = (imgs.query.pages[Object.keys(data.query.pages)[0]].images);
            res2.forEach(function(element) {


              $.ajax({
                url: "http://simple.wikipedia.org/w/api.php?action=query&titles=" + element.title + "&prop=imageinfo&iiprop=url&format=json&origin=*&redirects=1",
                method: 'GET',
                dataType: 'json',
                async: true
              }).then(function(img) {
                try {
                  url = img.query.pages[Object.keys(img.query.pages)[0]].imageinfo[0].url;
                  insert = ("<img src='" + url + "' style='display: inline; margin: auto; width: 50%; image-rendering:crisp-edges'>")
                  if (insert.indexOf(".svg") == -1 && insert.indexOf(".webm") == -1 && insert.indexOf(".ogv") == -1 && insert.indexOf(".ogg") == -1) {
                    $("#img-result").append(insert);
                  }
                } catch(e){}
              });


            });
        });


      }
    });


}
