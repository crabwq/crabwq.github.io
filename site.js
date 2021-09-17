function insert_paper(paper, selector) {
    let newLi = document.createElement('li');
    newLi.className = "STYLE13";

    let authors = document.createElement('span');
    authors.className = "author-list";
    authors.innerHTML = paper['authors'];

    let title = document.createElement('span');
    title.className = 'paper-title';
    title.innerText = paper['title'];

    let publication = document.createElement('span');
    publication.className = 'paper-pub';
    publication.innerText = paper['publication'];
    if (publication.innerText.includes('T-PAMI') || publication.innerText.includes('IJCV')) {
        publication.classList.add('color-red');
    }

    let extInfo = document.createElement('span');
    extInfo.className = 'paper-ext-info';
    extInfo.innerText = paper['ext-info'];

    newLi.appendChild(authors);
    newLi.appendChild(title);
    newLi.appendChild(publication);
    newLi.appendChild(extInfo);

    if (paper['link'] !== undefined) {
        let paperLink = document.createElement('a');
        paperLink.className = 'paper-link';
        paperLink.href = paper['link'];

        newLi.appendChild(paperLink);
    }

    $.each(paper, function (key, value) {
        if (typeof value === 'string') return;

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
    });

    $(selector).append(newLi);
}

let journalFilter = function (data) {
    let ret = false;
    if (data['authors'].startsWith('<b')) ret = true;
    if (data['publication'].includes('IEEE Trans') || data['publication'].includes('ACM Trans')) ret = true;
    if (data['Code'] !== undefined || data['Dataset'] !== undefined || data['Demo'] !== undefined) ret = true;
    return ret;
}

$.getJSON('/journal.json', function (data) {
    let insertData = function (filter=true) {
        $.each(data, function (i, x) {
            if (!filter || journalFilter(x)) {
                insert_paper(x, '#journal-publications');
            }
        });
    }

    let filter = true;

    $('#full-publications').click(function () {
        $('#journal-publications').empty();
        filter ^= true;
        if (filter) {
            $('#selected-publications').text('Selected Journal Publications');
            $('#full-publications').text('Full Journal Publications');
        } else {
            $('#selected-publications').text('Full Journal Publications');
            $('#full-publications').text('Selected Journal Publications');
        }
        insertData(filter);
    });

    insertData(filter);
});

