import React, {Fragment, useEffect, useState} from 'react';
import {createServer} from 'miragejs';
import {View, Text, Button} from 'react-native';
import countriesData from '../data/countries';

if (window.server) {
    server.shutdown();
}

window.server = createServer({
    routes() {
        this.get(`/api/countries`, (schema, request) => {
            const {offset, limit} = request.queryParams;
            return countriesData.slice(offset, parseInt(offset) + parseInt(limit));
        });
    }
});

const CountriesList = () => {
    const [countries, setCountries] = useState([]);
    const [offsetNumber, setOffsetNumber] = useState(0);

    useEffect(() => {
        fetch(`/api/countries?offset=${offsetNumber}&limit=20`)
            .then(res => res.json())
            .then(json => setCountries(current => current.concat(json)))
            .catch(err => console.log(`/api/countries error ${err}`));
    }, [offsetNumber]);

    return (
        <Fragment>
            <View style={{backgroundColor: 'grey'}}>
                {countries.map(({name}) => (
                    <Text key={name}>
                        {name}
                    </Text>
                ))}
            </View>

            <View>
                <Button title={'More'} onPress={() => setOffsetNumber(offsetNumber + 20)}/>
            </View>
        </Fragment>
    );
};

export default CountriesList;
