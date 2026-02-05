var searchFunc = function(path, search_id, content_id) {
    'use strict';
    var $input = document.getElementById(search_id);
    var $resultContent = document.getElementById(content_id);
    var $form = document.getElementById('search-form');
    var datas = [];
    var dataReady = false;

    function isZhPage() {
        return (document.documentElement.lang || '').toLowerCase().startsWith('zh') ||
               window.location.pathname.indexOf('index-zh.html') !== -1;
    }

    function buildResults(query) {
        var str = '<ul class="search-result-list">';
        var keywords = query.trim().toLowerCase().split(/[\s\-]+/);
        var hasMatch = false;

        datas.forEach(function(data) {
            var isMatch = true;
            var data_title = data.title.trim().toLowerCase();
            var data_content = data.content.trim().replace(/<[^>]+>/g, '').toLowerCase();
            var data_url = data.url;
            var first_occur = -1;

            keywords.forEach(function(keyword, i) {
                var index_title = data_title.indexOf(keyword);
                var index_content = data_content.indexOf(keyword);

                if (index_title < 0 && index_content < 0) {
                    isMatch = false;
                } else {
                    if (index_content < 0) {
                        index_content = 0;
                    }
                    if (i === 0) {
                        first_occur = index_content;
                    }
                }
            });

            if (isMatch) {
                hasMatch = true;
                str += "<li><a href='" + data_url + "' class='search-result-title'>" + data_title + '</a>';
                var content = data.content.trim().replace(/<[^>]+>/g, '');
                if (first_occur >= 0) {
                    var start = first_occur - 20;
                    var end = first_occur + 80;

                    if (start < 0) {
                        start = 0;
                    }
                    if (start === 0) {
                        end = 100;
                    }
                    if (end > content.length) {
                        end = content.length;
                    }

                    var match_content = content.substr(start, end);
                    keywords.forEach(function(keyword) {
                        var regS = new RegExp(keyword, 'gi');
                        match_content = match_content.replace(regS, '<span class=\"search-keyword\">' + keyword + '</span>');
                    });

                    str += '<p class=\"search-result\">' + match_content + '...</p>';
                }
                str += '</li>';
            }
        });
        str += '</ul>';

        if (!hasMatch) {
            var emptyMsg = isZhPage() ? '未找到匹配结果。' : 'No matches found.';
            var fallback = '<div class=\"search-empty\">' + emptyMsg + '</div>';
            var readme = datas.find(function(d) {
                return d.title.trim().toLowerCase() === 'read me' || d.title.trim() === '阅读说明';
            });
            if (readme) {
                fallback += '<ul class=\"search-result-list\">' +
                            "<li><a href='" + readme.url + "' class='search-result-title'>" +
                            readme.title + '</a></li></ul>';
            }
            str = fallback;
        }

        $resultContent.innerHTML = str;
    }

    function getQueryParam() {
        var params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    function handleSubmit(e) {
        if (e) {
            e.preventDefault();
        }
        var query = $input.value.trim();
        if (!query) {
            $resultContent.innerHTML = '';
            return;
        }
        if (!dataReady) {
            $resultContent.innerHTML = '<div class=\"search-empty\">' + (isZhPage() ? '搜索索引未加载。' : 'Search index not loaded.') + '</div>';
            return;
        }
        var url = new URL(window.location.href);
        url.searchParams.set('q', query);
        window.location.href = url.toString();
    }

    if ($form) {
        $form.addEventListener('submit', handleSubmit);
    }

    fetch(path)
        .then(function(res) {
            if (!res.ok) {
                throw new Error('Failed to load search index');
            }
            return res.text();
        })
        .then(function(xmlText) {
            var parser = new DOMParser();
            var xml = parser.parseFromString(xmlText, 'text/xml');
            var entries = xml.getElementsByTagName('entry');
            datas = Array.prototype.map.call(entries, function(entry) {
                var titleEl = entry.getElementsByTagName('title')[0];
                var contentEl = entry.getElementsByTagName('content')[0];
                var urlEl = entry.getElementsByTagName('url')[0];
                return {
                    title: titleEl ? titleEl.textContent : '',
                    content: contentEl ? contentEl.textContent : '',
                    url: urlEl ? urlEl.textContent : ''
                };
            });
            dataReady = true;

            var initial = getQueryParam();
            if (initial) {
                $input.value = initial;
                buildResults(initial);
            }
        })
        .catch(function() {
            dataReady = false;
        });
};
