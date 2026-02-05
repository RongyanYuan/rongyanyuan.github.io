var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function( xmlResponse ) {
            // get the contents from search data
            var datas = $( "entry", xmlResponse ).map(function() {
                return {
                    title: $( "title", this ).text(),
                    content: $("content",this).text(),
                    url: $( "url" , this).text()
                };
            }).get();

            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
            var $form = document.getElementById('search-form');

            function buildResults(query) {
                var str='<ul class="search-result-list">';
                var keywords = query.trim().toLowerCase().split(/[\s\-]+/);
                var hasMatch = false;
                datas.forEach(function(data) {
                    var isMatch = true;
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
                    var data_url = data.url;
                    var first_occur = -1;
                    keywords.forEach(function(keyword, i) {
                        var index_title = data_title.indexOf(keyword);
                        var index_content = data_content.indexOf(keyword);

                        if( index_title < 0 && index_content < 0 ){
                            isMatch = false;
                        } else {
                            if (index_content < 0) {
                                index_content = 0;
                            }
                            if (i == 0) {
                                first_occur = index_content;
                            }
                        }
                    });
                    if (isMatch) {
                        hasMatch = true;
                        str += "<li><a href='"+ data_url +"' class='search-result-title'>"+ data_title +"</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g,"");
                        if (first_occur >= 0) {
                            var start = first_occur - 20;
                            var end = first_occur + 80;

                            if(start < 0){
                                start = 0;
                            }

                            if(start == 0){
                                end = 100;
                            }
                            if(end > content.length){
                                end = content.length;
                            }

                            var match_content = content.substr(start, end);

                            keywords.forEach(function(keyword){
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<span class=\"search-keyword\">"+keyword+"</span>");
                            });

                            str += "<p class=\"search-result\">" + match_content +"...</p>"
                        }
                        str += "</li>";
                    }
                });
                str += "</ul>";
                if (!hasMatch) {
                    var isZh = (document.documentElement.lang || '').toLowerCase().startsWith('zh') ||
                               window.location.pathname.indexOf('index-zh.html') !== -1;
                    var emptyMsg = isZh ? '未找到匹配结果。' : 'No matches found.';
                    var fallback = '<div class="search-empty">' + emptyMsg + '</div>';
                    // Show README entry as a fallback
                    var readme = datas.find(function (d) {
                        return d.title.trim().toLowerCase() === 'read me' ||
                               d.title.trim() === '阅读说明';
                    });
                    if (readme) {
                        fallback += '<ul class="search-result-list">' +
                                    "<li><a href='" + readme.url + "' class='search-result-title'>" +
                                    readme.title + "</a></li></ul>";
                    }
                    str = fallback;
                }
                $resultContent.innerHTML = str;
            }

            function getQueryParam() {
                var params = new URLSearchParams(window.location.search);
                return params.get('q') || '';
            }

            if ($form) {
                $form.addEventListener('submit', function(e){
                    e.preventDefault();
                    var query = $input.value.trim();
                    if (!query) {
                        $resultContent.innerHTML = '';
                        return;
                    }
                    var url = new URL(window.location.href);
                    url.searchParams.set('q', query);
                    window.location.href = url.toString();
                });
            }

            var initial = getQueryParam();
            if (initial) {
                $input.value = initial;
                buildResults(initial);
            }
        }
    });
}
