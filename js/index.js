
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


async function manual() {
    try {
            const francePopulation = await getCountryPopulation("France");
            console.log(`population of France is ${francePopulation}`);

            const germanyPopulation = await getCountryPopulation("Germany");
            console.log(`population of Germany is ${germanyPopulation}`);

            const netherlandsPopulation = await getCountryPopulation("Netherlands");
            console.log(`population of Netherlands is ${netherlandsPopulation}`);

            const ukPopulation = await getCountryPopulation("United Kingdom");
            console.log(`population of United Kingdom is ${ukPopulation}`);

            const swedenPopulation = await getCountryPopulation("Sweden");
            console.log(`population of Sweden is ${swedenPopulation}`);

            const greecePopulation = await getCountryPopulation("Greece");
            console.log(`population of Greece is ${greecePopulation}`);

            const russiaPopulation = await getCountryPopulation("Russia");
            console.log(`population of Greece is ${russiaPopulation}`);
        } 
            catch (err) {
            console.log('Error in manual:', err.message);
    }
}

// manual();

//------------------------------
//   Sequential processing 
//------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];

async function sequence() {
    for (const country of countries) {
        try {
            const population = await getCountryPopulation(country);
            console.log(`Population of ${country} is ${population}`);
        } catch (err) {
            console.log(`Error for ${country}: ${err.message}`);
        }
    }
}

// sequence();

//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------

async function parallel({ concurrency = 6 } = {}) {
    console.log(`Processing population of ${countries.length} countries in ${concurrency} parallel requests`);

    const result = [];

    for (const country of countries) {
        try {
            const population = await getCountryPopulation(country);
            result.push({ country, population});
            
            } catch (error) {
            result.push({ country, error});
        }
}

    console.log('all promises resolved');
        result.forEach(({ country, population, error}) => {
            if (error) {
                console.error(`Error for ${country}: ${error.message}`);
            } else {
                console.log(`Population of ${country} is ${population}`);
            }
        });
        console.log('Done printing population');
}

parallel({ concurrency: 6 });