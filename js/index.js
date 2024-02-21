
async function getCountryPopulation(country){
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
manual()


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

function parallelWithOrderedCountries({ concurrency = 1 } = {}) {
    console.log(`Processing population of ${countries.length} countries in ${concurrency} parallel requests`);

    const results = [];
    let running = 0;
    let index = 0;

    function run() {
        while (running < concurrency && index < countries.length) {
            const country = countries[index];
            index++;
            running++;
            Promise.resolve(getCountryPopulation(country))
                .then(population => {
                    results.push({ country, population });
                })
                .catch(error => {
                    results.push({ country, error });
                })
                .finally(() => {
                    running--;
                    if (index === countries.length && running === 0) {
                        console.log('All promises resolved');
                        results.forEach(({ country, population, error }) => {
                            if (error) {
                                console.error(`Error for ${country}: ${error.message}`);
                            } else {
                                console.log(`Population of ${country} is ${population}`);
                            }
                        });
                        console.log('Got population for ALL countries');
                    } else {
                        run({ concurrency: 2 });
                    }
                });
        }
    }

    run();
}

// parallelWithOrderedCountries({ concurrency: 6 });