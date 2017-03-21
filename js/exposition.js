function extract(noun) {


    $.ajax({
      url: "https://crossorigin.me/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + noun,
      method: 'GET',
      dataType: 'json',
      async: false
    }).then(function(data) {
      res = (data.query.pages[Object.keys(data.query.pages)[0]].extract);
      if (!res) {
        res = "No results found!"
        $("#result").html(res);
      } else {
        $("#result").html(res);


        $.ajax({
          url: "https://crossorigin.me/https://en.wikipedia.org/w/api.php?action=query&titles=" + noun + "&prop=images&format=json",
          method: 'GET',
          dataType: 'json',
          async: true
        }).then(function(imgs) {
            res2 = (imgs.query.pages[Object.keys(data.query.pages)[0]].images);
            res2.forEach(function(element) {


              $.ajax({
                url: "https://crossorigin.me/http://en.wikipedia.org/w/api.php?action=query&titles=" + element.title + "&prop=imageinfo&iiprop=url&format=json",
                method: 'GET',
                dataType: 'json',
                async: true
              }).then(function(img) {
                try {
                  url = img.query.pages[Object.keys(img.query.pages)[0]].imageinfo[0].url;
                  insert = ("<img src='" + url + "' style='display: inline; margin: auto; width: 50%; image-rendering:crisp-edges'>")
                  console.log(insert)
                  $("#result").append(insert);
                } catch(e){}
              });


            });
        });


      }
    });


}
