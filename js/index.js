
function getCountryPopulation(country){
    return new Promise((resolve,reject)=> {
        const url = `https://countriesnow.space/api/v0.1/countries/population`;
        const options = {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({country})
        };
        fetch(url,options)
            .then(res => res.json())
            .then(json => {
                if (json?.data?.populationCounts) resolve(json.data.populationCounts.at(-1).value);
                else reject(new Error(`My Error: no data for ${country}`)) //app logic error message
            })
            .catch(err => reject(err)) // network error - server is down for example...
            // .catch(reject)  // same same, only shorter... 
    })
}


//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
function manual() {
    getCountryPopulation("France")
        .then( population => {
            console.log(`population of France is ${population}`);
            return getCountryPopulation("Germany")
        })
        .then( population => console.log(`population of Germany is ${population}`))
        .catch(err=> console.log('Error in manual: ',err.message));

    getCountryPopulation("Netherlands")
        .then( population => {
            console.log(`population of Russia is ${population}`);
            return getCountryPopulation("United Kingdom")
        })
        .then( population => console.log(`population of United Kingdom is ${population}`))
    
    getCountryPopulation("Sweden")
        .then( population => {
            console.log(`population of Sweden is ${population}`);
            return getCountryPopulation("Greece")
        })
        .then( population => console.log(`population of Greece is ${population}`))
        .catch(err=> console.log('Error in manual: ',err.message));
}
// manual()


//------------------------------
//   Sequential processing 
//------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];

function sequence() {
    Promise.each(countries, (country) => {
        return getCountryPopulation(country)
            .then(population => {
                console.log(`Population of ${country} is ${population}`);
            })
            .catch(err => {
                console.log(`Error for ${country}: ${err.message}`);
            });
        });
}

// sequence();

//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------

function parallel(items, mapper, { concurrency = Infinity } = {}) {
    console.log(`Processing ${items.length} items in ${concurrency} parallel requests`);

    return Promise.map(items, (item, index) => {
        return Promise.resolve(mapper(item, index, items.length))
            .then(result => ({ index, result }))
            .catch(err => ({ index, error: err }));
    }, { concurrency })
    .then(results => {
        results.sort((a, b) => a.index - b.index);

        results.forEach(({ index, result, error }) => {
            if (error) {
                 console.error(`Error for item at index ${index}: ${error.message}`);
                } else {
                    console.log(`Population of ${items[index]} is ${result}`);
                    }
                });
        console.log('all done!');
    });
}

parallel(countries, getCountryPopulation, { concurrency: 2 });
