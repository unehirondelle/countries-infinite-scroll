import React, {useEffect, useState} from 'react';
import {createServer} from 'miragejs';
import {View, Text} from 'react-native';
import countriesData from '../data/countries';

if (window.server) {
    server.shutdown();
}

window.server = createServer({
    routes() {
        this.get('/api/countries', () => {
            return countriesData;
        })
    },
});

const CountriesList = () => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch('/api/countries')
            .then(res => res.json())
            .then(json => setCountries(json))
            .catch(err => console.log(`/api/countries error ${err}`));
    }, []);

    return (
        <View style={{backgroundColor: 'grey'}}>
            {countries.map(({name}) => (
                <Text key={name}>
                    {name}
                </Text>
            ))}
        </View>
    );
};

export default CountriesList;
