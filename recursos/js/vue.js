let titulo = "";
if (document.title.includes("Senate")) { titulo = "senate" }
if (document.title.includes("House")) { titulo = "house" }

let url = `https://api.propublica.org/congress/v1/115/${titulo}/members.json`;
let init = {
    method: 'GET',
    headers: {
        "X-API-Key": "C0oposE3pso6DD7nMfzfpQ8veydVg9MqFx70rY9R"
    }
}

fetch(url, init)
    .then(respuesta => respuesta.json())
    .then(myJson => {
        console.log(myJson)
        app.members = myJson.results[0].members;
        statisticsParty(app.members);
        loyalTable(app.members);
        engangedTable(app.members);
        computation(app.estadisticas);
        memberState();
        console.log(app.estadisticas)
        console.log(app.members)
    })

var members = [];
var app = new Vue({
    el: '#bodyData',
    data: {
        message: 'Hello Vue!',
        members: [],
        filtro: [],
        states: [],
        select: 'all',
        check: ['D', 'R', 'ID'],
        estadisticas: {
            totalDemocratas: [],
            totalRepublicanos: [],
            totalIndependientes: [],
            leastEnganged: [],
            mostEnganged: [],
            leastLoyal: [],
            mostLoyal: [],
            totalMiembros: 0,
            totalVotesD: 0,
            totalVotesR: 0,
            totalVotesID: 0,
            totalVotes: 0
        }
    },
    computed: {
        filtr() {
            return this.members.filter(member => {
                if (member.state == this.select || this.select == 'all') {
                    if (this.check.includes(member.party)) {
                        return member.state;
                    }
                }
            })

        }
    }
})

//carga de estados
function memberState() {
    app.members.forEach(member => {
        if (!app.states.includes(member.state)) {
            app.states.push(member.state);
        }
    });
    app.states.sort();
}
//calculo del 10% de miembros para attendance y loyalty
function topNumber(d) {
    d.totalMiembros = d.totalDemocratas.length + d.totalRepublicanos.length + d.totalIndependientes.length;
    return Math.round(d.totalMiembros * 0.1);
}
//separacion de miembros por partido
function statisticsParty(d) {
    app.estadisticas.totalDemocratas = d.filter(miembro => miembro.party == 'D')
    app.estadisticas.totalRepublicanos = d.filter(miembro => miembro.party == 'R')
    app.estadisticas.totalIndependientes = d.filter(miembro => miembro.party == 'ID')
    console.log("10%: " + topNumber(app.estadisticas) + " miembros")
}
//tablas
function engangedTable(d) {
    let i = 0; //Least Enganged
    d.sort((a, b) => {
        if (a.missed_votes_pct < b.missed_votes_pct) { return -1; }
        if (a.missed_votes_pct > b.missed_votes_pct) { return 1; }
        return 0;
    });
    d.forEach(member => {
        if (member.missed_votes_pct > 0 && i < topNumber(app.estadisticas)) {
            app.estadisticas.leastEnganged.push(member);
            i++
        }
    });
    let j = 0; //Most Enganged
    d.sort((a, b) => {
        if (a.missed_votes_pct > b.missed_votes_pct) { return -1; }
        if (a.missed_votes_pct < b.missed_votes_pct) { return 1; }
        return 0;
    });
    d.forEach(member => {
        if (member.missed_votes_pct > 0 && j < topNumber(app.estadisticas)) {
            app.estadisticas.mostEnganged.push(member);
            j++
        }
    });
}

function loyalTable(d) {
    let i = 0; //Least Loyal 
    d.sort((x, y) => {
        if (x.votes_with_party_pct < y.votes_with_party_pct) { return -1; }
        if (x.votes_with_party_pct > y.votes_with_party_pct) { return 1; }
        return 0;
    });
    d.forEach(member => {
        if (member.votes_with_party_pct > 0 && i < topNumber(app.estadisticas)) {
            app.estadisticas.leastLoyal.push(member);
            i++
        }
    });
    let j = 0; //Most Loyal
    d.sort((x, y) => {
        if (x.votes_with_party_pct > y.votes_with_party_pct) { return -1; }
        if (x.votes_with_party_pct < y.votes_with_party_pct) { return 1; }
        return 0;
    });
    d.forEach(member => {
        if (member.votes_with_party_pct > 0 && j < topNumber(app.estadisticas)) {
            app.estadisticas.mostLoyal.push(member);
            j++
        }
    });
}
//calculo de votos y total de miembros por partido
function computation(d) {
    let sumD = sumR = sumID = sumTotal = 0;
    app.members.forEach(miembro => {
        if (miembro.party == 'D' && miembro.votes_with_party_pct >= 0) {
            sumD += miembro.votes_with_party_pct;
        } else if (miembro.party == 'R' && miembro.votes_with_party_pct >= 0) {
            sumR += miembro.votes_with_party_pct;
        } else if (miembro.party == 'ID' && miembro.votes_with_party_pct >= 0) {
            sumID += miembro.votes_with_party_pct;
        }
        if (miembro.votes_with_party_pct > 0) {
            sumTotal += miembro.votes_with_party_pct;
        }
    })
    console.log("suma total de votos(%): " + sumTotal);
    d.totalVotesD = (sumD / d.totalDemocratas.length).toFixed(2);
    d.totalVotesR = (sumR / d.totalRepublicanos.length).toFixed(2);
    if (sumID == 0) {
        d.totalVotesID = 0;
    } else { d.totalVotesID = (sumID / d.totalIndependientes.length).toFixed(2); }
    d.totalVotes = (sumTotal / d.totalMiembros).toFixed(2);
    console.log("promedio de votos(%): " + d.totalVotes);
}