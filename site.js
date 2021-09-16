function insert_paper(paper, selector) {
    let newLi = document.createElement('li');
    newLi.className = "STYLE13";

    let authors = document.createElement('span');
    authors.className = "author-list";
    authors.innerHTML = paper['authors'];
    delete paper['authors'];

    let title = document.createElement('span');
    title.className = 'paper-title';
    title.innerText = paper['title'];
    delete paper['title'];

    let publication = document.createElement('span');
    publication.className = 'paper-pub';
    publication.innerText = paper['publication'];
    if (publication.innerText.includes('T-PAMI') || publication.innerText.includes('IJCV')) {
        publication.classList.add('color-red');
    }
    delete paper['publication'];

    let extInfo = document.createElement('span');
    extInfo.className = 'paper-ext-info';
    extInfo.innerText = paper['ext-info'];
    delete paper['ext-info'];

    newLi.appendChild(authors);
    newLi.appendChild(title);
    newLi.appendChild(publication);
    newLi.appendChild(extInfo);

    if (paper['link'] !== undefined) {
        let paperLink = document.createElement('a');
        paperLink.className = 'paper-link';
        paperLink.href = paper['link'];
        delete paper['link'];

        newLi.appendChild(paperLink);
    }

    $.each(paper, function (key, value) {
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

$.getJSON('/journal.json', function (data) {
    console.log(data);
    $.each(data, function (i, x) {
        insert_paper(x, '#journal-publications');
    });
});