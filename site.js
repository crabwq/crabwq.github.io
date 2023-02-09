function insert_paper(paper, selector) {
    let newLi = document.createElement('li');
    newLi.className = "STYLE13";

    let authors = document.createElement('span');
    authors.className = "author-list";
    authors.innerHTML = paper['authors'].includes('*')
        ? paper['authors'].replace('Q. Wang*', '<b class="star">Q. Wang</b>')
        : paper['authors'].replace('Q. Wang', '<b>Q. Wang</b>');
    newLi.appendChild(authors);

    let title = document.createElement('span');
    title.className = 'paper-title';
    title.innerText = paper['title'];
    newLi.appendChild(title);

    let publication = document.createElement('span');
    if (paper['ext-info'] === "") {
        publication.className = 'paper-pub2';
    } else {
        publication.className = 'paper-pub';
    }
    publication.innerText = paper['publication'];
    // highlight T-PAMI and IJCV
    if (publication.innerText.includes('T-PAMI') || publication.innerText.includes('IJCV')) {
        publication.classList.add('color-red');
    }
    newLi.appendChild(publication);

    if (paper['ext-info'] !== "") {
        let extInfo = document.createElement('span');
        extInfo.className = 'paper-ext-info';
        extInfo.innerText = paper['ext-info'];

        newLi.appendChild(extInfo);
    }

    if (paper['link'] !== undefined) {
        let paperLink = document.createElement('a');
        paperLink.className = 'paper-link';
        paperLink.href = paper['link'];

        newLi.appendChild(paperLink);
    }

    $.each(paper, function (key, value) {
        if (typeof value === 'string') return;
        if (typeof value === 'boolean') return;
        if (value === null || value === undefined) return;

        if (value.length === 1 && typeof value[0] === 'string') {
            let linkGroup = document.createElement('a');
            linkGroup.className = 'link-group';
            linkGroup.classList.add('color-red');
            linkGroup.innerText = key;
            linkGroup.href = value[0];
            newLi.appendChild(linkGroup);
        } else {
            let linkGroup = document.createElement('span');
            linkGroup.className = 'link-group';
            linkGroup.innerText = key;

            for (const i in value) {
                const datasetLink = value[i];

                let link = document.createElement('a');
                link.className = 'link-group-sub';

                if (typeof datasetLink === 'string') {
                    link.href = datasetLink;
                    linkGroup.appendChild(link);
                } else {
                    link.href = datasetLink[0];
                    linkGroup.appendChild(link);

                    let accessCode = document.createElement('span');
                    accessCode.className = 'access-code';
                    accessCode.innerText = datasetLink[1];
                    linkGroup.appendChild(accessCode);
                }
            }
            newLi.appendChild(linkGroup);
        }
    });

    $(selector).append(newLi);
}

// selected journal filter
// false -> hide
let journalFilter = function (data) {
    if (data['hide'] === true) return false;
    if (data['hide'] === false) return true;

    // INCLUDE: first author
    if (data['authors'].startsWith('Q. Wang')) return true;
    if (data['authors'].startsWith('<b')) return true;
    // INCLUDE: IEEE Transaction
    if (data['publication'].includes('IEEE Trans')) return true;
    // INCLUDE: ACM Transaction
    if (data['publication'].includes('ACM Trans')) return true;
    // INCLUDE: IJCV
    if (data['publication'].includes('IJCV')) return true;
    // INCLUDE: GRSL
    if (data['publication'].includes('GRSL')) return true;
    // INCLUDE: paper with code OR dataset OR demo
    if (data['Code'] !== undefined || data['Dataset'] !== undefined || data['Demo'] !== undefined) return true;

    return false;
}

// selected conference filter
// false -> hide
let conferenceFilter = function (data) {
    if (data['hide'] === true) return false;
    if (data['hide'] === false) return true;
    // EXCLUDE: ICASSP
    if (!data['publication'].includes('ICASSP')) return true;
    return false;
}

// journal publications
$.getJSON('/paper/journal.json', function (data) {
    let insertData = function (filter=true) {
        $.each(data, function (i, x) {
            if (!filter || journalFilter(x)) {
                insert_paper(x, '#journal-publications');
            }
        });
    }

    let filter = true;

    insertData(filter);
});

// conference publications
$.getJSON('/paper/conference.json', function (data) {
    let insertData = function (filter=true) {
        $.each(data, function (i, x) {
            if (!filter || conferenceFilter(x)) {
                insert_paper(x, '#conference-publications');
            }
        });
    }

    let filter = true;

    insertData(filter);
});

$.getJSON('https://api.github.com/repos/crabwq/crabwq.github.io/commits', function (data) {
    let commit = data[0]
    let update_time = new Date(commit.commit.committer.date);
    // format update_time to yyyy/MM/dd
    let update_time_str = update_time.getFullYear() + '/' + (update_time.getMonth() + 1) + '/' + update_time.getDate();
    $('#update-time').text(update_time_str);
});

$.getJSON('/graduates.json', function (data) {
    let insertList = function (l) {
        let el = $('#graduates-table')

        for (let i = 0; i < (l.length + 3) / 4; i ++) {
            let innerHtml = '';

            for (let j = i * 4; j < i * 4 + 4 && j < l.length; j++) {
                innerHtml += `
                    <td class="graduates">
                        <img src="/img/graduate/${l[j]["img"]}" alt="" height="200">
                        <br/>
                        ${l[j]['name']}, ${l[j]['finally']}
                        <br/>
                        ${l[j]['job_en']}
                        <br/>
                        (${l[j]['job_zh']})
                    </td>`
            }
            el.html(el.html() + `<tr>${innerHtml}</tr>`)
        }
    }

    let phd = data.filter(x => x['finally'].toLowerCase()[0] === 'p')
    let master = data.filter(x => x['finally'].toLowerCase()[0] === 'm')

    insertList(phd)
    insertList(master)
});
