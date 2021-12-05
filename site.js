function insert_paper(paper, selector) {
    paper['authors'] = paper['authors'].replace('Q. Wang*', '<b class="star">Q. Wang</b>')

    let newLi = document.createElement('li');
    newLi.className = "STYLE13";

    let authors = document.createElement('span');
    authors.className = "author-list";
    authors.innerHTML = paper['authors'];
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

    // first author
    if (data['authors'].startsWith('<b')) return true;
    // IEEE Transaction OR ACM Transaction
    if (data['publication'].includes('IEEE Trans') || data['publication'].includes('ACM Trans'))
        return true;
    // code OR dataset OR demo
    if (data['Code'] !== undefined || data['Dataset'] !== undefined || data['Demo'] !== undefined) return true;

    return false;
}

// selected conference filter
// false -> hide
let conferenceFilter = function (data) {
    if (data['hide'] === true) return false;
    if (data['hide'] === false) return true;
    // ICASSP
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

    $('#full-j-publications').click(function () {
        $('#journal-publications').empty();
        filter ^= true;
        if (filter) {
            $('#selected-j-publications').text('Selected');
            $('#full-j-publications').text('Full');
        } else {
            $('#selected-j-publications').text('Full');
            $('#full-j-publications').text('Selected');
        }
        insertData(filter);
    });

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

    $('#full-c-publications').click(function () {
        $('#conference-publications').empty();
        filter ^= true;
        if (filter) {
            $('#selected-c-publications').text('Selected');
            $('#full-c-publications').text('Full');
        } else {
            $('#selected-c-publications').text('Full');
            $('#full-c-publications').text('Selected');
        }
        insertData(filter);
    });

    insertData(filter);
});

