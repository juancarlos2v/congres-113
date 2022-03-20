let titulo = "";
if (document.title.includes("Senate")) {
    titulo = "senate"
} else if (document.title.includes("House")) {
    titulo = "house"
}

let url = `https://api.propublica.org/congress/v1/115/${titulo}/members.json`;
let init = {
    method: 'GET',
    headers: {
        "X-API-Key": "C0oposE3pso6DD7nMfzfpQ8veydVg9MqFx70rY9R"
    }
}

//senate/house-page
if (document.title.includes("Home")) {
    fetch(url, init)
        .then(respuesta => respuesta.json())
        .then(myJson => {
            console.log(myJson)
            miembros = myJson.results[0].members
                //console.log(miembros);
            cargarEstados(miembros);
            creandoTabla(miembros);
        })
}
//attendance page
if (document.title.includes("Attendance")) {
    fetch(url, init)
        .then(respuesta => respuesta.json())
        .then(myJson => {
            console.log(myJson)
            miembros = myJson.results[0].members
                //console.log(miembros);
            glanceTable(miembros)
            leastEngangedTable(miembros);
            mostEngagedTable(miembros)
        })
}
//loyalty page
if (document.title.includes("Loyalty")) {
    fetch(url, init)
        .then(respuesta => respuesta.json())
        .then(myJson => {
            console.log(myJson)
            miembros = myJson.results[0].members
                //console.log(miembros);
            glanceTable(miembros);
            leastloyalTable(miembros);
            mostLoyalTable(miembros)
        })
}

//funciones
function cargarEstados(data) {
    let filterState = [];
    data.forEach(m => {
        if (!filterState.includes(m.state)) {
            filterState.push(m.state)
        }
    });

    filterState.forEach(state => {
        const option = document.createElement('option');

        option.textContent = state;
        option.setAttribute('value', state)

        const select = document.getElementById('selectState');

        option.textContent = state;
        option.setAttribute('value', state)

        select.appendChild(option);
    });

    //console.log(filterState);
}

function creandoTabla(data) {
    //filtro de checkbox
    const checkDemocrats = document.getElementById('checkDemocrats');
    const checkRepublicans = document.getElementById('checkRepublicans');
    const checkIndep = document.getElementById('checkIndep');
    const selectState = document.getElementById('selectState');

    var checkeds = [];

    if (checkDemocrats.checked) {
        checkeds.push(checkDemocrats.value);
    }
    if (checkRepublicans.checked) {
        checkeds.push(checkRepublicans.value);
    }
    if (checkIndep.checked) {
        checkeds.push(checkIndep.value);
    }
    console.log(checkeds);


    let selectValue = selectState.value;
    console.log(selectValue);

    //filtro de estados
    let arrayFilter = [];
    if (selectValue == 'all') {
        arrayFilter = checkeds;
    } else {
        checkeds.forEach(resultados => {
            if (selectValue == resultados.state) {
                arrayFilter.push(resultados);
            }
        })
    }
    //agregando tabla
    const bodyData = document.getElementById('bodyData');
    bodyData.innerHTML = "";

    data.forEach(member => {
        if (checkeds.includes(member.party) && selectValue == 'all') {
            bodyData.innerHTML += `
                <tr> 
                <td> <a href="${member.url}">${member.first_name} ${member.middle_name||"" }${member.last_name}</a></td>
                <td>${member.party}</td>
                <td>${member.state} </td>
                <td>${member.seniority}</td>
                <td>${member.votes_with_party_pct}%</td>
                </tr>   
                    `
        } else if (checkeds.includes(member.party) && selectValue == member.state) {
            bodyData.innerHTML += `
                <tr> 
                <td> <a href="${member.url}">${member.first_name} ${member.middle_name||"" }${member.last_name}</a></td>
                <td>${member.party}</td>
                <td>${member.state} </td>
                <td>${member.seniority}</td>
                <td>${member.votes_with_party_pct}%</td>
                </tr>   
                    `
        }
    });
}

function glanceTable(data) {
    var sumVotedWithParty = 0;
    var sumVotedWithPartyD = 0;
    let sumVotedWithPartyR = 0;
    let sumVotedWithPartyID = 0;

    let memberD = [];
    let memberR = [];
    let memberID = [];

    data.forEach(member => {

        if (member.party == 'D') {
            memberD.push(member);
            statistics.democratas.push(memberD);
            //sumar votos con el partido
            if (member.votes_with_party_pct > 0) {
                sumVotedWithPartyD = sumVotedWithPartyD + member.votes_with_party_pct;
                //console.log(sumVotedWithPartyD)
            }
            //suma de votos partido divird con el total de democratas
        }
        if (member.party == 'R') {
            memberR.push(member);
            statistics.republicanos.push(memberR);
            if (member.votes_with_party_pct > 0) {
                sumVotedWithPartyR = sumVotedWithPartyR + member.votes_with_party_pct;
                //console.log(sumVotedWithPartyR)
            }
        }
        if (member.party == 'ID') {
            memberID.push(member);
            statistics.independientes.push(memberID);
            sumVotedWithPartyID = sumVotedWithPartyID + member.votes_with_party_pct;
        }

        //console.log(member.votes_with_party_pct)
        if (member.votes_with_party_pct >= 0) {
            sumVotedWithParty = sumVotedWithParty + member.votes_with_party_pct;
            console.log("suma: " + sumVotedWithParty);
        }
    });

    //sumar cantidad de votos
    //console.log(memberD);
    totalD = memberD.length;
    statistics.total_democratas = totalD;
    console.log(totalD);

    //console.log(memberR);
    totalR = memberR.length;
    statistics.total_republicanos = totalR;

    //console.log(memberID);
    totalID = memberID.length;
    statistics.total_independientes = totalID;

    statistics.total = totalD + totalR + totalID;

    console.log(sumVotedWithPartyD / totalD);
    let totalSumVotedWithPartyD = sumVotedWithPartyD / totalD;
    console.log(sumVotedWithPartyR / totalR);
    let totalSumVotedWithPartyR = sumVotedWithPartyR / totalR;
    console.log(sumVotedWithPartyID / totalID);
    if (sumVotedWithPartyID == 0) {
        totalSumVotedWithPartyID = 0;
    } else {
        totalSumVotedWithPartyID = sumVotedWithPartyID / totalID;
    }
    console.log(statistics);
    console.log(sumVotedWithParty)
        //table  at a glance
    const bodyGlance = document.querySelectorAll('body-glance');
    bodyGlance.innerHTML = `
    <tr> 
        <td> ${'Democrats'}</td>
        <td> ${totalD}</td>
        <td> ${totalSumVotedWithPartyD.toFixed(2)}%</td>
    </tr>
    <tr> 
        <td> ${'Republicans'}</td>
        <td> ${totalR}</td>
        <td> ${totalSumVotedWithPartyR.toFixed(2)}%</td>
    </tr>
    <tr> 
        <td> ${'Independents'}</td>
        <td> ${totalID}</td>
        <td> ${totalSumVotedWithPartyID.toFixed(2)}%</td>
    </tr>
    <tr> 
        <td> ${'Total'}</td>
        <td> ${statistics.total}</td>
        <td> ${(sumVotedWithParty/statistics.total).toFixed(2)}%</td>
    </tr>
    `
}

function leastEngangedTable(data) {
    const bodyLeastEngaged = document.querySelectorAll('body-least-engaged');

    bodyLeastEngaged.innerHTML = "";

    data.sort((a, b) => {
        if (a.missed_votes_pct < b.missed_votes_pct) {
            return -1;
        }
        if (a.missed_votes_pct > b.missed_votes_pct) {
            return 1;
        }
        return 0;
    });

    //console.log("orden descendente")
    //console.log(data);

    let porcentaje = Math.round(statistics.total / 10);
    //console.log("least enganged perc: " + porcentaje);

    //console.log("porcentaje " + porcentaje);
    let i = 0;
    //console.log("table least engaged");
    data.forEach(member => {
        if (member.missed_votes_pct > 0 && i < porcentaje) {
            // console.log(member.missed_votes_pct);
            bodyLeastEngaged.innerHTML += `
                    <tr> 
                    <td> ${member.first_name} ${member.middle_name||"" }${member.last_name}</td>
                    <td> ${member.missed_votes}</td>
                    <td> ${member.missed_votes_pct}%</td>
                    </tr>
                    `
            i++;
        }
    });
}

function mostEngagedTable(data) {
    const bodyMostEngaged = document.getElementsByClassName('body-most-engaged');
    bodyMostEngaged.innerHTML = "";

    data.sort((a, b) => {
        if (a.missed_votes_pct > b.missed_votes_pct) {
            return -1;
        }
        if (a.missed_votes_pct < b.missed_votes_pct) {
            return 1;
        }
        return 0;
    });

    let porcentaje = Math.round(statistics.total / 10);
    //console.log("most enganged perc: " + porcentaje);

    //console.log("table most engaged");
    let j = 0;
    data.forEach(member => {
        if (member.missed_votes_pct > 0 && j < porcentaje) {
            //console.log(member.missed_votes_pct);
            bodyMostEngaged.innerHTML += `
                    <tr> 
                    <td> ${member.first_name} ${member.middle_name||"" }${member.last_name}</td>
                    <td> ${member.missed_votes}</td>
                    <td> ${member.missed_votes_pct}%</td>
                    </tr>
                    `
            j++;
        }
    });
}

function leastloyalTable(data) {
    const bodyLeastLoyal = document.getElementById('body-least-loyal');
    bodyLeastLoyal.innerHTML = "";

    data.sort((a, b) => {
        if (a.votes_with_party_pct < b.votes_with_party_pct) {
            return -1;
        }
        if (a.votes_with_party_pct > b.votes_with_party_pct) {
            return 1;
        }
        return 0;
    });

    // console.log("orden ascendente")
    // console.log(data);

    let porcentaje = Math.round(statistics.total / 10);
    //console.log("porcentaje least loyal: " + porcentaje);

    let i = 0;
    //console.log("table least loyal");
    data.forEach(member => {
        if (member.missed_votes_pct > 0 && i < porcentaje) {
            //console.log(member.votes_with_party_pct);
            bodyLeastLoyal.innerHTML += `
                    <tr> 
                    <td> ${member.first_name} ${member.middle_name||"" }${member.last_name}</td>
                    <td> ${member.total_votes}</td>
                    <td> ${member.votes_with_party_pct}%</td>
                    </tr>
                    `
            i++;
        }
    });
}

function mostLoyalTable(data) {
    const bodyMostLoyal = document.getElementById('body-most-loyal');
    bodyMostLoyal.innerHTML = "";

    data.sort((a, b) => {
        if (a.votes_with_party_pct > b.votes_with_party_pct) {
            return -1;
        }
        if (a.votes_with_party_pct < b.votes_with_party_pct) {
            return 1;
        }
        return 0;
    });

    // console.log("orden descendente")
    // console.log(data);

    let porcentaje = Math.round(statistics.total / 10);
    //console.log("porcentaje most loyal: " + porcentaje);

    let i = 0;
    //console.log("table most loyal");
    data.forEach(member => {
        if (member.missed_votes_pct > 0 && i < porcentaje) {
            //console.log(member.votes_with_party_pct);
            bodyMostLoyal.innerHTML += `
                    <tr> 
                    <td> ${member.first_name} ${member.middle_name||"" }${member.last_name}</td>
                    <td> ${member.total_votes}</td>
                    <td> ${member.votes_with_party_pct}%</td>
                    </tr>
                    `
            i++;
        }
    });

}